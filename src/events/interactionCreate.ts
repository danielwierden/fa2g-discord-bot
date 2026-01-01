import { Events, type Client } from 'discord.js';
import commands from '../commands/index.ts';
import { handleSetSoundModal } from '../modals/setSoundModal.ts';

export function registerInteractionCreateEvent(client: Client): void {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = commands.find((command) => command.data.name === interaction.commandName);
            if (command) {
                await (command as any).execute(interaction);
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'set-sound-modal') {
                await handleSetSoundModal(interaction);
            }
        }
    });
}
