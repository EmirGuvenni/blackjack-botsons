/**
 * @property {Map.<Snowflake, Player>} players
 * @property {Array} dealer - dealers hand
 * @property {Array} bets - players that put on a bet
 * @property {string} state
 * @type {Game}
 */
module.exports = class Game {
    constructor() {
        this.players = new Map();
        this.dealer = [];
        this.bets = [];
        this.state = "none";
    }
}
