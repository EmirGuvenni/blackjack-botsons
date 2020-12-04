const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
        await message.delete();
        let game = client.games.get(message.channel.id);
        // Check if there's a game on that channel
        if(!game)
            return message.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("There's no ongoing game on this channel. You could start a new one with command '/bj deal'."));

        // Check if the player is already in the game or not
        else if(!game.players.get(message.author.id))
            return message.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You're not in the game."));

        client.emit("playerLeft", message.channel.id, message.author.id);

        // Save stats
        client.handlers.get("stats")("leave");
    },
    aliases: ["commands"],
    description: "returns the help list"
}
