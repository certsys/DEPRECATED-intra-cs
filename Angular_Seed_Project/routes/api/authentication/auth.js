var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var ActiveDirectory = require('../maintenance/activeDirectory');

var ad = ActiveDirectory.getActiveDirectory();

exports.auth = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'Cert0104sys', function (err, decoded) {
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
};

exports.createCredentials = function (req, res) {
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
                        expiresIn: 14400 // Tempo em segundos ( 1 hora )
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
};