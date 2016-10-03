var mongoose = require('mongoose');

var kbSchema = new mongoose.Schema({
    parent : Object, //id do pai
    text : String, //Nome que aparecerá
    type: String, //[folder, page, file]
    children: Array //recebe todos os filhos deste produto.
});

var kbtree = mongoose.model('kbtree', kbSchema);

module.exports = kbtree;
//module.exports = kbContent;

// Exemplos kbTree
// {
//     parent : null, //pasta onde ficará
//     text : 'Produtos', //Nome que aparecerá
//     type: 'folder', //[folder, page, file]
// }

// {
// 	parent:'produtos'
// 	text:'IBM'
// 	type:'folder'
// }

// {
// 	parent:'IBM'
// 	text:'IBM'
// 	type:'folder'
// }


