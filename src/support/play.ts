import type { VoiceBasedChannel } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import connectToChannel from "./connectToChannel";

export default async (voiceChannel: VoiceBasedChannel, song: string, volume = .3, ) => {
    try {
        const player = createAudioPlayer();

        const connection = await connectToChannel(voiceChannel);

        connection.subscribe(player);

        const resource = createAudioResource(song, { inlineVolume: true });

        resource.volume?.setVolume(volume);

        player.play(resource);

        player.on(AudioPlayerStatus.Idle || AudioPlayerStatus.Paused, () => {
            connection.destroy();
        });
    } catch (e: any) {
        voiceChannel.send(`Er is een fout opgetreden: ${e.message}`);
    }
}