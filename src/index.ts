import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits } from "discord.js";
import axios from "axios";
import { createAudioPlayer } from "@discordjs/voice";
import play from "./support/play";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

const player = createAudioPlayer();

axios.defaults.baseURL = process.env.API_URL;

client.on(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag} on ${c.guilds.cache.size} guilds}`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channelId !== newState.channelId && newState.member.id !== client.user.id) {
        let audioFile;

        try {
            const { data: { data } } = await axios.get(`/api/discord-users/${newState.member.id}`);
            audioFile = data.audio_file;
        } catch {
            audioFile = 'sounds/generic.mp3'
        } finally {
            await play(player, newState.member.voice.channel, audioFile);
        }
    }
});

void client.login(process.env.TOKEN);