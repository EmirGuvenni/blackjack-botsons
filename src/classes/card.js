/**
 * @property {string | number} value - Power value to calculate the hand value
 * @property {string} suit
 * @property {string} rank
 * @type {Card}
 */
module.exports = class Card {
    constructor() {
        let type = Math.floor((Math.random() * 4) + 1);
        let value = Math.floor((Math.random() * 13) + 1);

        this.value = () => {
            switch(value) {
                case 1:
                    return "a";
                case 11:
                    return 10;
                case 12:
                    return 10;
                case 13:
                    return 10;
                default:
                    return value;
            }
        }
        this.suit = () => {
            switch(type) {
                case 1:
                    return "Hearts";
                case 2:
                    return "Diamonds";
                case 3:
                    return "Spades";
                case 4:
                    return "Clubs"
            }
        }
        this.rank = () => {
            switch(value) {
                case 1:
                    return "Ace";
                case 11:
                    return "Jack";
                case 12:
                    return "Queen";
                case 13:
                    return "King";
                default:
                    return value;
            }
        }
    }
}
