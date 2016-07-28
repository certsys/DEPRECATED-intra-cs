var express = require('express');
var router = express.Router();
var ActiveDirectory = require('activedirectory');
var jwt    = require('jsonwebtoken');


var config = {
    url: 'ldap://192.168.129.2:389',
    baseDN: 'OU=Certsys,DC=certsys,DC=local',
    username: 'svc_intranet@certsys.local',
    password: 'dAgAcupU6rA='
}

var ad = new ActiveDirectory(config);
// var username = 'pedro.strabeli@certsys.com.br';
var username = 'svc_intranet@certsys.local';
// var password = 'password';
var password = 'dAgAcupU6rA=';
var groupName = 'Certsys';


/* GET users listing. */
router.get('/', function (req, res, next) {
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            res.json(JSON.stringify(users));
        }
    });

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
