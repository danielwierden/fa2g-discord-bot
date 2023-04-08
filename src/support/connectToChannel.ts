import type { VoiceBasedChannel } from "discord.js";
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";

export default async (channel: VoiceBasedChannel) => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}