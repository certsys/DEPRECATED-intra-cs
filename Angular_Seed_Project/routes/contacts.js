var express = require('express');
var router = express.Router();
var Contact = require('../models/contacts');
var jwt    = require('jsonwebtoken');





router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    console.log(req.headers['x-access-token']);

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


// Pega todos os contatos
router.get('/', function(req, res){
    Contact.find(function (err, contacts) {
        if (err) return console.error(err);
        res.json(contacts);
    })
});


// Recebe um JSON e insere no banco de dados, para cadastrar novo contato
router.post('/', function (req, res) {
    var newContact = new Contact({
        nome: req.body.nome,
        sobre: req.body.sobre,
        tooltable: req.body.tooltable,        
        mail: req.body.mail,
        telefone: req.body.phone,
        skype: req.body.skype,
        imagem: req.body.imagem 
    });



    newContact.save(function(err) {
        if (err) throw err;
        res.json({data: 'Contato salvo com successo!'});
    });
});

module.exports = router;

