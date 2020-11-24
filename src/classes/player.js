const Card = require('./card');
const {client} = require('../index');
const Embed = require('discord.js').MessageEmbed;

module.exports = {
    /**
     * Takes user as parameter
     * @property {string} tag
     * @property {Array} hand
     * @property {Array} [splitHand]
     * @property {string} state
     * @property {number} cash
     * @property {number} bet
     * @type {Player}
     */
    Player: class Player {
        constructor(user) {
            this.tag = user.tag;
            this.hand = [];
            this.splitHand = [];
            this.state = "none";
            this.cash = 1000;
            this.bet = 0;
        }
    },
    /**
     * Deals a new card
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     */
    hit: function hit(game, userid) {
        let player = client.games.get(game.id).players.get(userid);
        player.hand.push(Card);
        game.send(`**${player.tag}:** ✅Hit`);
        client.handlers.get("stats")("hit");
    },
    /**
     * Sets players stay state to true
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     */
    stay: function stay(game, userid) {
        let player = client.games.get(game.id).players.get(userid);
        player.isStay = true;
        game.send(`**${player.tag}:** ❌Stay`);
        client.handlers.get("stats")("stay");
    },
    /**
     * Splits players hand
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     */
    split: function split(game, userid) {
        let player = client.games.get(game.id).players.get(userid);
        player.splitHand.push(player.hand.shift());
        client.handlers.get("stats")("split");
    },
    /**
     * Doubles players bet
     * @param {TextChannel | DMChannel | NewsChannel} game
     * @param {string} userid
     */
    double: function double(game, userid) {
        let player = client.games.get(game.id).players.get(userid);

        // Double the bet of the player
        if(player.cash >= (player.bet *= 2)) {
            player.cash -= player.bet;
            player.bet *= 2;
            game.send(`**${player.tag}:** 💰Double Down`);
            client.handlers.get("stats")("double");
        }
        else
            client.users.cache.get(userid).send(new Embed()
                .setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You can't double down. You don't have enough cash.")
            );
    }
}
