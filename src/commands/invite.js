const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
        // Create the invite embed
        let invEmbed = new Embed()
            .setColor(0xFCFCFC)
            .setTitle("You could invite me from here.")
            .setDescription(process.env.HOMEPAGE);
        // Send the embed
        await message.channel.send(invEmbed);

        //  Save stats
        client.handlers.get("stats")("invite");
    },
    aliases: [],
    description: "send an invite link"
}
