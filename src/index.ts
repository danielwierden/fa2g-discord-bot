import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits } from "discord.js";
import axios from "axios";
import initiateDatabase from "./database";
import play from "./support/play";
import { User } from "./models/User";

dotenv.config();
axios.defaults.baseURL = process.env.API_URL;

void initiateDatabase();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.on(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag} on ${c.guilds.cache.size} guilds`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channelId !== newState.channelId && newState.member.id !== client.user.id) {
        let audioFile;

        try {
            // const { data: { data } } = await axios.get(`/api/discord-users/${newState.member.id}`);
            const user = await User.findOne({ where: { discordId: newState.member.id } });
            audioFile = user.audioFile;
        } catch {
            audioFile = 'sounds/generic.mp3'
        } finally {
            await play(newState.member.voice.channel, audioFile);
        }
    }
});

client.on(Events.MessageCreate, async message => {
    if (!message.guild || !message.content.startsWith('!setsound')) {
        return;
    }

    const sound = message.attachments.first()?.url;

    if (!sound) {
        await message.reply('Je moet een geluid meesturen!');

        return;
    }

    try {
        await User.upsert({
            discordId: message.author.id,
            audioFile: sound,
        });

        console.log(await User.findAll())

        await message.reply('Je geluid is ingesteld!');
    } catch (e: any) {
        await message.reply(`Er is een fout opgetreden: ${e.message}`);
    }
});

void client.login(process.env.TOKEN);