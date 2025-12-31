import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const discordUsersTable = pgTable('discord_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    discordId: text('discord_id').notNull().unique(),
    discordUsername: text('discord_username').notNull(),
    soundFilePath: text('sound_file_path').notNull(),
});
