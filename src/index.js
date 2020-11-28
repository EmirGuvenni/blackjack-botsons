console.log("Starting Blackjack Botsons...");
// Imports .env config
require('dotenv').config({path: __dirname + '/config/.env'});
// Registers modules
require('./config/registry');
// Sets client
const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']});

// Setup the bot
(async() => {
    await client.login(process.env.TOKEN);
    await client.user.setActivity("/bj help");
    client.games = new Map();
    console.log("Blackjack Botsons is online");
})();

module.exports = {client}
