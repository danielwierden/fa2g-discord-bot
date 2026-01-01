import { Events, type Client } from 'discord.js';

export function registerReadyEvent(client: Client): void {
    client.once(Events.ClientReady, (c) => {
        console.log(`Ready! Logged in as ${c.user.tag} on ${c.guilds.cache.size} guilds`);
    });
}
