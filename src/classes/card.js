/**
 * @property {number} suit
 * @property {number} rank
 * @type {Card}
 */
module.exports = class Card {
    constructor() {
        let rank = Math.floor((Math.random() * 13) + 1);
        let suit = Math.floor(Math.random() * 4);

        this.suit = suit
        this.rank = rank

        // emoji names
        this.ranks = renderRank(suit, rank);
        this.suits = renderSuit(suit);
    }
}

/**
 * @param {number} suit
 * @param {number} rank
 * @return {string}
 */
function renderRank(suit, rank) {
    let isRed = suit > 1;

    switch(rank) {
        case 1:
            if(isRed) return "rA";
            else return "bA";
        case 11:
            if(isRed) return "rJ";
            else return "bJ";
        case 12:
            if(isRed) return "rQ";
            else return "bQ";
        case 13:
            if(isRed) return "rK";
            else return "bK";
        default:
            if(isRed) return `r${rank}`;
            else return `b${rank}`;
    }
}

/**
 * @param {number} suit
 * @return {string}
 */
function renderSuit(suit) {
    switch(suit) {
        case 0:
            return "sS";
        case 1:
            return "sC";
        case 2:
            return "sD";
        case 3:
            return "sH";
    }
}
