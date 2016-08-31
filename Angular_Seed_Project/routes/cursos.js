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

// Pega todos os cursos
router.get('/', function (req, res) {
    Curso.find(function (err, cursos) {
        if (err) return console.error(err);
        res.json(cursos);
    })
});


// Recebe um JSON e insere no banco de dados, para cadastrar novo curso
router.post('/', function (req, res) {

    var newCurso = new Curso({
        nome: req.body.nome,
        descricao: req.body.descricao,
        local: req.body.local,
        data_inicio: req.body.data_inicio,
        data_fim: req.body.data_fim,
        data_limite_inscricao: req.body.data_limite_inscricao,
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

    console.log(req.body.data_limite_inscricao);
    Curso.findById(req.params.id, function (err, data) {
        data.nome = req.body.nome;
        data.descricao = req.body.descricao;
        data.local = req.body.local;
        data.data_inicio = req.body.data_inicio;
        data.data_fim = req.body.data_fim;
        data.data_limite_inscricao = req.body.data_limite_inscricao;
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
        var index = data.inscritos.map(function (inscrito) {
            return inscrito.sAMAccountName;
        }).indexOf(req.body.sAMAccountName);
        
        if (index === -1) {
            var dados = {
                _id: req.body._id,
                sAMAccountName: req.body.sAMAccountName,
                data_inscricao: req.body.data_inscricao,
                presente: req.body.presente
            };
            data.inscritos.push(dados);
            data.save(function (err, data) {
                if (err) throw err;
                res.json({data: 'Pessoa inscrita com successo!'});
            });
        }
    });

});

router.put('/removeSubscription/:id', function (req, res, next) {

    Curso.findById(req.params.id, function (err, data) {
        var index = data.inscritos.map(function (inscrito) {
        return inscrito.sAMAccountName;
    }).indexOf(req.body.sAMAccountName);
        if (index > -1) data.inscritos.splice(index, 1);
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


module.exports = router;