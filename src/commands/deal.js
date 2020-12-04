const Embed = require('discord.js').MessageEmbed;
const Game = require('../classes/game');
const Player = require('../classes/player');

module.exports = {
    run: async(client, message) => {
        await message.delete();
        // Check if there's a game on that channel
        if(client.games.get(message.channel.id))
            return message.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("There's already a game on this channel."));

        // Create a new lobby
        client.games.set(message.channel.id, new Game(client, message));
        // Set the player
        client.games.get(message.channel.id).players.set(message.author.id, new Player(message.author));

        client.emit("getBets", message);

        // Save stats
        client.handlers.get("stats")("deal");
    },
    aliases: ["start"],
    description: "starts a game of blackjack"
}
