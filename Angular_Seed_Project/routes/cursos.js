var express = require('express');
var router = express.Router();
var Curso = require('../models/cursos');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var multiparty = require('connect-multiparty')
var multipartMiddleware = multiparty();


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

// Pega todos os cursos
router.get('/', function (req, res) {
    Curso.find(function (err, cursos) {
        if (err) return console.error(err);
        res.json(cursos);
    })
});


// Recebe um JSON e insere no banco de dados, para cadastrar novo curso
router.post('/', function (req, res) {

    var curso_inicio = req.body.data_inicio;

    var ano_curso_inicio = curso_inicio.substring(0, 4);
    var mes_curso_inicio = curso_inicio.substring(4, 6);
    var dia_curso_inicio = curso_inicio.substring(6, 8);
    var hora_curso_inicio = curso_inicio.substring(8, 10);
    var minuto_curso_inicio = curso_inicio.substring(10, 12);


    var curso_fim = req.body.data_fim;

    var ano_curso_fim = curso_fim.substring(0, 4);
    var mes_curso_fim = curso_fim.substring(4, 6);
    var dia_curso_fim = curso_fim.substring(6, 8);
    var hora_curso_fim = curso_fim.substring(8, 10);
    var minuto_curso_fim = curso_fim.substring(10, 12);



    var encerramento = req.body.data_limite_inscricao;

    var ano_enc = encerramento.substring(0, 4);
    var mes_enc = encerramento.substring(4, 6);
    var dia_enc = encerramento.substring(6, 8);
    var hora_enc = encerramento.substring(8, 10);
    var minuto_enc = encerramento.substring(10, 12);



    var date_curso_inicio = new Date(ano_curso_inicio, mes_curso_inicio-1, dia_curso_inicio, hora_curso_inicio, minuto_curso_inicio);
    var date_curso_fim = new Date(ano_curso_fim, mes_curso_fim-1, dia_curso_fim, hora_curso_fim, minuto_curso_fim);
    var date_encerramento = new Date(ano_enc, mes_enc-1, dia_enc, hora_enc, minuto_enc);

    var newCurso = new Curso({
        nome: req.body.nome,
        descricao: req.body.descricao,
        data_inicio: date_curso_inicio,
        data_fim: date_curso_fim,
        data_limite_inscricao: date_encerramento,
        min_inscritos: req.body.min_inscritos,
        max_inscritos: req.body.max_inscritos,
        created_by: req.body.created_by,
        instrutor: req.body.instrutor,
        carga_horaria: req.body.carga_horaria
    });


    newCurso.save(function (err) {
        if (err) throw err;
        res.json({data: 'Curso salvo com successo!'});
    });
});

router.put('/edit/:id', function (req, res, next) {


    var curso_inicio = req.body.data_inicio;

    var ano_curso_inicio = curso_inicio.substring(0, 4);
    var mes_curso_inicio = curso_inicio.substring(4, 6);
    var dia_curso_inicio = curso_inicio.substring(6, 8);
    var hora_curso_inicio = curso_inicio.substring(8, 10);
    var minuto_curso_inicio = curso_inicio.substring(10, 12);


    var curso_fim = req.body.data_fim;

    var ano_curso_fim = curso_fim.substring(0, 4);
    var mes_curso_fim = curso_fim.substring(4, 6);
    var dia_curso_fim = curso_fim.substring(6, 8);
    var hora_curso_fim = curso_fim.substring(8, 10);
    var minuto_curso_fim = curso_fim.substring(10, 12);



    var encerramento = req.body.data_limite_inscricao;

    var ano_enc = encerramento.substring(0, 4);
    var mes_enc = encerramento.substring(4, 6);
    var dia_enc = encerramento.substring(6, 8);
    var hora_enc = encerramento.substring(8, 10);
    var minuto_enc = encerramento.substring(10, 12);



    var date_curso_inicio = new Date(ano_curso_inicio, mes_curso_inicio-1, dia_curso_inicio, hora_curso_inicio, minuto_curso_inicio);
    var date_curso_fim = new Date(ano_curso_fim, mes_curso_fim-1, dia_curso_fim, hora_curso_fim, minuto_curso_fim);
    var date_encerramento = new Date(ano_enc, mes_enc-1, dia_enc, hora_enc, minuto_enc);

    Curso.findById(req.params.id, function (err, data) {
        data.nome = req.body.nome;
        data.descricao = req.body.descricao;
        data.data_inicio = date_curso_inicio;
        data.data_fim = date_curso_fim;
        data.data_limite_inscricao = date_encerramento;
        data.min_inscritos = req.body.min_inscritos;
        data.max_inscritos = req.body.max_inscritos;
        data.created_by = req.body.created_by;
        data.instrutor = req.body.instrutor;
        data.carga_horaria = req.body.carga_horaria;
        data.isDeleted = false;
        data.save(function (err, data) {
            if (err) throw err;
                res.json({data: 'Curso editado com successo!'});
        });
    });


});

router.put('/addSubscription/:id', function (req, res, next) {

    Curso.findById(req.params.id, function (err, data) {
        data.inscritos.push(req.body.sAMAccountName);
        data.save(function (err, data) {
            if (err) throw err;
            res.json({data: 'Pessoa inscrita com successo!'});
        });
    });

});

router.put('/removeSubscription/:id', function (req, res, next) {

    Curso.findById(req.params.id, function (err, data) {
        var index = data.inscritos.indexOf(req.body.sAMAccountName);
        if(index > -1) data.inscritos.splice(index, 1);
        data.save(function (err, data) {
            if (err) throw err;
            res.json({data: 'Pessoa removida com successo!'});
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

router.post('/uploadfile', multipartMiddleware, function(req, res){
    //console.log(req.body)
    var originalFilename = req.files.files.originalFilename
    // console.log(req.files.files.originalFilename)
    fs.readFile(req.files.files.path, function (err, data) {
  // ...
          var newPath = __dirname.substring(0, __dirname.indexOf("routes"))+"uploads/cursos/"+originalFilename;
          fs.writeFile(newPath, data, function (err) {
            //res.redirect("back");
        });
          res.json(originalFilename)
    });
})

router.post('/uploadfile2', function(req, res){
    var cursoId=req.body._id;
    Curso.findByIdAndUpdate(cursoId, {$push: {arquivos: req.body.originalFilename}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if (err) console.log(err);
            else {
                console.log(model)
                res.json({success: true})
                }
        });

})

router.post('/download', function (req, res) {
    console.log(req.body.filename);
    var file = 'uploads/cursos/' + req.body.filename;
    res.download(file);
    // res.json(file);
});

module.exports = router;