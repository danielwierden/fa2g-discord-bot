import { REST, Routes } from 'discord.js';
import commands from './commands/index.ts';
import { createDiscordClient } from './config/discord.ts';
import { validateEnv } from './config/env.ts';
import { registerInteractionCreateEvent } from './events/interactionCreate.ts';
import { registerReadyEvent } from './events/ready.ts';
import { registerVoiceStateUpdateEvent } from './events/voiceStateUpdate.ts';
import { setupFFmpeg } from './utils/ffmpeg.ts';

// Setup FFmpeg
setupFFmpeg();

// Validate environment variables
const { token, clientId } = validateEnv();

// Register commands
const rest = new REST({ version: '10' }).setToken(token);

try {
    console.log('Started refreshing application commands.');
    await rest.put(Routes.applicationCommands(clientId), { body: commands.map((command) => command.data) });
    console.log('Successfully reloaded application commands.');
} catch (error) {
    console.error(error);
}

// Create and configure Discord client
const client = createDiscordClient();

// Register event handlers
registerReadyEvent(client);
registerVoiceStateUpdateEvent(client);
registerInteractionCreateEvent(client);

// Login to Discord
client.login(token);
