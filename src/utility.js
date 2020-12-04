const {client} = require('./index');

module.exports = {
    /**
     * Removes inactive games and players
     * @param {Message | MessageReaction} arg
     * @returns {Promise<string | void>}
     */
    afkManager: async(arg) => {
        let game = client.games.get(arg.channel.id);
        if(!game) return;

        for(let player of game.bets) {
            // Remove players from the game if they're inactive
            if(!game.done.includes(player)) {
                client.emit("playerLeft", arg.channel.id, player);
            }
        }
        // Check if the game is empty
        if(game.players.size !== 0 && game) return "deal";
    },
    /**
     * Calculate the hand value
     * @param {string} gameid
     * @param {string} userid
     * @returns {number} card value
     */
    calcHand: (gameid, userid) => {
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
    },
    /**
     * Renders dealers hand
     * @param {Game} game
     * @returns {string}
     */
    renderDealer: (game) => {
        let dealerF = [];
        let dealerS = [];
        // Get the dealers cards
        for(let card of game.dealer) {
            // Get card emojis
            dealerF.push(client.emojis.cache.find(emoji => emoji.name === card.ranks));
            dealerS.push(client.emojis.cache.find(emoji => emoji.name === card.suits));
        }
        return `${dealerF}\n${dealerS}`;
    },
    /**
     * Renders players hand
     * @param {Game} game
     * @return {any}
     */
    renderPlayer: (game) => {
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
}
