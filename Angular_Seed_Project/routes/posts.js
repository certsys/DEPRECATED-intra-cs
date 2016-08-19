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
        if (posting[i].titulo === post.titulo &&
            posting[i].imagem === post.imagem &&
            posting[i].texto === post.texto &&
            posting[i].assinatura === post.assinatura &&
            posting[i].data.getTime() === post.data.getTime())
            return i;
        else i++;
    }
    return -1;
};

router.get('/clean', function () {
    posting.forEach(function (post) {
        console.log(post.data < Date.now());
        // if (post.data < Date.now()) {
        //     posting.splice(posting.indexOf(post), 1);
        // }
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

// Pega todos os Posts que não foram deletados e que possuem data anterior à atual
router.get('/', function (req, res) {
    var data_atual = new Date();
    Post.find({'isDeleted': false, 'data': {$lte: data_atual}}, function (err, posts) {
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
                var assinatura = req.body.assinatura;
                if (assinatura.indexOf('-') > -1)
                    assinatura = req.body.assinatura.substr(0, assinatura.indexOf('-'));
                var assinaturaEmail = '<div><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; color: rgb(33, 33, 33); margin-bottom: 10px;"><span style="font-weight: bold; color: rgb(134, 134, 134); display: inline;">' + req.body.sendBy + '</span><span style="display: inline;"> | </span> <span style="color: rgb(134, 134, 134); display: inline;">' + assinatura + '</span><span style="display: inline;"><br></span><a href="mailto:' + req.body.usermail + '" style="color: rgb(14, 76, 170); text-decoration: none; display: inline;">' + req.body.usermail + '</a><span style="display: inline;"><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; margin-bottom: 10px;"><span style="font-weight: bold; color: rgb(134, 134, 134); display: inline;">Certsys Tecnologia da Informação Ltda</span><span style="display: inline;"><br></span><span style="color: rgb(134, 134, 134); display: inline;"> + 55 11 5084-2984</span><span style="display: inline;"><br></span> <span style="color: rgb(134, 134, 134); display: inline;">Rua Estela 515 Conjunto F - 22</span><span></span><span style="display: inline;"><br></span><a href="http://www.certsys.com.br" style="color: rgb(14, 76, 170); text-decoration: none; display: inline;">www.certsys.com.br</a>  </p><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; color: rgb(33, 33, 33); margin-bottom: 10px;"><span style="color: rgb(134, 134, 134); display: inline;"><a alt="Facebook" style="text-decoration: none; display: inline;" href="https://www.facebook.com/certsys" target="_blank"> Facebook </a></span><span style="display: inline;">|</span><span style="color: rgb(134, 134, 134); display: inline;"><a alt="Facebook" style="text-decoration: none; display: inline;" href="https://www.linkedin.com/company/certsys-tecnologia-da-informa-o" target="_blank"> LinkedIn </a></span></div>';
                var email = {
                    from: req.body.usermail, // Quem enviou este e-mail
                    to: 'lucas_arthur_f@hotmail.com, lucas.arthur.f@icloud.com, lucas.arthur.felgueiras@gmail.com, lucas.felgueiras@usp.br, lucas.felgueiras@certsys.com.br', // Quem receberá (todos@certsys.com.br)
                    subject: req.body.titulo,  // Um assunto
                    html: '<img src="cid:imagemDoPost"/><br><br>' + req.body.texto + '<br>' + assinaturaEmail, // O conteúdo do e-mail
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
        var indice = search(data);
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

                        var assinatura = req.body.assinatura;
                        if (assinatura.indexOf('-') > -1)
                            assinatura = req.body.assinatura.substr(0, assinatura.indexOf('-'));
                        var assinaturaEmail = '<div><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; color: rgb(33, 33, 33); margin-bottom: 10px;"><span style="font-weight: bold; color: rgb(134, 134, 134); display: inline;">' + req.body.sendBy + '</span><span style="display: inline;"> | </span> <span style="color: rgb(134, 134, 134); display: inline;">' + assinatura + '</span><span style="display: inline;"><br></span><a href="mailto:' + req.body.usermail + '" style="color: rgb(14, 76, 170); text-decoration: none; display: inline;">' + req.body.usermail + '</a><span style="display: inline;"><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; margin-bottom: 10px;"><span style="font-weight: bold; color: rgb(134, 134, 134); display: inline;">Certsys Tecnologia da Informação Ltda</span><span style="display: inline;"><br></span><span style="color: rgb(134, 134, 134); display: inline;"> + 55 11 5084-2984</span><span style="display: inline;"><br></span> <span style="color: rgb(134, 134, 134); display: inline;">Rua Estela 515 Conjunto F - 22</span><span></span><span style="display: inline;"><br></span><a href="http://www.certsys.com.br" style="color: rgb(14, 76, 170); text-decoration: none; display: inline;">www.certsys.com.br</a>  </p><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; color: rgb(33, 33, 33); margin-bottom: 10px;"><span style="color: rgb(134, 134, 134); display: inline;"><a alt="Facebook" style="text-decoration: none; display: inline;" href="https://www.facebook.com/certsys" target="_blank"> Facebook </a></span><span style="display: inline;">|</span><span style="color: rgb(134, 134, 134); display: inline;"><a alt="Facebook" style="text-decoration: none; display: inline;" href="https://www.linkedin.com/company/certsys-tecnologia-da-informa-o" target="_blank"> LinkedIn </a></span></div>';
                        var email = {
                            from: req.body.usermail, // Quem enviou este e-mail
                            to: 'lucas_arthur_f@hotmail.com, lucas.arthur.f@icloud.com, lucas.arthur.felgueiras@gmail.com, lucas.felgueiras@usp.br, lucas.felgueiras@certsys.com.br', // Quem receberá (todos@certsys.com.br)
                            subject: req.body.titulo,  // Um assunto
                            html: '<img src="cid:imagemDoPost"/><br><br>' + req.body.texto + '<br>' + assinaturaEmail, // O conteúdo do e-mail
                            attachments: [{
                                filename: 'image.png',
                                path: req.body.imagem,
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

        } else res.json({status: true});
    });
});

// Pega um Post específico
router.get('/:post', function (req, res) {
    res.json(req.post);
});


module.exports = router;