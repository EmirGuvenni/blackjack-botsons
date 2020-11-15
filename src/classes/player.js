module.exports = class Player{
    constructor(message) {
        this.id = message.author.id;
        this.hand = [];
        this.cash = 1000;
    }
}
