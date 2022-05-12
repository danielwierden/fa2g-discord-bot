const Discord = require('discord.js')
const client = new Discord.Client()

const token = process.env.TOKEN

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

})

client.on('message', async msg => {
    if (msg.content === 'ping') {
        if (msg.member.voice.channel) {
           await play(msg.member.voice.channel)
        }
    }
})

client.on("voiceStateUpdate", async (oldState, newState) => {
    console.log(newState.member.id);
    try {
        if (oldState.channelID !== newState.channelID) {
            // Daniel
            if (newState.member.id === '215177142613442570') {
                await play(newState.member.voice.channel, 'daniel.mp3', .4)
            }

            // Sam
            if (newState.member.id === '186885107733364737') {
                await play(newState.member.voice.channel, 'generic.mp3', .4)
            }

            // Crack
            if (newState.member.id === '302908404802912256') {
                await play(newState.member.voice.channel, 'generic.mp3')
            }

            // Luuk
            if (newState.member.id === '246029303865802769') {
                await play(newState.member.voice.channel, 'luuk.mp3')
            }

            // Jesse
            if (newState.member.id === '138357364418936833') {
                await play(newState.member.voice.channel, 'jesse.mp3')
            }

            // Koen
            if (newState.member.id === '281861705112354817') {
                await play(newState.member.voice.channel, 'koen2.m4a')
            }

            // Lukas
            if (newState.member.id === '190561778634194954') {
                await play(newState.member.voice.channel, 'lukas.wav')
            }

            // Ronnie
            if (newState.member.id === '361098503058882562') {
                await play(newState.member.voice.channel, 'ronald.mp3')
            }
        }
    } catch (e) {
        console.error(e.message)
    }
});

async function play(voiceChannel, song, volume) {
    try {
        const connection = await voiceChannel.join()
        await connection.play(`sounds/${song}`, {
            volume: volume || .3,
        })
    } catch (e) {
        console.error(e.message)
    }
}

client.login(token)