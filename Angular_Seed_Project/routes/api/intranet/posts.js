var express = require('express');
var router = express.Router();
var Post = require('../../../models/posts');
var async = require('async');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var smtpTransport = require('nodemailer-smtp-transport');

var EMAIL_CERTSYS = 'intranet@certsys.com.br';
var EMAIL_CS_CONSULTING = 'intranet@csconsulting.com.br';
var EMAIL_PASS = 'dQx-k4a-Hw7-PkY';

var TODOS_CERTSYS = 'todos@certsys.com.br';
var TODOS_CS_CONSULTING = 'todos@csconsulting.com.br';

var CERTSYS = 'certsys';
var CS_CONSULTING = 'csconsulting';
// var EMAIL_CERTSYS = 'henrique.cavalcante@certsys.com.br';
// var EMAIL_CS_CONSULTING = 'henrique.cavalcante@certsys.com.br';
// var EMAIL_PASS = '';

// var TODOS_CERTSYS = 'henrique.hashimoto.cavalcante@usp.br';
// var TODOS_CS_CONSULTING = 'henrique_hashimoto@hotmail.com';

var HOST = 'webmail.exchange.locaweb.com.br';
var SMTP_PORT = 587;

var OPTIONS_CERTSYS = {
    host: HOST,
    port: SMTP_PORT, // Porta SMTP no Exchange
    auth: {
        user: EMAIL_CERTSYS, // Colocar e-mail do RH aqui;
        pass: EMAIL_PASS // Senha do e-mail aqui;
    }
};


var OPTIONS_CSCONSULTING = {
    host: HOST,
    port: SMTP_PORT, // Porta SMTP no Exchange
    auth: {
        user: EMAIL_CS_CONSULTING, // Colocar e-mail do RH aqui;
        pass: EMAIL_PASS // Senha do e-mail aqui;
    }
};

var mailsCs = [];
var mailsCsConsulting = [];
var postingCs = [];
var postingCsConsulting = [];

var emailRestart = function (post) {

    var transporterCertsys = nodemailer.createTransport(smtpTransport(OPTIONS_CERTSYS));
    transporterCertsys.verify(function (error, success) {
        if (error) return console.error(error);
        else {
            var transporterCsConsulting = nodemailer.createTransport(smtpTransport(OPTIONS_CSCONSULTING));
            transporterCsConsulting.verify(function (error, success) {
                if (error) return console.error(error);
                else {
                    verifyRestart(post, transporterCsConsulting, CS_CONSULTING);
                    verifyRestart(post, transporterCertsys, CERTSYS);
                }
            });
        }
    });


};

