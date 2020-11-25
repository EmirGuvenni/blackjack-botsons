const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
        // Send the link embed
        await message.channel.send(new Embed()
            .setColor(0xFCFCFC)
            .setTitle("You could invite me from here.")
            .setDescription(process.env.HOMEPAGE));

        //  Save stats
        client.handlers.get("stats")("invite");
    },
    aliases: [],
    description: "send an invite link"
}
