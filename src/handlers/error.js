const Stats = require('../models/stats');
const Embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async (client, err, file) => {
        // Save stats
        try{
            const reqStats = await Stats.findOne();
            reqStats.errs++;
            reqStats.save();
        }
        catch(err){
            client.channels.cache.get(process.env.ERROR_CHANNEL).send( __filename + "\n" +err);
        }

        // Create a debug embed
        let debugEmbed = new Embed()
            .setColor(0xFCFCFC)
            .setTitle(file)
            .setDescription(err.stack);
        // Send the error stack to development server
        client.channels.cache.get(process.env.ERROR_CHANNEL).send(debugEmbed);
    },
    description: "reports errors to the developer server"
}
