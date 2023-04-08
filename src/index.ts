import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, VoiceBasedChannel } from "discord.js";
import axios from "axios";
import { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";

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

const token = process.env.TOKEN;

axios.defaults.baseURL = process.env.API_URL;

client.on(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channelId !== newState.channelId) {
        if (newState.member.id === client.user.id) {
            return;
        }

        let audioFile;

        try {
            const { data: { data } } = await axios.get(`/api/discord-users/${newState.member.id}`);
            audioFile = data.audio_file;
        } catch {
            audioFile = 'sounds/generic.mp3'
        } finally {
            await play(newState.member.voice.channel, audioFile);
        }
    }
});

async function play(voiceChannel: VoiceBasedChannel, song: string, volume = .3): Promise<void> {
    console.log('playing')
    try {
        const connection = await joinVoiceChannel({
            channelId     : voiceChannel.id,
            guildId       : voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        connection.subscribe(player);

        const resource = createAudioResource(song, { inlineVolume: true });

        resource.volume?.setVolume(volume);

        player.play(resource);
    } catch (e: any) {
        console.error(e.message);
    }
}

void client.login(token);