var verifyRestart = function (post, transporter, type) {

    var data_atual = new Date();

    if (post.data >= data_atual && post.mail) {
        // console.log("Post Futuro");
        var to = TODOS_CERTSYS;
        if (type === CS_CONSULTING) to = TODOS_CS_CONSULTING;
        var email = {
            from: post.mail.from, // Quem enviou este e-mail
            to: to, // Quem receberá (todos@certsys.com.br)
            subject: post.mail.subject,  // Um assunto
            html: post.mail.html, // O conteúdo do e-mail
            attachments: post.mail.attachments
        };
        var date = new Date(post.data);
        var agendamento = schedule.scheduleJob(date, function () {
            transporter.sendMail(email, function (err, info) {
                if (err)
                    console.error(err);
            });
        });
        var newPost = new Post({
            mail: post.mail,
            titulo: post.titulo,
            imagem: post.imagem,
            texto: post.texto,
            assinatura: post.assinatura,
            editions: post.editions,
            data: post.data
        });

        if (type === CERTSYS) {
            postingCs.push(newPost);
            mailsCs.push(agendamento);
        }
        else {
            postingCsConsulting.push(newPost);
            mailsCsConsulting.push(agendamento);
        }
    }
};
var search = function (post, type) {
    var posting = postingCsConsulting;
    if (type === CERTSYS) posting = postingCs;
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

var criarEmail = function (assinatura, from, titulo, texto, imagem, who) {
    if (assinatura.indexOf('-') > -1)
        assinatura = assinatura.substr(0, assinatura.indexOf('-'));
    var to = TODOS_CS_CONSULTING;
    if (who === CERTSYS)
        to = TODOS_CERTSYS;
    var assinaturaEmail = '<div><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; color: rgb(33, 33, 33); margin-bottom: 10px;"><span style="font-weight: bold; color: rgb(134, 134, 134); display: inline;">Intranet Certsys</span><span style="display: inline;"> | </span> <span style="color: rgb(134, 134, 134); display: inline;">' + assinatura + '</span><span style="display: inline;"><br></span><a href="mailto:' + from + '" style="color: rgb(14, 76, 170); text-decoration: none; display: inline;">' + from + '</a><span style="display: inline;"><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; margin-bottom: 10px;"><span style="font-weight: bold; color: rgb(134, 134, 134); display: inline;">Certsys Tecnologia da Informação Ltda</span><span style="display: inline;"><br></span><span style="color: rgb(134, 134, 134); display: inline;"> + 55 11 5084-2984</span><span style="display: inline;"><br></span> <span style="color: rgb(134, 134, 134); display: inline;">Rua Estela 515 Conjunto F - 22</span><span></span><span style="display: inline;"><br></span><a href="http://www.certsys.com.br" style="color: rgb(14, 76, 170); text-decoration: none; display: inline;">www.certsys.com.br</a>  </p><p style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 14px; color: rgb(33, 33, 33); margin-bottom: 10px;"><span style="color: rgb(134, 134, 134); display: inline;"><a alt="Facebook" style="text-decoration: none; display: inline;" href="https://www.facebook.com/certsys" target="_blank"> Facebook </a></span><span style="display: inline;">|</span><span style="color: rgb(134, 134, 134); display: inline;"><a alt="Facebook" style="text-decoration: none; display: inline;" href="https://www.linkedin.com/company/certsys-tecnologia-da-informa-o" target="_blank"> LinkedIn </a></span></div>';
    var email = {
        from: from, // Quem enviou este e-mail
        to: to, // Quem receberá (todos@certsys.com.br)
        subject: titulo,  // Um assunto
        html: '<img src="cid:imagemDoPost"/><br><br>' + texto + '<br>' + assinaturaEmail, // O conteúdo do e-mail
        attachments: [{
            filename: 'image.png',
            path: imagem,
            cid: 'imagemDoPost'
        }]
    };

    return email;

};

var criarPost = function (email, titulo, imagem, texto, assinatura, data) {

    var newPost = new Post({
        mail: email,
        titulo: titulo,
        imagem: imagem,
        texto: texto,
        assinatura: assinatura,
        editions: [],
        data: data
    });

    return newPost;

};

var enviarEmail = function (data, email, newPost, transporter, type) {
    // Se a postagem for agendada
    if (data) {
        var date = new Date(data);
        var agendamento = schedule.scheduleJob(date, function () {
            transporter.sendMail(email, function (err, info) {
                if (err)
                    console.error(err);

            });
        });
        if (type === CERTSYS) {
            postingCs.push(newPost);
            mailsCs.push(agendamento);
        } else {
            postingCsConsulting.push(newPost);
            mailsCsConsulting.push(agendamento);
        }
    }
    else {
        transporter.sendMail(email, function (err, info) {
            if (err)
                console.error(err);
        });
    }
};


router.get('/clean', function () {
    postingCs.forEach(function (post) {
        console.log(post.data < Date.now());
        // if (post.data < Date.now()) {
        //     posting.splice(posting.indexOf(post), 1);
        // }
    });
    postingCsConsulting.forEach(function (post) {
        console.log(post.data < Date.now());
        // if (post.data < Date.now()) {
        //     posting.splice(posting.indexOf(post), 1);
        // }
    });
    res.json(null);
});

router.get('/reschedule', function (req, res) {
    Post.find(function (err, posts) {
        if (err) return console.error(err);
        posts.forEach(function (post) {
            if (!post.isDeleted)
                emailRestart(post);
        });
        res.json(
            {
                status: true,
                mail: true
            });
    });
});

// router.use(function (req, res, next) {
//     global.verificaToken(req, res, next)
// });

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

    if (req.body.mala) {

        // ENVIO DE E-MAIL

        var transporterCertsys = nodemailer.createTransport(smtpTransport(OPTIONS_CERTSYS));
        var transporterCsConsulting = nodemailer.createTransport(smtpTransport(OPTIONS_CSCONSULTING));

        // verify connection configuration
        transporterCertsys.verify(function (error, success) {
            if (error) {
                res.json(
                    {
                        status: false,
                        mail: true
                    });
            } else {
                // Após configurar o transporte chegou a hora de criar um e-mail
                // para enviarmos, para isso basta criar um objeto com algumas configurações
                var email = criarEmail(req.body.assinatura, EMAIL_CERTSYS, req.body.titulo, req.body.texto, req.body.imagem, CERTSYS);
                var newPost = criarPost(email, req.body.titulo, req.body.imagem, req.body.texto, req.body.assinatura, req.body.data);
                newPost.save(function (err) {
                    if (err) throw err;
                });
                enviarEmail(req.body.data, email, newPost, transporterCertsys, CERTSYS);
            }
        });

        transporterCsConsulting.verify(function (error, success) {
            if (error) {
                res.json(
                    {
                        status: false,
                        mail: true
                    });
            } else {
                // Após configurar o transporte chegou a hora de criar um e-mail
                // para enviarmos, para isso basta criar um objeto com algumas configurações
                var email = criarEmail(req.body.assinatura, EMAIL_CS_CONSULTING, req.body.titulo, req.body.texto, req.body.imagem, CS_CONSULTING);
                var newPost = criarPost(email, req.body.titulo, req.body.imagem, req.body.texto, req.body.assinatura, req.body.data);
                enviarEmail(req.body.data, email, newPost, transporterCsConsulting, CS_CONSULTING);
            }
        });


        res.json(
            {
                status: true,
                mail: true
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

            var indice = search(data, CERTSYS);
            if (indice > -1) {
                mailsCs[indice].cancel();
                mailsCsConsulting[indice].cancel();
            }
            res.json(data);
        });
    });
    // Post.findByIdAndRemove(req.params.id, function(err, data) {
    //     res.json(data);
    // });
});

