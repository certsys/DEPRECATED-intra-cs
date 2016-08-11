var express = require('express');
var router = express.Router();
var Post = require('../models/posts');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var smtpTransport = require('nodemailer-smtp-transport');

var mails = [];
var posting = [];

var search = function (post) {
    var i = 0;
    while (i < posting.length) {
        if (posting[i].imagem === post.imagem)
            return i;
        else i++;
    }
    return -1;
};

router.get('/clean', function () {
    posting.forEach(function (post) {
        if (post.data < Date.now()) {
            posting.splice(posting.indexOf(post), 1);
        }
    });
    res.json(null);
});

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
// Pega todos os Posts que não foram deletados
router.get('/', function (req, res) {
    Post.find({'isDeleted': false}, function (err, posts) {
        if (err) return console.error(err);
        res.json(posts);
    })
});

// Pega todos os Posts
router.get('/all', function (req, res) {
    Post.find(function (err, posts) {
        if (err) return console.error(err);
        res.json(posts);
    })
});

// Recebe um JSON, insere no banco de dados e envia email com os dados
router.post('/', function (req, res) {

    if (req.body.usermail && req.body.password) {
        // ENVIO DE E-MAIL
        var options = {
            host: 'webmail.exchange.locaweb.com.br',
            port: 587, // Porta SMTP no Exchange
            auth: {
                user: req.body.usermail, // Colocar e-mail do RH aqui;
                pass: req.body.password // Senha do e-mail aqui;
            }
        };

        var transporter = nodemailer.createTransport(smtpTransport(options));

        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                res.json(
                    {
                        status: false,
                        mail: true
                    });
            } else {

                var newPost = new Post({
                    titulo: req.body.titulo,
                    imagem: req.body.imagem,
                    texto: req.body.texto,
                    assinatura: req.body.assinatura,
                    editions: [],
                    data: req.body.data
                });

                newPost.save(function (err) {
                    if (err) throw err;
                });

                // Após configurar o transporte chegou a hora de criar um e-mail
                // para enviarmos, para isso basta criar um objeto com algumas configurações

                var email = {
                    from: req.body.usermail, // Quem enviou este e-mail
                    to: 'henrique_hashimoto@hotmail.com', // Quem receberá (todos@certsys.com.br)
                    subject: req.body.titulo,  // Um assunto
                    html: '<img src="cid:imagemDoPost"/><br><br>' + req.body.texto + '<br>' + req.body.assinatura, // O conteúdo do e-mail
                    attachments: [{
                        filename: 'image.png',
                        path: req.body.imagem,
                        cid: 'imagemDoPost'
                    }]
                };


                if (req.body.data) {
                    var date = new Date(req.body.data);
                    var agendamento = schedule.scheduleJob(date, function () {
                        transporter.sendMail(email, function (err, info) {
                            if (err)
                                console.error(err);

                        });
                    });
                    posting.push(newPost);
                    mails.push(agendamento);
                    res.json(
                        {
                            status: true,
                            mail: true
                        });
                }
                else {
                    transporter.sendMail(email, function (err, info) {
                        if (err)
                            console.error(err);
                        res.json(
                            {
                                status: true,
                                mail: true
                            });
                    });
                }
            }
        });

    }
    else {

        var newPost = new Post({
            titulo: req.body.titulo,
            imagem: req.body.imagem,
            texto: req.body.texto,
            assinatura: req.body.assinatura,
            editions: [],
            data: req.body.data
        });

        newPost.save(function (err) {
            if (err) throw err;
        });
        res.json({
            status: true
        });
    }
});


router.delete('/remove/:id', function (req, res) {
    Post.findById(req.params.id, function (err, data) { //Soft delete
        data.isDeleted = true;
        data.editions.push(Date.now());
        data.save(function (err, data) {
            if (err) {
                console.log(err);
            }
            res.json(data);
        });
        var indice = search(data);
        if (indice > -1) {
            mails[indice].cancel();
        }
    });
    // Post.findByIdAndRemove(req.params.id, function(err, data) {
    //     res.json(data);
    // });
});

router.put('/edit/:id', function (req, res, next) {
    Post.findById(req.params.id, function (err, data) {
        data.titulo = req.body.titulo;
        if (req.body.imagem !== null) {
            data.imagem = req.body.imagem;
        }
        data.texto = req.body.texto;
        data.assinatura = req.body.assinatura;
        data.isDeleted = req.body.isDeleted;
        data.editions.push(Date.now());
        data.save(function (err, data) {
            if (err) {
                return next(err);
            }
        });
        var editPost = new Post({
            titulo: data.titulo,
            imagem: data.imagem,
            texto: data.texto,
            assinatura: data.assinatura,
            editions: data.editions,
            data: data.data
        });
        var indice = search(data);
        if (indice > -1) {
            if (req.body.usermail && req.body.password) {
                // ENVIO DE E-MAIL
                var options = {
                    host: 'webmail.exchange.locaweb.com.br',
                    port: 587, // Porta SMTP no Exchange
                    auth: {
                        user: req.body.usermail, // Colocar e-mail do RH aqui;
                        pass: req.body.password // Senha do e-mail aqui;
                    }
                };

                var transporter = nodemailer.createTransport(smtpTransport(options));

                transporter.verify(function (error, success) {
                    console.log(error);
                    console.log(success);
                    if (error) {
                        res.json(
                            {
                                status: false,
                                mail: true
                            });
                    } else {

                        // Após configurar o transporte chegou a hora de criar um e-mail
                        // para enviarmos, para isso basta criar um objeto com algumas configurações

                        var email = {
                            from: req.body.usermail, // Quem enviou este e-mail
                            to: 'henrique_hashimoto@hotmail.com', // Quem receberá (todos@certsys.com.br)
                            subject: editPost.titulo,  // Um assunto
                            html: '<img src="cid:imagemDoPost"/><br><br>' + editPost.texto + '<br>' + editPost.assinatura, // O conteúdo do e-mail
                            attachments: [{
                                filename: 'image.png',
                                path: data.imagem,
                                cid: 'imagemDoPost'
                            }]
                        };
                        var date = new Date(editPost.data);
                        var agendamento = schedule.scheduleJob(date, function () {
                            transporter.sendMail(email, function (err, info) {
                                if (err)
                                    console.error(err);
                            });
                        });
                        posting[indice] = editPost;
                        mails[indice].cancel();
                        mails[indice] = agendamento;

                        res.json({
                            status: true,
                            mail: true
                        });
                    }
                });
            } else
                res.json({
                    status: true
                });
        }
    });
});

// Pega um Post específico
router.get('/:post', function (req, res) {
    res.json(req.post);
});


module.exports = router;

