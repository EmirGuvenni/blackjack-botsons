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
            await message.channel.send("Missing permission: Embed links.");
        }

        //  Save stats
        client.handlers.get("stats")("invite");
    },
    aliases: [],
    description: "send an invite link"
}
