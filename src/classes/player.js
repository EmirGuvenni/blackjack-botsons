const Card = require('./card');
/**
 * Takes user as parameter
 * @property {string} tag
 * @property {Array} hand
 * @property {Array} [splitHand]
 * @property {string} state
 * @property {number} cash
 * @property {number} bet
 * @property {function} power
 * @type {Player}
 */
module.exports = class Player{
    constructor(user) {
        this.tag = user.tag;
        this.hand = [];
        this.splitHand = [];
        this.power = () => {
            let power = 0;
            let aces = 0;
            // Get the power of each card and add them up
            for(let card of this.hand){
                if(typeof card.value !== "string")
                    power += card.value;
                else
                    aces++;
            }
            // Return the hand power
            return power;
        }
        this.state = "none";
        this.cash = 1000;
        this.bet = 0;
    }
}
