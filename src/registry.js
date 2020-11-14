const fs = require('fs').promises;
const path = require('path');
const {checkCommandModule,checkModule, checkProperties} = require('./validate');

async function registerCommands(client, dir) {
    let files = await fs.readdir(path.join(__dirname, dir));
    
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory())
            await registerCommands(client, path.join(dir, file));
        else {
            if(file.endsWith(".js")) {
                let CommandName = file.substring(0, file.indexOf(".js"));
                try {
                    let CommandModule = require(path.join(__dirname, dir, file));
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

async function registerEvents(client, dir) {
    let files = await fs.readdir(path.join(__dirname, dir));
    
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory())
            await registerEvents(client, path.join(dir, file));
        else {
            if(file.endsWith(".js")) {
                let eventName = file.substring(0, file.indexOf(".js"));
                try {
                    let eventModule = require(path.join(__dirname, dir, file));
                    client.on(eventName, eventModule.bind(null, client));
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
}

async function registerHandlers(client, dir) {
    let files = await fs.readdir(path.join(__dirname, dir));
    
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory())
            await registerHandlers(client, path.join(dir, file));
        else {
            if(file.endsWith(".js")) {
                let handlerName = file.substring(0, file.indexOf(".js"));
                try {
                    let handlerModule = require(path.join(__dirname, dir, file));
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
    registerEvents, 
    registerCommands,
    registerHandlers,
};
