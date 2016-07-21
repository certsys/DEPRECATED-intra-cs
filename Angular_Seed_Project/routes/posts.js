var express = require('express');
var router = express.Router();
var Post = require('../models/posts');

// Pega todos os Posts
router.get('/', function(req, res){
    Post.find(function (err, posts) {
        if (err) return console.error(err);
        res.json(posts);
    })
});

// Recebe um JSON e insere no banco de dados
router.post('/', function (req, res) {
    var newPost = new Post({
        titulo: req.body.titulo,
        imagem: req.body.imagem,
        texto: req.body.texto,
        assinatura: req.body.assinatura
    });

    newPost.save(function(err) {
        if (err) throw err;
        res.json({data: 'Post salvo com successo!'});
    });
});

router.delete('/remove/:id', function (req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, data) {
        res.json(data);
    });
});

router.put('/edit/:id', function(req, res, next) {
    Post.findById(req.params.id, function(err, data) {
        data.titulo = req.body.titulo;
        if(req.body.imagem !== "") {
            data.imagem = req.body.imagem;
        }
        data.texto = req.body.texto;
        data.assinatura = req.body.assinatura;
        data.data = Date.now();
        data.save(function(err, data) {
            if(err) {
                return next(err);
            }
            res.status(201).json(data);
        });
    });
});

// Pega um Post específico
router.get('/:post', function(req, res){
    res.json(req.post);
});

module.exports = router;

