var mongoose = require('mongoose');

var kbSchemaContent = new mongoose.Schema({
    parent : Object, //parent_id
    title: String,
    text: String, //intro
    createdBy: String, //assinatura do criador
    versions: Array, //array de objetos -> versao = {version: "1.0.2", title:, text:}
    editions: Array, //array de objetos de quem e quando fez alteraçoes
    files: Array, //array de objetos -> arquivo = {filename: string, }
    data: String,
    type: String,
    tags: Array
});

var kbContent = mongoose.model('kbContent', kbSchemaContent);

module.exports = kbContent;