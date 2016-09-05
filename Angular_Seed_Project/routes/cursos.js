var express = require('express');
var router = express.Router();
var Curso = require('../models/cursos');
var fs = require('fs');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();


// router.use(function (req, res, next) {
//     global.verificaToken(req, res, next)
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

router.put('/mudaPresenca/:id', function (req, res, next) {

    Curso.findById(req.params.id, function (err, data) {
        var index = data.inscritos.map(function (inscrito) {
            return inscrito.sAMAccountName;
        }).indexOf(req.body.sAMAccountName);

        if (index > -1) {
            data.inscritos.splice(index, 1);
            var dados = {
                _id: req.body._id,
                sAMAccountName: req.body.sAMAccountName,
                data_inscricao: req.body.data_inscricao,
                presente: req.body.presente
            };
            data.inscritos.push(dados);
            data.save(function (err, data) {
                if (err) throw err;
                res.json({data: 'Pessoa mudou a presenca com successo!'});
            });
        }
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
    var originalFilename = req.files.files.originalFilename;
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
                console.log(model);
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