const Embed = require('discord.js').MessageEmbed;
const {getBets} = require('../classes/game');
const {Player} = require('../classes/player');

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

        // Add the new player
        await client.games.get(message.channel.id).players.set(message.author.id, new Player(message.author));
        await message.channel.send(`**${client.games.get(message.channel.id).players.get(message.author.id).tag}** has joined the game!`);

        // Check if the game is in "bet" state or not
        if(client.games.get(message.channel.id).state === "bet")
            await getBets(client, message);

        // Save stats
        client.handlers.get("stats")("join");
    },
    aliases: ["commands"],
    description: "returns the help list"
}
