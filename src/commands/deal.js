const Game = require('../classes/game');
const Embed = require('discord.js').MessageEmbed;
const Stats = require('../database/models/stats');

module.exports = {
    run: async(client, message) => {
        // Check if there's a game on that channel
        if(client.games.get(message.channel.id)) {
            // Create an error embed
            let errEmbed = new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("There's already a game on this channel.");
            // Send the embed
            return message.channel.send(errEmbed);
        }

        // Register a new game
        client.games.set(message.channel.id, new Game(client, message));
        client.games.get(message.channel.id).initialize();

        // Save stats
        client.handlers.get("stats")(client, "deal");
    },
    aliases: ["start"],
    description: "starts a game of blackjack"
}
