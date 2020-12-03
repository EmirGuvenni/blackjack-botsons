const Embed = require('discord.js').MessageEmbed;
const Card = require('../classes/card');
const {afkManager, calcHand, renderDealer, renderPlayer} = require('../utility');

module.exports = async(client, arg) => {
    let game = await client.games.get(arg.channel.id);
    game.state = "deal";
    game.done = [];
    game.expected = [];
    for(let player of game.bets) {
        if(!game.players.get(player).isStand)
            game.expected.push(player);
    }
    if(game.expected.length === 0)
        return client.emit("endDeal", arg);

    // check if it's the first deal
    if(game.dealer.length === 0) {
        // Give dealer a card
        game.dealer.push(new Card());

        // Give each player 2 cards
        game.bets.forEach((playerid) => {
            let player = game.players.get(playerid);

            player.hand.push(new Card());
            player.hand.push(new Card());

            if(calcHand(arg.channel.id, playerid) === 21) {
                let player = game.players.get(playerid);
                player.isStand = true;
                player.stats = "Blackjack";
                game.done.push(playerid);

                // Check if all the players got Blackjack
                if(game.expected.length === game.done.length)
                    deal(arg);
            }
        });
    }

    // Send the embed
    await arg.channel.send(new Embed()
        .setColor(0xFCFCFC)
        .setTitle("The game is on!")
        .setDescription(`**Dealer:**(${calcHand(arg.channel.id, "dealer")})\n${renderDealer(game)}`)
        .addFields(renderPlayer(game))).then(async(emb) => {

        // Filter incoming reactions
        let filter = (reaction, user) => {
            return ['✅', '❌', '💳'].includes(reaction.emoji.name) && !game.done.includes(user.id) && game.players.get(user.id);
        }

        const reactions = emb.createReactionCollector(filter, {time: 36000});

        reactions.on('collect', (reaction, user) => {
            let game = client.games.get(reaction.message.channel.id);
            let player = game.players.get(user.id);

            /**
             * Handles Moves on deal embeds
             * @param {string} move
             * @returns {void}
             */
            async function setMove(move) {
                game.done.push(user.id);
                await arg.channel.send(`**${player.tag}:** ${move}`);
                client.handlers.get("stats")(`${move.toLowerCase()}`);
            }

            switch(reaction.emoji.name) {
                case '✅':
                    player.hand.push(new Card());
                    setMove("Hit");
                    // Check if the player is bust
                    if(calcHand(arg.channel.id, user.id) > 21) {
                        player.stats = "Bust";
                        player.isStand = true;
                    }
                    break;
                case '❌':
                    player.isStand = true;
                    setMove("Stand");
                    break;
                case '💳':
                    // Double the bet of the player
                    if(player.cash >= player.bet) {
                        player.cash -= player.bet;
                        player.bet *= 2;
                        player.hand.push(new Card());
                        player.isStand = true;
                        setMove("Double");
                    }
                    else
                        client.users.cache.get(user.id).send(new Embed()
                            .setColor(0xFF0000)
                            .setTitle("Error")
                            .setDescription("You can't double down. You don't have enough cash."));
                    break;
            }
            if(game.expected.length === game.done.length)
                reactions.stop();
        });

        // Filter inactive users and deal cards
        reactions.on('end', async() => {
            if(await afkManager(arg) === "deal")
                client.emit("deal", arg);
                //await deal(arg);
        });

        await emb.react('✅');
        await emb.react('❌');
        await emb.react('💳');
    });
}
