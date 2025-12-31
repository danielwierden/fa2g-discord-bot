import type { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import type { VoiceBasedChannel } from 'discord.js';

export const handleJoinSoundPlay = async (channel: VoiceBasedChannel, sound: GetObjectCommandOutput) => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
        const player = createAudioPlayer();

        await entersState(connection, VoiceConnectionStatus.Ready, 5_000);

        connection.subscribe(player);

        const resource = createAudioResource(sound.Body as ReadableStream);

        player.play(resource);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.disconnect();
            connection.destroy();

            player.stop();
        });

        return;
    } catch (error) {
        connection.destroy();
        console.error(error);
    }
};
