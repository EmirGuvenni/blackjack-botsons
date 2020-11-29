const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async(client, message) => {
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

        // Remove the player
        await game.players.delete(message.author.id);
        for(let player of game.expected) {
            // Remove players from the game if they're inactive
            if(!game.done.includes(player)) {
                game.players.delete(player);
                message.channel.send(`**${client.users.cache.get(player).tag}** was removed from the game due to inactivity.`);
                for(let i = 0; i < game.bets.length; i++){
                    if(player === game.bets[i])
                        game.bets.splice(i, 1);
                }
            }
        }

        // Send the "left" message
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
