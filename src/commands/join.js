const Embed = require('discord.js').MessageEmbed;
const {join} = require('../controller');

module.exports = {
    run: async(client, message) => {
        let game = client.games.get(message.channel.id);
        // Check if there's a game on that channel
        if(!game){
            // Create an error embed
            let errEmbed = new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("There's no ongoing game on this channel. You could start a new one with command '/bj deal'.");
            // Send the embed
            return message.channel.send(errEmbed);
        }
        // Check if the player is already in the game or not
        else if(game.players.get(message.author.id)){
            // Create an error embed
            let errEmbed = new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You're already in this game.");
            // Send the embed
            return message.channel.send(errEmbed);
        }

        // Add the player
        await join(client, message);

        // Save stats
        client.handlers.get("stats")(client, "join");
    },
    aliases: ["commands"],
    description: "returns the help list"
}
