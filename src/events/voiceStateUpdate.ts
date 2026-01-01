import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Events, type Client, type VoiceBasedChannel } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.ts';
import { s3Bucket, s3Client } from '../config/s3.ts';
import { discordUsersTable } from '../db/schema.ts';
import { handleJoinSoundPlay } from '../handlers/handleJoinSoundPlay.ts';

export function registerVoiceStateUpdateEvent(client: Client): void {
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        if (!newState.channelId || oldState.channelId === newState.channelId || newState.member?.id === client.user?.id) return;

        const user = await db.query.discordUsersTable.findFirst({
            where: eq(discordUsersTable.discordId, newState.member?.id as string),
        });

        let sound;

        if (user) {
            const soundFilePath = user.soundFilePath;

            if (!soundFilePath) return;

            sound = await s3Client.send(
                new GetObjectCommand({
                    Bucket: s3Bucket,
                    Key: soundFilePath,
                }),
            );
        } else {
            sound = await s3Client.send(
                new GetObjectCommand({
                    Bucket: s3Bucket,
                    Key: 'sounds_generic.mp3',
                }),
            );
        }

        await handleJoinSoundPlay(newState.channel as VoiceBasedChannel, sound);
    });
}
