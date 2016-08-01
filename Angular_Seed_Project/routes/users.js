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
var groupName = 'Certsys';


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

                var ad = new ActiveDirectory(config);
                ad.getGroupMembershipForUser(sAMAccountName, function(err, groups) {
                    if (err) {
                        console.log('ERROR: ' +JSON.stringify(err));
                        return;
                    }

                    if (! groups) console.log('User: ' + sAMAccountName + ' not found.');
                    else {
                        user_groups = groups;
                    }
                });

                var vector_groups = user_groups.split(",");
                var final = [];

                vector_groups.forEach(function(group) {
                    group = (group.split("="))[1];
                    final.push(group);
                });

                Contact.find({nome : user.cn}, function (err, data) {
                    if (data.length > 0) {
                        console.log("Dado já existente no sistema");
                    }
                    else {
                        console.log("Dado não existente no sistema");
                        var groups = [];

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
            });
        }
    });

});

module.exports = router;