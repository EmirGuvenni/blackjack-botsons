const embed = require('discord.js').MessageEmbed;

module.exports = async(client, guild) => {
    // Get the guild owner
    let owner = await guild.members.fetch(guild.ownerID);

    // Create the developer embed
    let joinEmbed = new embed()
        .setColor(0xFCFCFC)
        .setTitle(guild.name)
        .setDescription([
            `**Guild ID:** ${guild.id}`,
            `**Owner ID:** ${owner.user.id}`,
            `**Owner tag:** ${owner.user.username}#${owner.user.discriminator}`
        ]);
    // Send the embed to the developer server
    client.channels.cache.get(process.env.JOIN_CHANNEL).send(joinEmbed);

    // Create the client embed
    let newGuildEmbed = new embed()
        .setColor(0xFCFCFC)
        .setTitle(`Hello ${owner.user.username}!`)
        .setDescription([
            'To get started use the "/bj help" command or start a game with "/bj deal"!',
            `For more info, please visit ${process.env.HOMEPAGE}`
        ]);
    // Send the client embed to the guild owner
    await owner.send(newGuildEmbed);
}
