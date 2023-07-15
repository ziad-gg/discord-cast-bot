const { Interaction, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionReplyOptions, Collection, ActivityFlags, Status, Message, EmbedBuilder } = require('discord.js');
const { EventBuilder } = require('handler.djs');
const wait = require('node:timers/promises').setTimeout;

module.exports = new EventBuilder()
    .setEvent('ButtonClick')
    .setExecution(Execute)



let fails = 0;


const Buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel('confirm').setCustomId('confirm').setStyle(ButtonStyle.Danger).setDisabled(true),
    new ButtonBuilder().setLabel('cancel').setCustomId('cancel').setStyle(ButtonStyle.Secondary).setDisabled(true)
);
/**
 * 
 * @param {Interaction} interaction 
*/
async function Execute(interaction) {

    if (!interaction.client.Application.owners.includes(interaction.user.id)) return interaction.reply({ content: '> 🔴 **You dont have permisson to use this**', ephemeral: true })

    fails = 0;
    if (interaction.customId === 'confirm') {

        interaction.update({ components: [Buttons] });

        /** @type {Promise<Collection<string, GuildMember>>} */
        const members = await interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
            const totalOnline = fetchedMembers.filter(member => (member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idel') && !member.user.bot);
            console.log(`There are currently ${totalOnline.size} members online in this guild!`);
            return totalOnline;
        });

        const MessagePayload = {};
        const content = interaction.message.content;
        const embed = interaction.message?.embeds?.[0];

        if (embed) MessagePayload.embeds = [embed];
        if (content) MessagePayload.content = content;

        let x = false;
        let GuildMembers = members.size;
        let GuildMembersKeys = [...members.keys()];
        let LastGuildMemberIndex = 0;
        let next = true;

        while (x === false) {

            if (GuildMembers === LastGuildMemberIndex) {
                interaction.message.edit({ content: `message sent to (${LastGuildMemberIndex - fails}/${GuildMembers}) of users` })
                return x = true;
            };

            const id = GuildMembersKeys[LastGuildMemberIndex];
            const member = members.get(id);
            if (!next) continue;

            next = false;

            if (member) {
                LastGuildMemberIndex += 1
                await SendMessage(member, MessagePayload, interaction.message, LastGuildMemberIndex - 1).then(() => {
                    next = true;
                }).catch(() => {
                    next = true;
                });
            } else next = true;
        };

    } else if (interaction.customId === 'cancel') {
        interaction.update({ components: [Buttons] });
    };
};

/**
 * 
 * @param {GuildMember} User 
 * @param {InteractionReplyOptions} payload 
 * @param {Message} message
 * @param {Number} count
 */


async function SendMessage(User, payload, message, count) {
    const embeds = [];
    if (payload?.embeds?.[0]) embeds.push(...payload.embeds);

    count = count + 1;

    const GreenEmbed = new EmbedBuilder('Green').setDescription(`> 🟢 **Message sent to (${count - fails}) user**`)
    const RedEmbed = new EmbedBuilder('Red').setDescription(`> 🔴 **Message sent to (${(count - 1)}) user**`);

    return new Promise((resolve, reject) => {
        User.send(payload).then(async () => {
            await wait(700);
            message.edit({ content: '' +User.user.username, embeds: [...embeds, GreenEmbed], components: [Buttons] })
            resolve()
        }).catch(async (e) => {
            fails += 1
            message.edit({ content: `Failed to send message to ${User.user.username}`, embeds: [...embeds, RedEmbed], components: [Buttons] })
            await wait(500);
            reject('Faild to send message to this user');
        });
    });
}