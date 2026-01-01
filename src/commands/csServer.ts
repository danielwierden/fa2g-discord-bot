import axios from 'axios';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getDokployConfig } from '../config/env.ts';

const dokployConfig = getDokployConfig();

const ApplicationStatus = {
    Done: 'done',
    Idle: 'idle',
    Error: 'error',
} as const;

type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export default {
    data: new SlashCommandBuilder().setName('cs-server').setDescription('Beheer de fa2g cs2 server'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        const dokployApplication = await axios.get(`${dokployConfig.apiBaseUrl}/application.one?applicationId=${dokployConfig.csServerAppId}`, {
            headers: {
                'x-api-key': `${dokployConfig.apiKey}`,
            },
        });

        const status = dokployApplication.data.applicationStatus as ApplicationStatus;

        if (status === ApplicationStatus.Error) {
            await interaction.editReply(`CS server is in error state. Please contact an administrator.`);
            return;
        }

        await interaction.editReply(`CS server is ${status}`);
    },
};
