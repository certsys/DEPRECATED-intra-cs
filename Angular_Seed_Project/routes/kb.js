var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');





router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'Cert0104sys', function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Falha de autenticação do Token'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

router.get('/', function (req, res) {
    // res.download('util/fotos.csv');
});

router.post('/', function (req, res) {
    console.log(req.body.id);
    var file = 'kb/' + req.body.id;
    res.download(file);
    // res.json(file);
});

module.exports = router;

