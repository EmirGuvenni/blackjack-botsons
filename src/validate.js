module.exports.checkCommandModule = (name, module) => {
    if(!module.hasOwnProperty('run'))
        throw new Error(`${name} command module does not have property 'run'`);
    if(!module.hasOwnProperty('description'))
        throw new Error(`${name} command module does not have property 'description`);
    if(!module.hasOwnProperty('aliases'))
        throw new Error(`${name} command module does not have property 'aliases'`);
    return true;
}
module.exports.checkModule = (name, module) => {
    if(!module.hasOwnProperty('run') || typeof module.run !== 'function')
        throw new Error(`${name} module | property 'run'`);
    if(!module.hasOwnProperty('description') || typeof module.description !== 'string')
        throw new Error(`${name} module | property 'description`);
    return true;
}
module.exports.checkProperties = (name, module) => {
    if(typeof module.run !== 'function')
        throw new Error(`${name} command: run is not a function`);
    if(typeof module.description !== 'string')
        throw new Error(`${name} command: description is not a string`);
    if(!Array.isArray(module.aliases))
        throw new Error(`${name} command: aliases is not an Array`);
    return true;
}