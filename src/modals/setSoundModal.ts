import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Attachment, EmbedBuilder, MessageFlags, ModalSubmitInteraction } from 'discord.js';
import { db } from '../config/database.ts';
import { s3Bucket, s3Client } from '../config/s3.ts';
import { discordUsersTable } from '../db/schema.ts';

export async function handleSetSoundModal(interaction: ModalSubmitInteraction): Promise<void> {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const soundUpload = interaction.fields.getUploadedFiles('sound-upload')?.first() as Attachment;

    if (!soundUpload?.contentType?.startsWith('audio/')) {
        const errorEmbed = new EmbedBuilder().setColor(0xff0000).setTitle('Fout').setDescription('Upload een audiobestand.');

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
        embeds: [new EmbedBuilder().setColor(0x00ff00).setTitle('Geluid ingesteld!').setDescription(`Je geluid is ingesteld op ${soundUpload.name}`)],
    });
}
