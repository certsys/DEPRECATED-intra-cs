var express = require('express');
var router = express.Router();
var Post = require('../models/posts');
var jwt    = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var smtpTransport = require('nodemailer-smtp-transport');


router.post('/', function (req, res) {

    // var newPost = new Post({
    //     titulo: req.body.titulo,
    //     imagem: req.body.imagem,
    //     texto: req.body.texto,
    //     assinatura: req.body.assinatura,
    //     editions: [],
    //     data: req.body.data
    // });
    //
    // newPost.save(function(err) {
    //     if (err) throw err;
    //     res.json({data: 'Post salvo com successo!'});
    // });



    // ENVIO DE E-MAIL
    var options = {
        host: 'webmail.exchange.locaweb.com.br',
        port: 465, // Porta SMTP over SSL no Exchange
        tls: {
            secureProtocol: "TLSv1_method"
        },
        secure: true,
        auth: {
            user: 'henrique.cavalcante@certsys.com.br',
            pass: 'wv74zt7g$'
        }
    };

    var transporter = nodemailer.createTransport(smtpTransport(options));

    transporter.verify(function(error, success) {
        if (error) {
            res.json(error);
        } else {
            res.json('Server is ready to take our messages');
        }
    });

    // Após configurar o transporte chegou a hora de criar um e-mail
    // para enviarmos, para isso basta criar um objeto com algumas configurações

    // var email = {
    //     from: 'henrique.cavalcante@certsys.com.br', // Quem enviou este e-mail
    //     to: 'lucas.felgueiras@certsys.com.br', // Quem receberá
    //     subject: req.body.titulo,  // Um assunto bacana :-)
    //     html: '<img src="cid:imagemDoPost"/><br><br>' + req.body.texto + '<br>' + req.body.assinatura, // O conteúdo do e-mail
    //     attachments: [{
    //         filename: 'image.png',
    //         path: req.body.imagem,
    //         cid: 'imagemDoPost' //same cid value as in the html img src
    //     }]
    // };

    // Pronto, tudo em mãos, basta informar para o transporte
    // que desejamos enviar este e-mail

    //
    // if(req.body.data) {
    //     var date = new Date(req.body.data);
    //     var agendamento = schedule.scheduleJob(date, function(){
    //         transporte.sendMail(email, function (err, info) {
    //             if (err)
    //                 throw err; // Oops, algo de errado aconteceu.
    //
    //             console.log('Email enviado! Leia as informações adicionais: ', info);
    //         });
    //     });
    // }
    // else {
    //     transporte.sendMail(email, function (err, info) {
    //         if (err)
    //             throw err; // Oops, algo de errado aconteceu.
    //
    //         console.log('Email enviado! Leia as informações adicionais: ', info);
    //     });
    // }
});

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
// Pega todos os Posts que não foram deletados
router.get('/', function(req, res){
    Post.find({ 'isDeleted': false }, function (err, posts) {
        if (err) return console.error(err);
        res.json(posts);
    })
});

// Pega todos os Posts
router.get('/all', function(req, res){
    Post.find(function (err, posts) {
        if (err) return console.error(err);
        res.json(posts);
    })
});

// Recebe um JSON, insere no banco de dados e envia email com os dados


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

