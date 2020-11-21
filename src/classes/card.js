/**
 * @property {string | number} value - Power value to calculate the hand value
 * @property {number} suit
 * @property {number} rank
 * @type {Card}
 */
module.exports = class Card {
    constructor() {
        this.value = Math.floor((Math.random() * 13) + 1);
        this.suit = Math.floor((Math.random() * 4) + 1);
        this.rank = Math.floor((Math.random() * 13) + 1);
    }
}
