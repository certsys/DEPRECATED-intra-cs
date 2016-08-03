var express = require('express');
var router = express.Router();
var ActiveDirectory = require('activedirectory');
var jwt = require('jsonwebtoken');
var Contact = require('../models/contacts');


var config = {
    url: 'ldap://192.168.129.2:389',
    baseDN: 'DC=certsys,DC=local',
    username: 'svc_intranet@certsys.local',
    password: 'dAgAcupU6rA='
}

var ad = new ActiveDirectory(config);
var username = 'henrique.cavalcante';
var password = 'dAgAcupU6rA=';
var groupName = 'Certsys';
var sAMAccountName = 'henrique.cavalcante';


/* GET users listing. */
router.get('/', function (req, res, next) {

    var contacts = Contact.find(function (err, contacts) {
        if (err) return console.error(err);
        ad.getUsersForGroup('Certsys', function (err, users) {
            if (err) {
                res.json('ERROR: ' + JSON.stringify(err));
                return;
            }

            if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
            else {
                var usuarios = JSON.parse(JSON.stringify(users));
                var nomes = [];
                for (var i = 0; i < usuarios.length; i++) {
                    ad.isUserMemberOf(usuarios[i].sAMAccountName, 'Ex-Funcionarios', function (err, isMember) {
                        if (err) {
                            console.log('ERROR: ' + JSON.stringify(err));
                            return;
                        }

                        if (isMember)
                            nomes.push(usuarios[i].sAMAccountName);
                    });
                }

                res.json(JSON.stringify(nomes));

            }
        });
    });


});

router.get('/ex', function (req, res, next) {
    

});

router.post('/', function (req, res) {
    ad.authenticate(req.body.username, req.body.password, function (err, auth) {
        // ad.authenticate(username, password, function (err, auth) {
        if (err) {
            res.json(JSON.stringify(err));
            return;
        }

        if (auth) {
            // res.json({data: 'Entrou!'});
            ad.findUser(req.body.username, function (err, user) {
                if (err) {
                    res.json(JSON.stringify(err));
                    return;
                }

                if (!user) res.json({data: 'User: ' + req.body.username + ' not found.'});
                else {
                    var token = jwt.sign(user, 'Cert0104sys', {
                        expiresIn: 3600 // Tempo em segundos ( 1 hora )
                    });

                    res.json({
                        success: true,
                        user: user,
                        token: token
                    });
                }
            });
        }
        else {
            res.json({data: 'Falha de autenticação...'});
        }
    });
});


module.exports = router;
