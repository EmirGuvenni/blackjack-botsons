const Stats = require('../database/models/stats');

module.exports = async(client, error) => {
    await (async() => {
        // Log the error to console
        console.error(error);

        // Save stats
        const reqStats = await Stats.findOne();
        reqStats.errs++;
        await reqStats.save();
    })();

    // End the process
    process.exit(1);
}
