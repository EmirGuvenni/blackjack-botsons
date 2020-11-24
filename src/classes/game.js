const Embed = require('discord.js').MessageEmbed;
const Card = require('./card');
const {hit, stay, split, double} = require("./player");


module.exports = {
    /**
     * @property {Map.<Snowflake, Player>} players
     * @property {Array} dealer - dealers hand
     * @property {Array} bets - players that put on a bet
     * @property {string} state
     * @type {Game}
     */
    Game: class Game {
        constructor() {
            this.players = new Map();
            this.dealer = [];
            this.expected = [];
            this.done = [];
            this.state = "none";
        }
    },
    /**
     * Collects bets
     * @param client
     * @param {Message | MessageReaction} arg
     */
    getBets: async function getBets(client, arg) {
        let game = client.games.get(arg.channel.id);
        game.state = "bet";
        for(let player of game.players.keys()) {
            game.expected.push(player)
        }
        console.log(game.expected);

        let table = [];
        game.players.forEach(player => table.push({name: player.tag, value: `${player.cash}$`, inline: true}));
        // Create a new game embed
        // noinspection JSCheckFunctionSignatures
        let gameEmbed = new Embed()
            .setColor(0xFCFCFC)
            .setTitle("Place your bets!")
            .setDescription([
                '💵: 100$',
                '💰: 500$',
                '💎: 1000$'
            ])
            .addFields(table);

        // Send the embed and add reactions
        arg.channel.send(gameEmbed).then(async(emb) => {
                await emb.react('💵');
                await emb.react('💰');
                await emb.react('💎');

                // Filter incoming reactions
                let filter = (reaction, user) => {
                    return ['💵', '💰', '💎'].includes(reaction.emoji.name) && !game.done.includes(user.id) && game.players.get(user.id);
                }

                const reactions = emb.createReactionCollector(filter, {time: 10000});

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
                        client.handlers.get("stats")(bet.toString());
                        return arg.channel.send(`**${player.tag}'s bet:** ${bet}$`);
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
                    if(game.expected.length === game.done.length)
                        deal(client, arg);
                });

                // Filter inactive users and deal cards
                reactions.on('end', async() => {
                    if(await afkManager(client, arg) === "deal")
                        return;
                    await deal(client, arg);
                });
            }
        );
    }
}

/**
 * Removes inactive games and players
 * @param client
 * @param {Message | MessageReaction} arg
 */
async function afkManager(client, arg) {
    let game = client.games.get(arg.channel.id);

    for(let player of game.expected) {
        // Remove players from the game if they're inactive
        if(!game.done.includes(player)) {
            game.players.delete(player);
            arg.channel.send(`**${client.users.cache.get(player).tag}** was removed from the game due to inactivity.`);
        }
    }
    // Remove the game if it's empty
    if(game.players.size === 0) {
        client.games.delete(arg.channel.id);
        arg.channel.send("Game closed due to inactivity.");
    }
    else return "deal";
}

/**
 * Deals cards
 * @param client
 * @param {Message | MessageReaction} arg
 */
async function deal(client, arg) {
    let game = await client.games.get(arg.channel.id);
    // Give dealer a card
    game.dealer.push(new Card());
    game.state = "deal";

    // Give each player 2 cards
    game.players.forEach((player) => {
        player.hand.push(new Card());
        player.hand.push(new Card());
    });
    // noinspection JSMismatchedCollectionQueryUpdate
    let dealerF = [];
    // noinspection JSMismatchedCollectionQueryUpdate
    let dealerS = [];
    // Get the dealers cards
    for(let card of game.dealer) {
        console.log(card);
        dealerF.push(client.emojis.cache.find(emoji => emoji.name === card.lineF));
        dealerS.push(client.emojis.cache.find(emoji => emoji.name === card.lineS));
    }
    let table = [];
    game.players.forEach((player) => {
        // noinspection JSMismatchedCollectionQueryUpdate
        let lineF = [];
        // noinspection JSMismatchedCollectionQueryUpdate
        let lineS = [];
        for(let card of player.hand) {
            console.log(card);
            lineF.push(client.emojis.cache.find(emoji => emoji.name === card.lineF));
            lineS.push(client.emojis.cache.find(emoji => emoji.name === card.lineS));
        }

        table.push({
            name: player.tag,
            value: `${lineF}\n${lineS}`,
            inline: true
        })
    });

    // Create a game embed
    let dealEmbed = new Embed()
        .setColor(0xFCFCFC)
        .setTitle("The game is on!")
        .setDescription(`**Dealer:**\n${dealerF}\n${dealerS}`)
        .addFields(table);

    // Send the embed
    await arg.channel.send(dealEmbed).then(async(emb) => {
        await emb.react('✅');
        await emb.react('❌');
        await emb.react('🃏');
        await emb.react('💰');

        // Filter incoming reactions
        let filter = (reaction, user) => {
            return ['✅', '❌', '🃏', '💰'].includes(reaction.emoji.name) && !game.moves.includes(user.id) && game.players.get(user.id);
        }

        const reactions = emb.createReactionCollector(filter, {time: 10000});

        // deal cards if all players placed their bets
        reactions.on('collect', (reaction, user) => {
            switch(reaction.emoji.name) {
                case '✅':
                    hit(arg.channel, user.id);
                    break;
                case '❌':
                    stay(arg.channel, user.id);
                    break;
                case '🃏':
                    split(arg.channel, user.id);
                    break;
                case '💰':
                    double(arg.channel, user.id);
                    break;
            }
            if(game.players.size === game.moves.length)
                deal(client, arg);
        });

        // Filter inactive users and deal cards
        reactions.on('end', async() => {
            if(await afkManager(client, arg) === "deal")
                return;
            await deal(client, arg);
        });
    });
}

/**
 * Deals new cards
 * @param client
 * @param {Message | MessageReaction} arg
 */
async function restart(client, arg) {
    let game = client.games.get(arg.channel.id);

    // Resetting the dealer
    game.dealer = [];
    // Resetting players
    game.players.forEach((player) => {
        player.hand = [];
        player.splitHand = [];
        player.cash += player.bet;
        player.bet = 0;
        player.power = 0;
    });
    await getBets(client, arg);
}
