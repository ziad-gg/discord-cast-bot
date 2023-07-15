const { Events, Client } = require('discord.js');
const { EventBuilder } = require('handler.djs');

module.exports = new EventBuilder()
    .setEvent(Events.ClientReady)
    .setExecution(Execute)

/**
 * 
 * @param {Client} client 
 */

async function Execute(client) {
    console.log('(%s) Connected to discord socket', client.user.tag);
}