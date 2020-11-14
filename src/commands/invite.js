const embed = require('discord.js').MessageEmbed;
const Stats = require('../database/models/stats');

module.exports = {
    run: async(client, message) => {
        // Create the invite embed
        let invEmbed = new embed()
            .setColor(0xFCFCFC)
            .setTitle("You could invite me from here.")
            .setDescription(process.env.HOMEPAGE);
        // Send the embed
        await message.channel.send(invEmbed);

        //  Save stats
        try {
            const reqStats = await Stats.findOne();
            reqStats.invite++;
            reqStats.save();
        }
        catch(err) {
            client.handlers.get("error")(client, err, __filename);
        }
    },
    aliases: [],
    description: "send an invite link"
}