router.put('/edit/:id', function (req, res, next) {
    Post.findById(req.params.id, function (err, data) {

        var indice = search(data, CERTSYS);
        var email = null;
        if(req.body.mala)
            email = criarEmail(req.body.assinatura, EMAIL_CERTSYS, req.body.titulo, req.body.texto, req.body.imagem, CERTSYS);

        data.titulo = req.body.titulo;
        if (req.body.imagem !== null) {
            data.imagem = req.body.imagem;
        }
        data.texto = req.body.texto;
        data.mail = email;
        data.assinatura = req.body.assinatura;
        data.isDeleted = req.body.isDeleted;
        data.editions.push(Date.now());


        data.save(function (err, data) {
            if (err)
                return next(err);
        });
        if (indice > -1) {
            if (req.body.mala) {

                // ENVIO DE E-MAIL

                var transporterCertsys = nodemailer.createTransport(smtpTransport(OPTIONS_CERTSYS));
                var transporterCsConsulting = nodemailer.createTransport(smtpTransport(OPTIONS_CSCONSULTING));

                var updatedPost = new Post({
                    titulo: data.titulo,
                    mail: email,
                    imagem: data.imagem,
                    texto: data.texto,
                    assinatura: data.assinatura,
                    editions: data.editions,
                    data: data.data
                });

                transporterCertsys.verify(function (error, success) {
                    if (error) {
                        res.json(
                            {
                                status: false,
                                mail: true
                            });
                    } else {
                        transporterCsConsulting.verify(function (error, success) {
                            if (error) {
                                res.json(
                                    {
                                        status: false,
                                        mail: true
                                    });
                            } else {
                                var emailCS = {
                                    from: data.mail.from, // Quem enviou este e-mail
                                    to: TODOS_CERTSYS, // Quem receberá (todos@certsys.com.br)
                                    subject: data.mail.subject,  // Um assunto
                                    html: data.mail.html, // O conteúdo do e-mail
                                    attachments: data.mail.attachments
                                };
                                var date = new Date(data.data);
                                var agendamentoCertsys = schedule.scheduleJob(date, function () {
                                    transporterCertsys.sendMail(emailCS, function (err, info) {
                                        if (err)
                                            console.error(err);
                                    });
                                });
                                postingCs[indice] = updatedPost;
                                mailsCs[indice].cancel();
                                mailsCs[indice] = agendamentoCertsys;

                                var emailCSConsulting = {
                                    from: data.mail.from, // Quem enviou este e-mail
                                    to: TODOS_CS_CONSULTING, // Quem receberá (todos@certsys.com.br)
                                    subject: data.mail.subject,  // Um assunto
                                    html: data.mail.html, // O conteúdo do e-mail
                                    attachments: data.mail.attachments
                                };
                                var agendamentoCsConsulting = schedule.scheduleJob(date, function () {
                                    transporterCsConsulting.sendMail(emailCSConsulting, function (err, info) {
                                        if (err)
                                            console.error(err);
                                    });
                                });

                                postingCsConsulting[indice] = updatedPost;
                                mailsCsConsulting[indice].cancel();
                                mailsCsConsulting[indice] = agendamentoCsConsulting;

                            }
                        });
                    }
                });

                res.json({
                    status: true,
                    mail: true
                });


            } else {

                if (indice > -1) {
                    mailsCs[indice].cancel();
                    mailsCsConsulting[indice].cancel();
                }

                res.json({
                    status: true
                });
            }
        } else res.json({status: true});
    });
});

module.exports = router;