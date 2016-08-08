var express = require('express');
var router = express.Router();
var User = require('../models/user');
var ActiveDirectory = require('activedirectory');
var jwt = require('jsonwebtoken');

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
//
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//
//     // decode token
//     if (token) {
//
//         // verifies secret and checks exp
//         jwt.verify(token, 'Cert0104sys', function (err, decoded) {
//             if (err) {
//                 return res.status(403).send({
//                     success: false,
//                     message: 'Falha de autenticação do Token'
//                 });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//
//     } else {
//
//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//
//     }
//
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