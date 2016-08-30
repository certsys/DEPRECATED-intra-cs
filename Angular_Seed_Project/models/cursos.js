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
    instrutor: String,
    carga_horaria: Number,
    data_criacao: {type: Date, default: Date.now},
    inscritos: [], //of objects
    arquivos: [],
    tags: [],
    isDeleted: {type: Boolean, default: false}
});

var Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;
