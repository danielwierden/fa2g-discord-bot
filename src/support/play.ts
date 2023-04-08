import type { VoiceBasedChannel } from "discord.js";
import { AudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";

export default async (player: AudioPlayer, voiceChannel: VoiceBasedChannel, song: string, volume = .3, ) => {
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