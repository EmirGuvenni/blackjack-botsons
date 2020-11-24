require('dotenv').config({path: __dirname + '/.env'});
const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER']});
const {registerCommands, registerEvents, registerHandlers} = require('./registry');
console.log("Starting Blackjack Botsons...");

(async() => {
    await client.login(process.env.TOKEN);
    console.log("Logged in");
    client.commands = new Map();
    client.handlers = new Map();
    client.games = new Map();
    await registerEvents(client, './events');
    await registerCommands(client, './commands');
    await registerHandlers(client, './handlers');
    // Set bot activity
    await client.user.setActivity("/bj help");
    console.log("Blackjack Botsons is ready");
})();

module.exports = {client}
