/**
 * @property {number} suit
 * @property {number} rank
 * @type {Card}
 */
module.exports = class Card {
    constructor() {
        this.suit = Math.floor((Math.random() * 4) + 1);
        this.rank = Math.floor((Math.random() * 13) + 1);
    }
}
