const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
        // Send the link embed
        try{
            await message.channel.send(new Embed()
                .setColor(0xFCFCFC)
                .setTitle("You could invite me from here.")
                .setDescription(process.env.HOMEPAGE));
        }
        catch(err) {
            arg.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("I do not have the permission to embed links.")
            );
        }

        //  Save stats
        client.handlers.get("stats")("invite");
    },
    aliases: [],
    description: "send an invite link"
}
