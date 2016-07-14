var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    titulo: String,
    imagem: String,
    texto: String,
    assinatura: String,     // TODO: Referenciar para um id posteriormente (ObjectId)
    data: {type: Date, default: Date.now}
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;

// //utility functions
// var Post = mongoose.model('Post');
// exports.findByUsername = function(userName, callback){
//
//     User.findOne({ user_name: userName}, function(err, user){
//
//         if(err){
//             return callback(err);
//         }
//
//         //success
//         return callback(null, user);
//     });
//
// }
//
// exports.findById = function(id, callback){
//
//     User.findById(id, function(err, user){
//
//         if(err){
//             return callback(err);
//         }
//
//         return callback(null, user);
//     });
// }