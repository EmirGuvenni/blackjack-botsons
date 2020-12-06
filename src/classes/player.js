/**
 * Takes user as parameter
 * @property {Snowflake} id
 * @property {string} tag
 * @property {Array} hand
 * @property {boolean} isStand
 * @property {number} cash
 * @property {number} bet
 * @property {string} stats
 * @type {Player}
 */
module.exports = class Player {
    constructor(user) {
        this.id = user.id;
        this.tag = user.tag;
        this.hand = [];
        this.isStand = false;
        this.cash = 1000;
        this.bet = 0;
        this.stats = "";
    }
}
