module.exports = class Card {
    constructor() {
        let type = Math.floor((Math.random() * 4) + 1);
        let value = Math.floor((Math.random() * 13) + 1);

        let getSuit = () => {
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
        let getRank = () => {
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
        let getCard = () => {
            let img = [];
            switch(value) {
                case 1:
                    img.push("A");
                    break;
                case 11:
                    img.push("J");
                    break;
                case 12:
                    img.push("Q");
                    break;
                case 13:
                    img.push("K");
                    break;
                default:
                    img.push(value);
                    break;
            }
            switch(type) {
                case 1:
                    img.push("H");
                    break;
                case 2:
                    img.push("D");
                    break;
                case 3:
                    img.push("S");
                    break;
                case 4:
                    img.push("C");
                    break;
            }
            img.push(".png");
            return img.join("");
        }

        this.suit = getSuit();
        this.rank = getRank();
        this.img = getCard();
    }
}
