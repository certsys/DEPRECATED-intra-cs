var express = require('express');
var router = express.Router();
var User = require('../../../models/user');
var ActiveDirectory = require('activedirectory');

var config = {
    url: 'ldap://192.168.129.2:389',
    baseDN: 'OU=Certsys,DC=certsys,DC=local',
    username: 'svc_intranet@certsys.local',
    password: 'dAgAcupU6rA='
};

var ad = new ActiveDirectory(config);
// var username = 'pedro.strabeli@certsys.com.br';
var username = 'svc_intranet@certsys.local';
// var password = 'password';
var password = 'dAgAcupU6rA=';
var groupName = 'Certsys';


// router.use(function (req, res, next) {
//     global.verificaToken(req, res, next)
// });

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