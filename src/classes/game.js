/**
 * @property {Map.<Snowflake, Player>} players
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
        this.dealer = [];
        this.bets = [];
        this.done = [];
        this.state = "none";
    }
}
