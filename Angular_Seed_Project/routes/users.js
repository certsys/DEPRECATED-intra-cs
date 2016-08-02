var express = require('express');
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
var groupName = '';


/* GET users listing. */
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
                var user_groups = "";
                var final = [];

                var ad = new ActiveDirectory(config);
                ad.getGroupMembershipForUser(sAMAccountName, function(err, groups) {
                    if (err) {
                        console.log('ERROR: ' +JSON.stringify(err));
                        return;
                    }

                    if (! groups) console.log('User: ' + sAMAccountName + ' not found.');
                    else {
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

                        })

                        Contact.find({nome : user.cn}, function (err, data) {
                            if (user.sAMAccountName === "marco.villa.adm") {
                            }
                            else if (data.length > 0) {
                                data.forEach(function(individuo) {
                                    var is_same = (individuo.grupo.length == final.length) && individuo.grupo.every(function(element, index) {
                                            return element === final[index];
                                        });
                                    if (!is_same) {
                                        individuo.grupo = final;
                                        individuo.save(function(err, data) {
                                            if(err) {
                                                return next(err);
                                            }
                                            res.status(201).json(data);
                                        });
                                    }
                                });
                            }
                            else {
                                var newContact = new Contact({
                                    nome: user.cn,
                                    sobre: "Conte sua vida aqui!",
                                    grupo: final,
                                    tooltable: {},
                                    mail: user.sAMAccountName + "@certsys.com.br",
                                    telefone: "Digite seu telefone",
                                    skype: "Digite seu skype",
                                    imagem: ""
                                });

                                newContact.save(function (err) {
                                    if (err) return err;
                                });
                            }
                        });


                    }
                });

            });
        }
    });

});

module.exports = router;