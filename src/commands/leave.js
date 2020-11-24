const Embed = require('discord.js').MessageEmbed;

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
        else if(!game.players.get(message.author.id)){
            // Create an error embed
            let errEmbed = new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You're not in the game.");
            // Send the embed
            return message.channel.send(errEmbed);
        }

        // Remove the player
        await client.games.get(message.channel.id).players.delete(message.author.id);

        // Send the left message
        await message.channel.send(`**${message.author.tag}** left the game.`);

        // Remove the game if it's empty
        if(client.games.get(message.channel.id).players.size === 0) {
            client.games.delete(message.channel.id);
            message.channel.send("Game closed.");
        }

        // Save stats
        client.handlers.get("stats")("leave");
    },
    aliases: ["commands"],
    description: "returns the help list"
}
