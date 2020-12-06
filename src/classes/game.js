/**
 * @property {Map.<Snowflake, Player>} players
 * @property {number} joins - Number of people waiting to join
 * @property {Array} dealer - dealers hand
 * @property {Array} bets - players that put on a bet
 * @property {Array} done - players that made a move
 * @property {string} state
 * @property {function} timer - AFK managers timer
 * @type {Game}
 */
module.exports = class Game {
    constructor() {
        this.players = new Map();
        this.joins = 0;
        this.dealer = [];
        this.bets = [];
        this.done = [];
        this.state = "none";
    }
}
