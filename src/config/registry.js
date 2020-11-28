const fs = require('fs').promises;
const path = require('path');
const {checkCommandModule,checkModule, checkProperties} = require('./validate');
const {client} = require('../index');

async function registerCommands() {
    let files = await fs.readdir(path.join(__dirname, '../commands'));
    
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, '../commands', file));
        if(stat.isDirectory())
            await registerCommands(path.join('../commands', file));
        else {
            if(file.endsWith(".js")) {
                let CommandName = file.substring(0, file.indexOf(".js"));
                try {
                    let CommandModule = require(path.join(__dirname, '../commands', file));
                    if(checkCommandModule(CommandName, CommandModule)) {
                        if(checkProperties(CommandName, CommandModule)) {
                            let { aliases } = CommandModule;
                            client.commands.set(CommandName, CommandModule.run);
                            if(aliases.length !== 0)
                                aliases.forEach(alias => client.commands.set(alias, CommandModule.run));
                        }
                    }
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
}

async function registerEvents() {
    let files = await fs.readdir(path.join(__dirname, '../events'));
    
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, '../events', file));
        if(stat.isDirectory())
            await registerEvents(path.join('../events', file));
        else {
            if(file.endsWith(".js")) {
                let eventName = file.substring(0, file.indexOf(".js"));
                try {
                    let eventModule = require(path.join(__dirname, '../events', file));
                    client.on(eventName, eventModule.bind(null, client));
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
}

async function registerHandlers() {
    let files = await fs.readdir(path.join(__dirname, '../handlers'));
    
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, '../handlers', file));
        if(stat.isDirectory())
            await registerHandlers(path.join('../handlers', file));
        else {
            if(file.endsWith(".js")) {
                let handlerName = file.substring(0, file.indexOf(".js"));
                try {
                    let handlerModule = require(path.join(__dirname, '../handlers', file));
                    if(checkModule(handlerName, handlerModule)) {
                        client.handlers.set(handlerName, handlerModule.run);
                    }
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
}

module.exports = {
    initialize: async() => {
        await registerEvents();
        await registerCommands();
        await registerHandlers();
    }
}
