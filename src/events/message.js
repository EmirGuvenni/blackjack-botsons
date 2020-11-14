module.exports = async(client, message) => {
    // Return if it's not a command
    if(!message.content.startsWith(process.env.PREFIX))
        return;

    // Get message arguments
    const args = message.content.slice((process.env.PREFIX.length + 1)).trim().split(/ +/);
    // Get the command argument
    const command = args.shift().toLowerCase();

    // Check if the command exists
    if(client.commands.get(command))
        return client.commands.get(command)(client, message, args);
}
