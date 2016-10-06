var express = require('express');
var router = express.Router();
var User = require('../../../models/user');
var ActiveDirectory = require('../maintenance/activeDirectory');

var ad = ActiveDirectory.getActiveDirectory();
var groupName = 'Certsys';

/* PUT users listing. */
router.put('/', function (req, res, next) {
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            res.json(null);
            users.forEach(function(user) {
                User.findOne({sAMAccountName : user.sAMAccountName}, function (err, data) {
                    if(err) return err;
                    else if(data == null) {
                        var newUser = new User({
                            sAMAccountName: user.sAMAccountName,
                            mail: user.mail
                        });

                        newUser.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if(data != null) {
                        data.mail = user.mail
                        data.save(function (err, data) {
                            if (err) return next(err);
                            // res.status(201).json(data);
                        });
                    }
                });

            });
        }
    });
});

module.exports = router;