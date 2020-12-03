const Embed = require('discord.js').MessageEmbed;
const {client} = require('../index');

/**
 * @property {number} suit
 * @property {number} rank
 * @type {Card}
 */
class Card {
    constructor() {
        let rank = Math.floor((Math.random() * 13) + 1);
        let suit = Math.floor(Math.random() * 4);

        this.suit = suit
        this.rank = rank

        // emoji names
        this.ranks = renderRank(suit, rank);
        this.suits = renderSuit(suit);
    }
}

/**
 * @param {number} suit
 * @param {number} rank
 * @return {string}
 */
function renderRank(suit, rank) {
    let isRed = suit > 1;

    switch(rank) {
        case 1:
            if(isRed) return "rA";
            else return "bA";
        case 11:
            if(isRed) return "rJ";
            else return "bJ";
        case 12:
            if(isRed) return "rQ";
            else return "bQ";
        case 13:
            if(isRed) return "rK";
            else return "bK";
        default:
            if(isRed) return `r${rank}`;
            else return `b${rank}`;
    }
}

/**
 * @param {number} suit
 * @return {string}
 */
function renderSuit(suit) {
    switch(suit) {
        case 0:
            return "sS";
        case 1:
            return "sC";
        case 2:
            return "sD";
        case 3:
            return "sH";
    }
}

module.exports = {
    /**
     * @property {Map.<Snowflake, Player>} players
     * @property {Array} dealer - dealers hand
     * @property {Array} bets - players that put on a bet
     * @property {Array} expected - players that are expected to make a move
     * @property {Array} done - players that made a move
     * @property {string} state
     * @property {function} timer - AFK managers timer
     * @type {Game}
     */
    Game: class Game {
        constructor() {
            this.players = new Map();
            this.dealer = [];
            this.bets = [];
            this.expected = [];
            this.done = [];
            this.state = "none";
        }
    },
    getBets, deal
}

/**
 * Collects bets
 * @param {Message | MessageReaction} arg
 * @returns {MessageEmbed}
 */
async function getBets(arg) {
    let game = client.games.get(arg.channel.id);

    // Set the player cash to 100 if the player has less or none
    game.players.forEach(player => {
        if(player.cash < 100)
            player.cash = 100;
    });

    game.state = "bet";
    game.done = [];
    game.expected = [];
    for(let player of game.players.keys()) {
        game.expected.push(player)
    }

    let table = [];
    game.players.forEach(player => table.push({name: player.tag, value: `${player.cash}$`, inline: true}));
    // Send the embed and add reactions
<<<<<<< HEAD
    await arg.channel.send(new Embed()
        .setColor(0xFCFCFC)
        .setTitle("Place your bets!")
        .setDescription([
            '💵: 100$',
            '💰: 500$',
            '💎: 1000$'
        ])
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
                    return arg.channel.send(`**${player.tag}'s bet:** ${bet}$`);
=======
    try{
        await arg.channel.send(new Embed()
            .setColor(0xFCFCFC)
            .setTitle("Place your bets!")
            .setDescription([
                '💵: 100$',
                '💰: 500$',
                '💎: 1000$'
            ])
            .addFields(table)).then(async(emb) => {
                // Filter incoming reactions
                let filter = (reaction, user) => {
                    return ['💵', '💰', '💎'].includes(reaction.emoji.name) && !game.done.includes(user.id) && game.players.get(user.id);
                };

                const reactions = emb.createReactionCollector(filter, {time: 36000});

                let fallCheck = async() => {
                    if(game.state === "bet")
                        await deal(arg);
                }
                setTimeout(fallCheck, 37000);

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
                        reactions.stop();
                });

                // Filter inactive users and deal cards
                reactions.on('end', async() => {
                    if(await afkManager(arg) === "deal")
                        await deal(arg);
                });

                try{
                    await emb.react('💵');
                    await emb.react('💰');
                    await emb.react('💎');
>>>>>>> d795c672c8a14c361ea2f245dfcb20c803e19c9e
                }
                catch(err) {
                    arg.channel.send(new Embed()
                        .setColor(0xFF0000)
                        .setTitle("Error")
                        .setDescription("I do not have the permission to add reactions")
                    );
                }
            }
        );
    }
    catch(err) {
        await arg.channel.send("Missing permission: Embed links.");
    }
}

/**
 * Removes inactive games and players
 * @param {Message | MessageReaction} arg
 */
async function afkManager(arg) {
    let game = client.games.get(arg.channel.id);

    for(let player of game.expected) {
        // Remove players from the game if they're inactive
        if(!game.done.includes(player)) {
            game.players.delete(player);
            await arg.channel.send(`**${client.users.cache.get(player).tag}** was removed from the game due to inactivity.`);
            for(let i = 0; i < game.bets.length; i++){
                if(player === game.bets[i])
                    game.bets.splice(i, 1);
            }
        }
    }
    // Remove the game if it's empty
    if(game.players.size === 0) {
        client.games.delete(arg.channel.id);
        await arg.channel.send("Game closed.");
    }
    else return "deal";
}

/**
 * Deals cards
 * @param {Message | MessageReaction} arg
 * @returns {MessageEmbed}
 */
