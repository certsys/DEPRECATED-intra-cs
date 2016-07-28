var express = require('express');
var router = express.Router();
var Post = require('../models/posts');
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
        assinatura: req.body.assinatura,
        editions: [],
        data: req.body.data
    });

    newPost.save(function(err) {
        if (err) throw err;
        res.json({data: 'Post salvo com successo!'});
    });
});

router.delete('/remove/:id', function (req, res) {
    Post.findById(req.params.id, function(err, data) { //Soft delete
        data.isDeleted = true;
        data.editions.push(Date.now());
        data.save(function(err, data) {
            if(err) {
                console.log(err);
            }
            res.json(data);
        });
    });
    // Post.findByIdAndRemove(req.params.id, function(err, data) {
    //     res.json(data);
    // });
});

router.put('/edit/:id', function(req, res, next) {
    Post.findById(req.params.id, function(err, data) {
        data.titulo = req.body.titulo;
        if(req.body.imagem !== null) {
            data.imagem = req.body.imagem;
        }
        data.texto = req.body.texto;
        data.assinatura = req.body.assinatura;
        data.isDeleted = req.body.isDeleted;
        data.editions.push(Date.now());
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

