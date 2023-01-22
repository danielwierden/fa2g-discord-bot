const Discord = require('discord.js')
const axios = require("axios");
const client = new Discord.Client();

const token = process.env.TOKEN;
const apiUrl = process.env.API_URL;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.channelID !== newState.channelID) {
        if (newState.member.id === '322078390989488138') return;

        let audioFile;

        try {
            const {data: {data}} = await axios.get(`${apiUrl}/api/discord-users/${newState.member.id}`);
            audioFile = data.audio_file;
        } catch {
            audioFile = 'sounds/generic.mp3'
        } finally {
            await play(newState.member.voice.channel, audioFile);
        }
    }
});

async function play(voiceChannel, song, volume) {
    try {
        const connection = await voiceChannel.join();
        await connection.play(`${song}`, {
            volume: volume || .3,
        });
    } catch (e) {
        console.error(e.message);
    }
}

client.login(token);