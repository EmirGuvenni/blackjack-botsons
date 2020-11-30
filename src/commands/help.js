const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
        // Send the help embed
        try{
            await message.channel.send(new Embed()
                .setColor(0xFCFCFC)
                .setTitle("Guide")
                .addFields(
                    {name: "Rules", value:["-Dealer stops at 17", "-There are no deck limits"]},
                    {name: "commands", value: ["**deal:** Starts a new game.", "**join:** Join an ongoing game.", "**leave:** Leave the ongoing game.", "**invite:** Sends a link to bots homepage."]},
                    {name: "Links", value: ["[How to play](https://en.wikipedia.org/wiki/Blackjack)", "[Homepage](https://blackjack.botsons.com)"]}
                ));
        }
        catch(err) {
            await message.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("I do not have the permission to embed links.")
            );
        }

        // Save stats
        client.handlers.get("stats")("help");
    },
    aliases: ["commands", "guide"],
    description: "returns the help list"
}
