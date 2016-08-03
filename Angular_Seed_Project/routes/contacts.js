var express = require('express');
var router = express.Router();
var Contact = require('../models/contacts');
var jwt = require('jsonwebtoken');

router.use(function (req, res, next) {

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

});

// Pega usuário pelo email
router.get('/perfil', function (req, res) {

    var mail = req.param("mail");
    var query = Contact.where({mail: new RegExp(mail, 'ig')});
    query.find(function (err, data) {
        if (err) return console.error(err);
        res.json(data);
    })

});

// Pega todos os contatos
router.get('/', function (req, res) {

    var search = req.param("inputed");
    if (search) {
        var query = Contact.where({$or: [{'tooltable.tools_basic': new RegExp(search, 'i')}, {'tooltable.tools_intermediate': new RegExp(search, 'i')}, {'tooltable.tools_advanced': new RegExp(search, 'i')}]})
        query.find(function (err, contacts) {
            if (err) return console.error(err);
            res.json(contacts);
        })
    }
    else {
        Contact.find(function (err, contacts) {
            if (err) return console.error(err);
            res.json(contacts);
        })
    }
});


// Recebe um JSON e insere no banco de dados, para cadastrar novo contato
router.post('/', function (req, res) {
    var newContact = new Contact({
        nome: req.body.nome,
        sobre: req.body.sobre,
        grupo: req.body.grupo,
        tooltable: req.body.tooltable,
        mail: req.body.mail,
        telefone: req.body.phone,
        skype: req.body.skype,
        linkedin: req.body.linkedin,
        imagem: req.body.imagem
    });


    newContact.save(function (err) {
        if (err) throw err;
        res.json({data: 'Contato salvo com successo!'});
    });
});

router.put('/edit', function (req, res, next) {

    var mail = req.param("mail");
    var query = Contact.where({mail: new RegExp(mail, 'ig')});

    query.findOne(function (err, data) {
        data.sobre = req.body.sobre;
        data.tooltable = req.body.tooltable;
        data.telefone = req.body.telefone;
        data.skype = req.body.skype;
        data.linkedin = req.body.linkedin;
        data.imagem = req.body.imagem;

        data.save(function (err, data) {
            if (err) {
                return next(err);
            }
            res.status(201).json(data);
        });

    });
});

module.exports = router;

