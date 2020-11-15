const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
    errs: {type: Number, min: 0, default: 0, required: true},
    help: {type: Number, min: 0, default: 0, required: true},
    deal: {type: Number, min: 0, default: 0, required: true},
    invite: {type: Number, min: 0, default: 0, required: true},
    hit: {type: Number, min: 0, default: 0, required: true},
    stay: {type: Number, min: 0, default: 0, required: true},
    double: {type: Number, min: 0, default: 0, required: true},
    split: {type: Number, min: 0, default: 0, required: true},
    join: {type: Number, min: 0, default: 0, required: true}
});

module.exports = mongoose.model("Botstat", botSchema);
