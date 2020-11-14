const embed = require('discord.js').MessageEmbed;

module.exports = async(client, guild) => {
    // Get the guild owner
    let owner = await client.users.cache.get(guild.ownerID);

    // Create the developer embed
    let joinEmbed = new embed()
        .setColor(0xFCFCFC)
        .setTitle(guild.name)
        .setDescription([
            `**Guild ID:** ${guild.id}`,
            `**Owner ID:** ${owner.id}`,
            `**Owner tag:** ${owner.username}#${owner.discriminator}`
        ])
    // Send the embed to the developer server
    client.channels.cache.get(process.env.JOIN_CHANNEL).send(joinEmbed);

    // Create the client embed
    let newGuildEmbed = new embed()
        .setColor(0xFCFCFC)
        .setTitle(`Hello ${owner.username}!`)
        .setDescription([
            'To get started use the "/random help" command or flip a coin with "/random flip"!',
            `For more info, please visit ${process.env.HOMEPAGE}`
        ]);
    // Send the client embed to the guild owner
    await owner.send(newGuildEmbed);
}
