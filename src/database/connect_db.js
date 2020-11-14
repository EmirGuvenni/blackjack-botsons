const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LINK,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
