var mongoose = require('mongoose');

var cursoSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    local: String,
    data_inicio: Date,
    data_fim: Date,
    data_limite_inscricao: Date,
    min_inscritos: Number,
    max_inscritos: Number,
    created_by: String,
    instrutor: Object,
    carga_horaria: Number,
    data_criacao: {type: Date, default: Date.now},
    inscritos: [], //of objects
    arquivos: [],
    tags: [],
    isDeleted: {type: Boolean, default: false}
});

var Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;

module.exports.getAllCourses = function (req, res) {
    Curso.find(function (err, cursos) {
        if (err) return console.error(err);
        res.json(cursos);
    })
};

module.exports.insertNewCourse = function (req, res) {
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
};

module.exports.editCourse = function (req, res) {
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
};

module.exports.addSubscriberToCourse = function (req, res) {
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
};

module.exports.removeSubscriberFromCourse = function (req, res) {
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
};

module.exports.changeSubscribersPresence = function (req, res) {
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
};

module.exports.removeCourse = function (req, res) {
    Curso.findById(req.params.id, function (err, data) { //Soft delete
        data.isDeleted = true;
        data.save(function (err, data) {
            if (err) {
                console.log(err);
            }
            res.json({data: 'Curso deletado com successo!'});
        });
    });
};
