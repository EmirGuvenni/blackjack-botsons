const mongoose = require('mongoose');

const botSchema = mongoose.Schema({
    errs: {type: Number, min: 0, default: 0, required: true},
    help: {type: Number, min: 0, default: 0, required: true},
});

module.exports = mongoose.model("Botstat", botSchema);
