var express = require('express');
var async = require('async');
var router = express.Router();
var Group = require('../../../models/groups');
var ActiveDirectory = require('activedirectory');
var jwt = require('jsonwebtoken');

var config = {
    url: 'ldap://192.168.129.2:389',
    baseDN: 'OU=Certsys,DC=certsys,DC=local',
    username: 'svc_intranet@certsys.local',
    password: 'dAgAcupU6rA='
};

var ad = new ActiveDirectory(config);
var password = 'dAgAcupU6rA=';
var groupName = 'Certsys';

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


// router.get('/permission', function (req, res, next) {
//     var sAMAccountName = req.param("token");
//     console.log(sAMAccountName);
//     ad.isUserMemberOf(sAMAccountName, GROUPS[0], function(err, isMember) {
//         if (err) {
//             console.log('ERROR: ' + JSON.stringify(err));
//             return;
//         }
//         res.json(JSON.stringify(isMember));
//     });
// });

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

router.post('/admins', function (req, res, next) {
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
});

router.post('/comercial', function (req, res, next) {
    var admins = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[1], function (err, isMember) {
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
                Group.findOne({name: GROUPS[1]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[1],
                            users: admins,
                            permissions: false
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
});

router.post('/directors', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[2], function (err, isMember) {

                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        return callback(err);
                    } else
                        return callback(null, user.sAMAccountName);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[2]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[2],
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
});

router.post('/prevendas', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[5], function (err, isMember) {

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
                Group.findOne({name: GROUPS[5]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[5],
                            users: admins,
                            permissions: false
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
});

router.post('/tecnico', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[6], function (err, isMember) {

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
                Group.findOne({name: GROUPS[6]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[6],
                            users: admins,
                            permissions: false
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
});


router.post('/rh', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[7], function (err, isMember) {

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
                Group.findOne({name: GROUPS[7]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[7],
                            users: admins,
                            permissions: false
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
});

router.get('/', function (req, res, next) {
    Group.find(function (err, group) {
        if (err) return console.error(err);
        res.json(group);
    })
});

module.exports = router;