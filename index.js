const { Client, GatewayIntentBits, Partials, GatewayDispatchEvents } = require('discord.js');
const { Application } = require('handler.djs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.GuildMember, Partials.User]
});

new Application(client, {
  prefix: '-',
  commandsPath: path.join(__dirname, 'commands'),
  EventsPath: path.join(__dirname, 'events'),
  owners: ['8608659509453783251'],
});


client.Application.build();

client.login(process.env.BOT_TOKEN);
