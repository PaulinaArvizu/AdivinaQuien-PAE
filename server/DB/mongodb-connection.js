const mongoose = require('mongoose');
const config = require('../config/config')
console.log(config.dbUrl)
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log("Not connected to database", err);
});
module.exports = mongoose;