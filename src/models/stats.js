const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
    errs: {type: Number, min: 0, default: 0, required: true},
    help: {type: Number, min: 0, default: 0, required: true},
    deal: {type: Number, min: 0, default: 0, required: true},
    invite: {type: Number, min: 0, default: 0, required: true},
    hit: {type: Number, min: 0, default: 0, required: true},
    stand: {type: Number, min: 0, default: 0, required: true},
    double: {type: Number, min: 0, default: 0, required: true},
    join: {type: Number, min: 0, default: 0, required: true},
    leave: {type: Number, min: 0, default: 0, required: true},
    100: {type: Number, min: 0, default: 0, required: true},
    500: {type: Number, min: 0, default: 0, required: true},
    1000: {type: Number, min: 0, default: 0, required: true},
    win: {type: Number, min: 0, default: 0, required: true},
    lose: {type: Number, min: 0, default: 0, required: true},
    push: {type: Number, min: 0, default: 0, required: true},
    blackjack: {type: Number, min: 0, default: 0, required: true}
});

module.exports = mongoose.model("blackjack-botsons", botSchema);
