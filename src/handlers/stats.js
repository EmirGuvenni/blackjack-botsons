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

        // Create a stats document if doesn't already exists
        if(!await Stats.findOne()){
            try{
                const newStats = new Stats();
                newStats.save();
                console.log("Created new stats document");
            }
            catch(err) {
                client.handlers.get("error")(client, err, __filename);
            }
        }

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
