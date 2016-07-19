var express = require('express');
var router = express.Router();
var Contact = require('../models/contacts');

// Pega todos os Posts
router.get('/', function(req, res){
    Contact.find(function (err, contacts) {
        if (err) return console.error(err);
        res.json(contacts);
    })
});

// Recebe um JSON e insere no banco de dados
router.post('/', function (req, res) {
    var newContact = new Contact({
        nome: req.body.nome,
        ferramenta_principal: req.body.ferramenta_principal,
        mail: req.body.mail,
        telefone: req.body.telefone,
        skype: req.body.skype,
        imagem: req.body.imagem,
        ferramentas: req.body.ferramentas,
    });

    newContact.save(function(err) {
        if (err) throw err;
        res.json({data: 'Contato salvo com successo!'});
    });
});

module.exports = router;