async function deal(arg) {
    let game = await client.games.get(arg.channel.id);
    game.state = "deal";
    game.done = [];
    game.expected = [];
    for(let player of game.bets) {
        if(!game.players.get(player).isStand)
            game.expected.push(player);
    }
    if(game.expected.length === 0)
        return endDeal(arg);

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

    try{
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

<<<<<<< HEAD
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
=======
            let fallCheck = async() => {
                if(game.state === "deal")
                    await deal(arg);
>>>>>>> d795c672c8a14c361ea2f245dfcb20c803e19c9e
            }
            setTimeout(fallCheck, 37000);

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
                    await deal(arg);
            });

            try{
                await emb.react('✅');
                await emb.react('❌');
                await emb.react('💳');
            }
            catch(err) {
                arg.channel.send(new Embed()
                    .setColor(0xFF0000)
                    .setTitle("Error")
                    .setDescription("I do not have the permission to add reactions.")
                );
            }
        });
    }
    catch(err) {
        await arg.channel.send("Missing permission: Embed links.");
    }
}

/**
 * Ends the current deal
 * @param {Message | MessageReaction} arg
 * @returns {MessageEmbed}
 */
async function endDeal(arg) {
    let game = await client.games.get(arg.channel.id);

    // Deal 'till the dealer is above 17
    while(calcHand(arg.channel.id, "dealer") < 17) {
        game.dealer.push(new Card());
    }

    let dealerPower = calcHand(arg.channel.id, "dealer");

    game.bets.forEach(playerid => {
        let player = game.players.get(playerid);
        let playerPower = calcHand(arg.channel.id, playerid);

        // Set player stats
        if((dealerPower > 21 && 21 >= playerPower) || (dealerPower <= 21 && playerPower > dealerPower) && player.stats !== "Bust")
            player.stats = "Win";
        else if(playerPower <= 21 && dealerPower === playerPower && player.stats === "")
            player.stats = "Push";
        else if(dealerPower > playerPower && player.stats === "")
            player.stats = "Lose"
    });

    try{
        // Send the embed
        await arg.channel.send(new Embed()
            .setColor(0xFCFCFC)
            .setTitle("Results")
            .setDescription(`**Dealer:**(${calcHand(arg.channel.id, "dealer")})\n${renderDealer(game)}`)
            .addFields(renderPlayer(game)));
    }
    catch(err) {
        await arg.channel.send("Missing permission: Embed links.");
    }

    // Restart the game
    await restart(arg);
}

/**
 * Resets the table
 * @param {Message | MessageReaction} arg
 * @returns {void}
 */
async function restart(arg) {
    let game = client.games.get(arg.channel.id);

    // Reset the game
    game.dealer = [];
    game.bets = [];
    // Reset players
    game.players.forEach((player) => {
        switch(player.stats) {
            case "Win":
                player.cash += (player.bet * 2);
                client.handlers.get("stats")("win");
                break;
            case "Push":
                player.cash += player.bet;
                client.handlers.get("stats")("push");
                break;
            case "Blackjack":
                player.cash += ((player.bet / 2) + (player.bet * 2));
                client.handlers.get("stats")("blackjack");
                break;
            case "Lose":
                client.handlers.get("stats")("lose");
                break;
        }
        player.hand = [];
        player.bet = 0;
        player.stats = "";
        player.isStand = false;
    });
    await getBets(arg);
}

/**
 * Calculate the hand value
 * @param {string} gameid
 * @param {string} userid
 * @returns {number} card value
 */
function calcHand(gameid, userid) {
    // Switch between player and the dealer
    let hand = (userid === "dealer") ? client.games.get(gameid).dealer : client.games.get(gameid).players.get(userid).hand;

    let ace = false;
    let power = 0;

    hand.forEach((card) => {
        if(card.rank === 1)
            !ace ? ace = true : power++;
        else if(card.rank === 10 || card.rank === 11 || card.rank === 12 || card.rank === 13)
            power += 10;
        else
            power += card.rank;
    });

    // Handle the ace
    if(ace && power <= 10)
        power += 11;
    else if(ace)
        power++;

    return power;
}

/**
 * Renders dealers hand
 * @param {Game} game
 * @returns {string}
 */
function renderDealer(game) {
    let dealerF = [];
    let dealerS = [];
    // Get the dealers cards
    for(let card of game.dealer) {
        // Get card emojis
        dealerF.push(client.emojis.cache.find(emoji => emoji.name === card.ranks));
        dealerS.push(client.emojis.cache.find(emoji => emoji.name === card.suits));
    }
    return `${dealerF}\n${dealerS}`;
}

/**
 * Renders players hand
 * @param {Game} game
 * @return {any}
 */
function renderPlayer(game) {
    let table = [];
    game.bets.forEach((playerid) => {
        let player = game.players.get(playerid);

        let lineF = [];
        let lineS = [];
        for(let card of player.hand) {
            // Get card emojis
            lineF.push(client.emojis.cache.find(emoji => emoji.name === card.ranks));
            lineS.push(client.emojis.cache.find(emoji => emoji.name === card.suits));
        }

        // Add the player into the embed
        table.push({
            name: player.tag,
            value: `${lineF}\n${lineS}`,
            inline: true
        })
    });
    return table;
}
