const { SlashCommandBuilder } = require('discord.js');
const { CommandBuilder, Interaction } = require('handler.djs');

module.exports = new CommandBuilder()
.setName('cast')
.setDescription('Send (Message / Embed) to all users')
.InteractionOn(new SlashCommandBuilder())
.setGlobal(Global)
.setSubcommands([
    { command: 'embed' },
    { command: 'message' },
])
.OwnersOnly()

/**
 * 
 * @param {Message} message 
 * @param {Interaction} interaction 
 */

async function Global (message, interaction) {
   await interaction.deferReply();
//    interaction.editReply({ content: '> **Please be patient while fetching guild member**' });

//   const members = await interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
// 	const totalOnline = fetchedMembers.filter(member => member.presence?.status !== 'offline');
// 	console.log(`There are currently ${totalOnline.size} members online in this guild!`);
//     return members;
//   });

  return [];
};