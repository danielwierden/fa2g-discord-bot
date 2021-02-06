const Discord = require('discord.js')
const client = new Discord.Client()
const token = ''

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

client.on("voiceStateUpdate", async (oldMember, newMember) => {
    if (newMember.channelID === '698987936255049768') return

    // console.log(newMember.member.id);
    try {
        if (oldMember.channelID !== newMember.channelID) {

            // Daniel
            if (newMember.member.id === '215177142613442570') {
                await play(newMember.member.voice.channel, 'generic.mp3')
            }

            // Luuk
            if (newMember.member.id === '246029303865802769') {
                await play(newMember.member.voice.channel, 'luuk.mp3')
            }

            // Koen
            if (newMember.member.id === '281861705112354817') {
                await play(newMember.member.voice.channel, 'koen.mp3')
            }

            // Lukas
            if (newMember.member.id === '190561778634194954') {
                await play(newMember.member.voice.channel, 'lukas.wav')
            }
        }
    } catch (e) {
        console.error(e.message)
    }
});

async function play(voiceChannel, song) {
    try {
        const connection = await voiceChannel.join()
        const dispatcher = await connection.play(`sounds/${song}`, {
            volume: 0.3,
        })

        dispatcher.on('finish', () => {
            connection.disconnect();
        });
    } catch (e) {
        console.error(e.message)
    }
}

client.login(token)