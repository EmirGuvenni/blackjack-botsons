/**
 * @property {number} suit
 * @property {number} rank
 * @type {Card}
 */
module.exports = class Card {
    constructor() {
        let suit = Math.floor(Math.random() * 4);
        let rank = Math.floor((Math.random() * 13) + 1);

        this.suit = suit
        this.rank = rank

        // emoji names
        this.lineF = renderFirst(suit, rank);
        this.lineS = renderSecond(suit);
    }
}

function renderFirst(suit, rank) {
    let isRed = false; // false = black, true = red

    // Get the rank
    if(suit > 1)
        isRed = true;

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
function renderSecond(suit) {
    // Get the suit
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
