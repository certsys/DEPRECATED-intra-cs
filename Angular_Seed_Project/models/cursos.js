var mongoose = require('mongoose');

var cursoSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    data_curso: {type: Date},
    data_enc_insc: {type: Date},
    carga_horaria: Number,
    minimo: Number,
    maximo: Number,
    isDeleted: Boolean
});

var Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;
