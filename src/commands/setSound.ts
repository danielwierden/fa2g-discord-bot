import { ChatInputCommandInteraction, FileUploadBuilder, LabelBuilder, ModalBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('set-sound').setDescription('Stelt het join geluid in voor de gebruiker'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const modal = new ModalBuilder().setCustomId('set-sound-modal').setTitle('Geluid instellen');

        const soundUpload = new FileUploadBuilder().setCustomId('sound-upload').setRequired(true).setMinValues(1).setMaxValues(1);

        const soundUploadLabel = new LabelBuilder()
            .setLabel('Geluid')
            .setDescription('Upload het geluid dat je wilt instellen')
            .setFileUploadComponent(soundUpload);

        modal.addLabelComponents(soundUploadLabel);

        await interaction.showModal(modal);
    },
};
