/**
 * Created by marcos on 24/11/16.
 */
var mongoose = require('mongoose');

var vagaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    local: {
        type: String,
        required: false
    },
    data_inicio: {
        type: Date,
        required: true
    },
    data_fim: {
        type: Date,
        required: true
    },
    data_limite_inscricao: {
        type: Date,
        required: true
    },
    min_inscritos: {
        type: Number,
        required: true
    },
    max_inscritos: Number,
    created_by: String,
    carga_horaria: Number,
    data_criacao: {
        type: Date,
        default: Date.now
    },
    inscritos: [], //of objects
    arquivos: [],
    tags: [],
    isDeleted: {type: Boolean, default: false}
});

var Vaga = mongoose.model('Vaga', vagaSchema);

module.exports = Vaga;

module.exports.getAllJobs = function (req, res) {
    Vaga.find(function (err, cursos) {
        if (err) return console.error(err);
        res.json(cursos);
    })
};

module.exports.insertNewJob = function (req, res) {
    console.log(req.body)
    var newVaga = new Vaga({
        nome: req.body.nome,
        descricao: req.body.descricao,
        local: req.body.local,
        data_inicio: req.body.data_inicio,
        data_fim: req.body.data_fim,
        data_limite_inscricao: req.body.data_limite_inscricao,
        min_inscritos: req.body.min_inscritos,
        max_inscritos: req.body.max_inscritos,
        created_by: req.body.created_by,
        carga_horaria: req.body.carga_horaria
    });


    newVaga.save(function (err) {
        if (err) throw err;
        res.json({data: 'Vaga salva com successo!'});
    });
};

module.exports.editJob = function (req, res) {
    Vaga.findById(req.params.id, function (err, data) {
        data.nome = req.body.nome;
        data.descricao = req.body.descricao;
        data.local = req.body.local;
        data.data_inicio = req.body.data_inicio;
        data.data_fim = req.body.data_fim;
        data.data_limite_inscricao = req.body.data_limite_inscricao;
        data.min_inscritos = req.body.min_inscritos;
        data.max_inscritos = req.body.max_inscritos;
        data.created_by = req.body.created_by;
        data.carga_horaria = req.body.carga_horaria;
        data.isDeleted = false;
        data.save(function (err, data) {
            if (err) throw err;
            res.json({data: 'Vaga editada com successo!'});
        });
    });
};

module.exports.addSubscriberToJob = function (req, res) {
    Vaga.findById(req.params.id, function (err, data) {
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

module.exports.removeSubscriberFromJob = function (req, res) {
    Vaga.findById(req.params.id, function (err, data) {
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
    Vaga.findById(req.params.id, function (err, data) {
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

module.exports.removeJob = function (req, res) {
    Vaga.findById(req.params.id, function (err, data) { //Soft delete
        data.isDeleted = true;
        data.save(function (err, data) {
            if (err) {
                console.log(err);
            }
            res.json({data: 'Vaga deletado com successo!'});
        });
    });
};
