var express = require('express');
var router = express.Router();
var Curso = require('../models/cursos');
var jwt = require('jsonwebtoken');

// router.use(function (req, res, next) {
//
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//
//     // decode token
//     if (token) {
//
//         // verifies secret and checks exp
//         jwt.verify(token, 'Cert0104sys', function (err, decoded) {
//             if (err) {
//                 return res.status(403).send({
//                     success: false,
//                     message: 'Falha de autenticação do Token'
//                 });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//
//     } else {
//
//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//
//     }
//
// });

// Pega todos os contatos
router.get('/', function (req, res) {
    Curso.find(function (err, cursos) {
        if (err) return console.error(err);
        res.json(cursos);
    })

});


// Recebe um JSON e insere no banco de dados, para cadastrar novo contato
router.post('/', function (req, res) {

    var curso = req.body.data_curso;

    var ano_curso = curso.substring(0, 4);
    var mes_curso = curso.substring(4, 6);
    var dia_curso = curso.substring(6, 8);
    var hora_curso = curso.substring(8, 10);
    var minuto_curso = curso.substring(10, 12);



    var encerramento = req.body.data_enc_insc;

    var ano_enc = encerramento.substring(0, 4);
    var mes_enc = encerramento.substring(4, 6);
    var dia_enc = encerramento.substring(6, 8);
    var hora_enc = encerramento.substring(8, 10);
    var minuto_enc = encerramento.substring(10, 12);



    var date_curso = new Date(ano_curso, mes_curso-1, dia_curso, hora_curso, minuto_curso);
    var date_encerramento = new Date(ano_enc, mes_enc-1, dia_enc, hora_enc, minuto_enc);

    var newCurso = new Curso({
        nome: req.body.nome,
        descricao: req.body.descricao,
        data_curso: date_curso,
        data_enc_insc: date_encerramento,
        carga_horaria: req.body.carga_horaria,
        minimo: req.body.minimo,
        maximo: req.body.maximo,
        isDeleted: false
    });


    newCurso.save(function (err) {
        if (err) throw err;
        res.json({data: 'Curso salvo com successo!'});
    });
});

router.put('/edit/:id', function (req, res, next) {


    var curso = req.body.data_curso;

    var ano_curso = curso.substring(0, 4);
    var mes_curso = curso.substring(4, 6);
    var dia_curso = curso.substring(6, 8);
    var hora_curso = curso.substring(8, 10);
    var minuto_curso = curso.substring(10, 12);



    var encerramento = req.body.data_enc_insc;

    var ano_enc = encerramento.substring(0, 4);
    var mes_enc = encerramento.substring(4, 6);
    var dia_enc = encerramento.substring(6, 8);
    var hora_enc = encerramento.substring(8, 10);
    var minuto_enc = encerramento.substring(10, 12);



    var date_curso = new Date(ano_curso, mes_curso-1, dia_curso, hora_curso, minuto_curso);
    var date_encerramento = new Date(ano_enc, mes_enc-1, dia_enc, hora_enc, minuto_enc);

    Curso.findById(req.params.id, function (err, data) {

        data.nome = req.body.nome;
        data.descricao = req.body.descricao;
        data.data_curso = date_curso;
        data.data_enc_insc = date_encerramento;
        data.carga_horaria = req.body.carga_horaria;
        data.minimo = req.body.minimo;
        data.maximo = req.body.maximo;
        data.isDeleted = false;
        data.save(function (err, data) {
            if (err) throw err;
                res.json({data: 'Curso editado com successo!'});
        });
    });


});

router.delete('/remove/:id', function (req, res) {
    Curso.findById(req.params.id, function (err, data) { //Soft delete
        data.isDeleted = true;
        data.save(function (err, data) {
            if (err) {
                console.log(err);
            }
            res.json({data: 'Curso deletado com successo!'});
        });
    });
});


module.exports = router;