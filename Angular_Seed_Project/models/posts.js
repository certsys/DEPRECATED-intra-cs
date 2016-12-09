var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    titulo: String,
    imagem: String,
    texto: String,
    assinatura: String,
    data: {type: Date, default: Date.now},
    editions: [],
    mail: Object,
    isDeleted: {type: Boolean, default: false}
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;