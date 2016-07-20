var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    nome: String,
    ferramenta_principal: String,
    ferramentas: String,
    mail: String,
    telefone: String,
    skype: String,
    imagem: String
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

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