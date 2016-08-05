var express = require('express');
var async = require('async');
var router = express.Router();
var Contact = require('../models/contacts');
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
var GROUPS = [
    'Administrativo',
    'Comercial',
    'Diretores',
    'Financeiro',
    'Juridico',
    'PreVendas',
    'Técnico'
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

router.get('/admins', function (req, res, next) {
    var admins = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function(user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[0], function (err, isMember) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    }
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    callback(null);
                });
            }, function(err) {
                if (err) return console.log(err);
                res.json(admins);
            });
        }
    });
});

router.get('/comercial', function (req, res, next) {
    var admins = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function(user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[1], function (err, isMember) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    }
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    callback(null);
                });
            }, function(err) {
                   if (err) return console.log(err);
                   res.json(admins);
            });
        }
    });
});

router.get('/directors', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function(user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[2], function (err, isMember) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        return callback(err);
                    }
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    return callback(null, user.sAMAccountName);
                });
            }, function(err) {
                if (err) return console.log(err);
                res.json(admins);
            });
        }
    });
});

router.get('/prevendas', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function(user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[5], function (err, isMember) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    }
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    callback(null);
                });
            }, function(err) {
                if (err) return console.log(err);
                res.json(admins);
            });
        }
    });
});

router.get('/tecnico', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function(user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[6], function (err, isMember) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    }
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    callback(null);
                });
            }, function(err) {
                if (err) return console.log(err);
                res.json(admins);
            });
        }
    });
});

/* PUT users listing. */
router.put('/', function (req, res, next) {
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            // res.json(JSON.stringify(users));
            res.json(users);
            users.forEach(function(user) {
                var sAMAccountName = user.sAMAccountName;
                var final = [];
                var extra_groups = user.dn.split(",");

                var ad = new ActiveDirectory(config);
                ad.getGroupMembershipForUser(sAMAccountName, function(err, groups) {
                    if (err) {
                        console.log('ERROR: ' +JSON.stringify(err));
                        return;
                    }

                    if (!groups) console.log('User: ' + sAMAccountName + ' not found.');
                    else {
                        extra_groups.forEach(function(extra) {
                            extra = (extra.split("="))[1];
                            if (extra != null && final.indexOf(extra) == -1) final.push(extra);
                        });

                        groups.forEach(function(group) {
                            var group_cn = group.cn.split(",");
                            var group_dn = group.dn.split(",");

                            group_cn.forEach(function(element) {
                                element = (element.split("="))[1];
                                if (element != null && final.indexOf(element) == -1) final.push(element);
                            });

                            group_dn.forEach(function(element) {
                                element = (element.split("="))[1];
                                if (element != null && final.indexOf(element) == -1) final.push(element);
                            });

                        });
                        Contact.findOne({nome : user.cn}, function (err, data) {
                            if (err) return err;
                            else if (user.sAMAccountName === "marco.villa.adm") {
                            }
                            else if (final.indexOf("Ex-Funcionarios") < 0 && data == null) {
                                if (user.mail != undefined && user.mail.indexOf("@") < 0)
                                    email = user.mail + "@certsys.com.br";
                                else email = user.mail;
                                var newContact = new Contact({
                                    nome: user.cn,
                                    sobre: "",
                                    grupo: final,
                                    tooltable: {},
                                    mail: user.mail,
                                    telefone: "",
                                    skype: "",
                                    linkedin: "",
                                    imagem: ""
                                });

                                newContact.save(function (err) {
                                    if (err) return err;
                                });
                            }
                            else if (data != null) {
                                if (final.indexOf("Ex-Funcionarios") > -1) {
                                    data.remove(function(err, data) {
                                        if (err) return next(err);
                                    });
                                }
                                else {
                                    if (user.mail != undefined && user.mail.indexOf("@") < 0)
                                        email = user.mail + "@certsys.com.br";
                                    else email = user.mail;
                                    if (data.mail == undefined) {
                                        data.mail = user.sAMAccountName + "@certsys.com.br"
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                    else if (user.mail != undefined && data.mail !== email) {
                                        data.mail = email;
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                    var is_same = (data.grupo.length == final.length) && data.grupo.every(function (element, index) {
                                            return element === final[index];
                                        });
                                    if (!is_same) {
                                        data.grupo = final;
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            });
        }
    });
});

module.exports = router;