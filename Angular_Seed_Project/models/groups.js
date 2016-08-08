var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    name: String,
    users: [],
    permissions: {type: Boolean, default: false}
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;