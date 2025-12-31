// Configure FFmpeg path - use ffmpeg-static if system FFmpeg is not available
import ffmpegStatic from 'ffmpeg-static';
if (ffmpegStatic && !process.env.FFMPEG_PATH) {
    process.env.FFMPEG_PATH = ffmpegStatic;
}

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
    Attachment,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    Events,
    FileUploadBuilder,
    GatewayIntentBits,
    LabelBuilder,
    MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction,
    REST,
    Routes,
    type VoiceBasedChannel,
} from 'discord.js';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './db/schema.ts';
import { discordUsersTable } from './db/schema.ts';
import { handleJoinSoundPlay } from './handlers/handleJoinSoundPlay.ts';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const s3Endpoint = process.env.S3_ENDPOINT as string;
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID as string;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string;
const s3Bucket = process.env.S3_BUCKET as string;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: s3Endpoint,
    credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
    },
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema });

if (!token || !clientId) {
    throw new Error('DISCORD_TOKEN or DISCORD_CLIENT_ID is not set');
}

const commands = [
    {
        name: 'set-sound',
        description: 'Sets the joining sound for the user',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

try {
    console.log('Started refreshing application commands.');
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Successfully reloaded application commands.');
} catch (error) {
    console.error(error);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag} on ${c.guilds.cache.size} guilds`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (!newState.channelId || oldState.channelId === newState.channelId || newState.member?.id === client.user?.id) return;

    const user = await db.query.discordUsersTable.findFirst({
        where: eq(discordUsersTable.discordId, newState.member?.id as string),
    });

    if (!user) return;

    const soundFilePath = user.soundFilePath;

    if (!soundFilePath) return;

    const sound = await s3Client.send(
        new GetObjectCommand({
            Bucket: s3Bucket,
            Key: soundFilePath,
        }),
    );

    await handleJoinSoundPlay(newState.channel as VoiceBasedChannel, sound);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        await handleCommand(interaction);
    }
    if (interaction.isModalSubmit()) {
        await handleModal(interaction);
    }
});

const handleCommand = async (interaction: ChatInputCommandInteraction) => {
    if (interaction.commandName === 'set-sound') {
        const modal = new ModalBuilder().setCustomId('set-sound-modal').setTitle('Set Sound');

        const soundUpload = new FileUploadBuilder().setCustomId('sound-upload').setRequired(true).setMinValues(1).setMaxValues(1);

        const soundUploadLabel = new LabelBuilder()
            .setLabel('Sound')
            .setDescription('Upload the sound you want to set')
            .setFileUploadComponent(soundUpload);

        modal.addLabelComponents(soundUploadLabel);

        await interaction.showModal(modal);
    }
};

const handleModal = async (interaction: ModalSubmitInteraction) => {
    if (interaction.customId === 'set-sound-modal') {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const soundUpload = interaction.fields.getUploadedFiles('sound-upload')?.first() as Attachment;

        if (!soundUpload?.contentType?.startsWith('audio/')) {
            const errorEmbed = new EmbedBuilder().setColor(0xff0000).setTitle('Error').setDescription('Please upload an audio file.');

            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        const soundFilePath = `${interaction.user.id}/${soundUpload.name}`;

        // Download the file from Discord's CDN
        const fileResponse = await fetch(soundUpload.url);
        const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

        await s3Client.send(
            new PutObjectCommand({
                Bucket: s3Bucket,
                Key: soundFilePath,
                Body: fileBuffer,
            }),
        );

        await db
            .insert(discordUsersTable)
            .values({
                discordId: interaction.user.id,
                discordUsername: interaction.user.username,
                soundFilePath: soundFilePath,
            })
            .onConflictDoUpdate({
                target: [discordUsersTable.discordId],
                set: {
                    discordUsername: interaction.user.username,
                    soundFilePath: soundFilePath,
                },
            });

        await interaction.editReply({
            embeds: [new EmbedBuilder().setColor(0x00ff00).setTitle('Sound set!').setDescription(`Your sound has been set to ${soundFilePath}`)],
        });
    }
};

client.login(token);
