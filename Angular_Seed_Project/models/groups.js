var mongoose = require('mongoose');
var ActiveDirectory = require('../routes/api/maintenance/activeDirectory');

var ad = ActiveDirectory.getActiveDirectory();
var groupName = 'Certsys';


var groupSchema = new mongoose.Schema({
    name: String,
    users: [],
    permissions: {type: Boolean, default: false}
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;

var ADMINISTRATIVO = 0;
var COMERCIAL = 1;
var DIRETORES = 2;
var FINANCEIRO = 3;
var JURIDICO = 4;
var PREVENDAS = 5;
var TECNICO = 6;
var RH = 7;

var GROUPS = [
    'Administrativo',
    'Comercial',
    'Diretores',
    'Financeiro',
    'Juridico',
    'PreVendas',
    'Técnico',
    'RH'
];
module.exports.getAdministrators = function (req, res, next) {
    var admins = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[0], function (err, isMember) {
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    } else
                        callback(null);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[0]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[0],
                            users: admins,
                            permissions: true
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
};