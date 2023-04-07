import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, VoiceBasedChannel } from "discord.js";
import axios from "axios";
import { joinVoiceChannel } from "@discordjs/voice";

dotenv.config();

const client = new Client({intents: [GatewayIntentBits.Guilds]});
const token = process.env.TOKEN;

axios.defaults.baseURL = process.env.API_URL;

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channelId !== newState.channelId) {
        if (newState.member.id === '322078390989488138') return;

        let audioFile;

        try {
            const {data: {data}} = await axios.get(`/api/discord-users/${newState.member.id}`);
            audioFile = data.audio_file;
        } catch {
            audioFile = 'sounds/generic.mp3'
        } finally {
            await play(newState.member.voice.channel, audioFile);
        }
    }
});

async function play(voiceChannel: VoiceBasedChannel, song: string, volume: number = .3): Promise<void> {
    try {
        const connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        // await connection.play(`${song}`, {
        //     volume: volume || .3,
        // });
    } catch (e) {
        console.error(e.message);
    }
}

client.login(token);