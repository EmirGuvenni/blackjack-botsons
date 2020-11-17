const Game = require('../classes/game');

const Stats = require('../database/models/stats');

module.exports = {
    run: async(client, message) => {
        // Check if there's a game on that channel
        if(client.games.get(message.channel.id))
            return message.channel.send("There's already a game on this channel.");

        // Register a new game
        client.games.set(message.channel.id, new Game(message))
              .then((game) => game.deal());

        // Save stats
        try {
            const reqStats = await Stats.findOne();
            reqStats.deal++;
            reqStats.save();
        }
        catch(err) {
            client.handlers.get("error")(client, err, __filename);
        }
    },
    aliases: ["start"],
    description: "starts a game of blackjack"
}
