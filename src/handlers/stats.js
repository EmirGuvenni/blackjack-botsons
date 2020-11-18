const Stats = require('../database/models/stats');
const embed = require('discord.js').MessageEmbed;

module.exports = {
    run: async (client, param) => {
        // Save stats
        try{
            const reqStats = await Stats.findOne();
            reqStats[param]++;
            reqStats.save();
        }
        catch(err){
            client.channels.cache.get("error")(client, err, __filename);
        }
    },
    description: "reports errors to the developer server"
}
