var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    sAMAccountName: String,
    mail: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;