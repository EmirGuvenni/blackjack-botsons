console.log("Starting Blackjack Botsons...");
// Imports .env config
require('dotenv').config({path: __dirname + '/config/.env'});
// Sets client
const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']});

// Setup the bot
(async() => {
    await client.login(process.env.TOKEN);
    await client.user.setActivity("/bj help");
    client.games = new Map();
    client.commands = new Map();
    client.handlers = new Map();
    // Registers modules
    require('./config/registry').initialize();
    console.log("Blackjack Botsons is online");
})();

module.exports = {client}
