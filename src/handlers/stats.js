const mongoose = require('mongoose');
const Stats = require('../database/models/stats');

module.exports = {
    run: async (client, param) => {
        // Connect to the database
        await mongoose.connect(process.env.DB_LINK, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });

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
