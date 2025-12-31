import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('test').setDescription('Test command'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!');
    },
};
