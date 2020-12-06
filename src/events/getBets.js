const Embed = require('discord.js').MessageEmbed;
const {afkManager} = require('../utility');

module.exports = async(client, arg) => {
    let game = client.games.get(arg.channel.id);

    // Set the player cash to 100 if the player has less or none
    game.players.forEach(player => {
        if(player.cash < 100)
            player.cash = 100;
    });

    game.state = "bet";
    game.done = [];

    let table = [];
    game.players.forEach(player => table.push({name: player.tag, value: `${player.cash}$`, inline: true}));
    // Send the embed and add reactions
    await arg.channel.send(new Embed()
        .setColor(0xFCFCFC)
        .setTitle("Place your bets!")
        .setDescription(['💵: 100$', '💰: 500$', '💎: 1000$'])
        .addFields(table)).then(async(emb) => {
            // Filter incoming reactions
            let filter = (reaction, user) => {
                return ['💵', '💰', '💎'].includes(reaction.emoji.name) && !game.done.includes(user.id) && game.players.get(user.id);
            };

            const reactions = emb.createReactionCollector(filter, {time: 36000});

            /**
             * Sets the bet of the player
             * @param {string} id
             * @param {number} bet
             * @returns {Message}
             */
            function setBet(id, bet) {
                let player = game.players.get(id);
                if(bet <= player.cash) {
                    // Set the bet
                    player.bet = bet;
                    player.cash -= bet;
                    game.done.push(id);
                    game.bets.push(id);
                    client.handlers.get("stats")(bet.toString());
                    arg.channel.send(`**${player.tag}'s bet:** ${bet}$`);
                }
                else {
                    // Send an error embed
                    return arg.author.send(new Embed()
                        .setColor(0xFF0000)
                        .setTitle("Error")
                        .setDescription("Your bet can't be higher than your cash."));
                }
            }

            // deal cards if all players placed their bets
            reactions.on('collect', (reaction, user) => {
                switch(reaction.emoji.name) {
                    case '💵':
                        setBet(user.id, 100);
                        break;
                    case '💰':
                        setBet(user.id, 500);
                        break;
                    case '💎':
                        setBet(user.id, 1000);
                        break;
                }
                if(game.bets.length === (game.players.size - game.joins))
                    reactions.stop();
            });

            // Filter inactive users and deal cards
            reactions.on('end', async() => {
                if(await afkManager(arg) === "deal")
                    client.emit("deal", arg);
            });

            await emb.react('💵');
            await emb.react('💰');
            await emb.react('💎');
        }
    );
}
