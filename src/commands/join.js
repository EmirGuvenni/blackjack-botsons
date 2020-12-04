const Embed = require('discord.js').MessageEmbed;
const Player = require('../classes/player');

module.exports = {
    run: async(client, message) => {
        message.delete();
        let game = client.games.get(message.channel.id);
        // Check if there's a game on that channel
        if(!game)
            return message.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("There's no ongoing game on this channel. You could start a new one with command 'bjdeal'."));

        // Check if the player is already in the game or not
        else if(game.players.get(message.author.id))
            return message.channel.send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You're already in this game."));


        // Add the new player
        await client.games.get(message.channel.id).players.set(message.author.id, new Player(message.author));
        await message.channel.send(`**${client.games.get(message.channel.id).players.get(message.author.id).tag}** has joined the game!`);

        // Save stats
        client.handlers.get("stats")("join");
    },
    aliases: ["commands"],
    description: "returns the help list"
}
