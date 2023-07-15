const { SlashCommandBuilder, GuildMember, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');
const { CommandBuilder, Message, Interaction } = require('handler.djs');
const DiscordMessage = require('../utils/message.js')

module.exports = new CommandBuilder()
.setName('message')
.setDescription('send an message')
.InteractionOn(new SlashCommandBuilder()
    .setDMPermission(false)
    .addStringOption(op => op.setName('content').setDescription('message content here').setRequired(true)) 
)
.setGlobal(GlobalExecution)
.setInteractionExecution(InteractionExecution)
.isSubCommand()

/**
 * 
 * @param {Message} message 
 * @param {Interaction} interaction 
*/

async function GlobalExecution(message, interaction, global) {
    return global
};

/**
 * 
 * @param {Interaction} interaction 
 * @param {GuildMember[]} transparent 
 */

async function InteractionExecution(interaction, transparent) {
    const content = interaction[0];
    await transparent;
 
    const image = await DiscordMessage(content, interaction.client.user.username, new Date(),interaction.client.user.avatarURL())
    const Attachment = new AttachmentBuilder(image, { name: 'image.png' });


    const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('confirm').setCustomId('confirm').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setLabel('cancel').setCustomId('cancel').setStyle(ButtonStyle.Secondary)
    )

    interaction.editReply({ content, files: [Attachment], components: [Buttons] });
}