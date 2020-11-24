const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
        // Create an embed
        let helpEmbed = new Embed()
            .setColor(0xFCFCFC)
            .setTitle("Command list")
            .setDescription([
                "**deal:** Starts a new game.",
                "**join:** Join an ongoing game.",
                "**leave:** Leave the ongoing game.",
                "**invite:** Sends a link to bots homepage."
            ]);
        // Send the embed
        await message.channel.send(helpEmbed);

        // Save stats
        client.handlers.get("stats")("help");
    },
    aliases: ["commands"],
    description: "returns the help list"
}
