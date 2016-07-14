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
        titulo: req.body.titulo,
        imagem: req.body.imagem,
        texto: req.body.texto,
        assinatura: req.body.assinatura
    });

    newContact.save(function(err) {
        if (err) throw err;
        res.json({data: 'Contato salvo com successo!'});
    });
});

module.exports = router;

