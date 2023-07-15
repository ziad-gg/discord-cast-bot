const { SlashCommandBuilder, GuildMember, EmbedBuilder, Attachment, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CommandBuilder, Message, Interaction } = require('handler.djs');

module.exports = new CommandBuilder()
.setName('embed')
.setDescription('send an embed')
.InteractionOn(new SlashCommandBuilder()
    .setDMPermission(false)
    .addStringOption(op => op.setName('title').setDescription('Embed title here').setMaxLength(400))
    .addStringOption(op => op.setName('description').setDescription('Embed description here').setMaxLength(500))
    .addStringOption(op => op.setName('footer').setDescription('Embed footer text here').setMaxLength(100))
    .addAttachmentOption(op => op.setName('thumbnail').setDescription('Embed thumbnail here'))
    .addAttachmentOption(op => op.setName('image').setDescription('Embed image here'))
    .addAttachmentOption(op => op.setName('icon').setDescription('Embed footer icon here'))
)
.setGlobal(GlobalExecution)
.setInteractionExecution(InteractionExecution)
.isSubCommand()

/**
 * 
 * @param {Message} message 
 * @param {Interaction} interaction 
*/

async function GlobalExecution (message, interaction, global) {
    return global
};

/**
 * 
 * @param {Interaction} interaction 
 * @param {Promise<GuildMember[]>} transparent 
 */

async function InteractionExecution (interaction, transparent) {
    
    const Attachments = getAttachmentsFromMessage(interaction);

    await transparent

    const title = interaction.args.title;
    const description = interaction.args.description;
    const footer = interaction.args.footer;
    const image = Attachments.get(interaction.args.image);
    const thumbnail = Attachments.get(interaction.args.thumbnail);
    const icon = Attachments.get(interaction.args.icon);

    const embed = new EmbedBuilder();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (footer && icon) embed.setFooter({ text: footer, iconURL: icon.url });
    if (footer && !icon) embed.setFooter({ text: footer });
    if (image) embed.setImage(image.url);
    if (thumbnail) embed.setThumbnail(thumbnail.url);

    const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('confirm').setCustomId('confirm').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setLabel('cancel').setCustomId('cancel').setStyle(ButtonStyle.Secondary)
    )

    interaction.editReply({ embeds: [embed], components: [Buttons] });
};

/**
 * @description get Attachments from message
 * @param {Message | Interaction} message 
 * @returns {Map<string, Attachment>}
 */

function getAttachmentsFromMessage (message) {
    /** @type {Map<string, Attachment>} */
    const Attachments = new Map();
    if (!message.Api.data.resolved) return Attachments;
    const keys = Object.keys(message.Api.data.resolved.attachments);

    keys.forEach(async key => {
        const attach = message.Api.data.resolved.attachments[key];
        Attachments.set(attach.id, new Attachment(attach));
    });

    return Attachments;
};