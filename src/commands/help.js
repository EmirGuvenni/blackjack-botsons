const embed = require('discord.js').MessageEmbed;
const Stats = require('../database/models/stats');

module.exports = {
    run: async(client, message) => {
        // Create an embed
        let helpEmbed = new embed()
            .setColor(0xFCFCFC)
            .setTitle("Command list")
            .setDescription([
                "**card:** Picks a random card.",
                "**dice:** Rolls the die.",
                "**flip:** Flips a coin.",
                "**invite:** Sends a link to bots homepage.",
                "**number:** Picks a random number between 1 and 10 or the provided number.",
                "**select:** Picks a random argument from the array."
            ]);
        // Send the embed
        await message.channel.send(helpEmbed);

        // Save stat
        try {
            const reqStats = await Stats.findOne();
            reqStats.help++;
            reqStats.save();
        }
        catch(err) {
            client.handlers.get("error")(client, err, __filename);
        }
    },
    aliases: ["commands"],
    description: "returns the help list"
}
