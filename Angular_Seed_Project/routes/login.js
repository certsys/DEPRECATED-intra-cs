var express = require('express');
var router = express.Router();
var ActiveDirectory = require('activedirectory');


var config = {
    url: 'ldap://192.168.129.2:389',
    baseDN: 'ou="Certsys",dc="certsys",dc="local"',
    username: 'svc_intranet@certsys.local',
    password: 'Cert0104sys'
}

var ad = new ActiveDirectory(config);
// var username = 'pedro.strabeli@certsys.com.br';
var username = 'svc_intranet@certsys.local';
// var password = 'password';
var password = 'Cert0104sys';


/* GET users listing. */
router.get('/', function (req, res, next) {
    ad.userExists(username, function(err, exists) {
        if (err) {
            res.json(JSON.stringify(err));
            return;
        }

        res.json({data : username   +' exists: '+ exists});
    });

});

router.post('/', function (req, res) {
    // ad.authenticate(req.body.username, req.body.password, function (err, auth) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            res.json(JSON.stringify(err));
            return;
        }

        if (auth) {
            res.json({data: 'Entrou!'});
        }
        else {
            res.json({data: 'Falha de autenticação...'});
        }
    });
});


module.exports = router;
