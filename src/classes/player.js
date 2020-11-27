const Card = require('./card');
const {client} = require('../index');
const Embed = require('discord.js').MessageEmbed;

module.exports = {
    /**
     * Takes user as parameter
     * @property {string} tag
     * @property {Array} hand
     * @property {Array} [splitHand]
     * @property {boolean} isStand
     * @property {number} cash
     * @property {number} bet
     * @property {string} stats
     * @type {Player}
     */
    Player: class {
        constructor(user) {
            this.tag = user.tag;
            this.hand = [];
            this.splitHand = [];
            this.isStand = false;
            this.cash = 1000;
            this.bet = 0;
            this.stats = "";
        }
    },
    /**
     * Deals a new card
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     * @returns {void}
     */
    hit: (game, userid) => {
        let player = client.games.get(game.id).players.get(userid);
        player.hand.push(new Card());
        client.games.get(game.id).done.push(userid);
        game.send(`**${player.tag}:** ✅Hit`);
        client.handlers.get("stats")("hit");
    },
    /**
     * Sets players stay state to true
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     * @returns {void}
     */
    stand: (game, userid) => {
        let player = client.games.get(game.id).players.get(userid);
        player.isStand = true;
        client.games.get(game.id).done.push(userid);
        game.send(`**${player.tag}:** ❌Stand`);
        client.handlers.get("stats")("stand");
    },
    /**
     * Splits players hand
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     * @returns {void}
     */
    split: (game, userid) => {
        let player = client.games.get(game.id).players.get(userid);
        player.splitHand.push(player.hand.shift());
        client.handlers.get("stats")("split");
    },
    /**
     * Doubles players bet
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     * @returns {void}
     */
    double: (game, userid) => {
        let player = client.games.get(game.id).players.get(userid);

        // Double the bet of the player
        if(player.cash >= player.bet) {
            player.cash -= player.bet;
            player.bet *= 2;
            player.hand.push(new Card());
            player.isStand = true;
            client.games.get(game.id).done.push(userid);
            game.send(`**${player.tag}:** 💰Double Down`);
            client.handlers.get("stats")("double");
        }
        else
            client.users.cache.get(userid).send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You can't double down. You don't have enough cash."));
    }
}
