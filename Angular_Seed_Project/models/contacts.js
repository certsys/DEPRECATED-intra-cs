var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    nome: String,
    sobre: String,
    grupo: [],
    tooltable: Object,
    mail: String,
    telefone: String,
    skype: String,
    linkedin: String,
    imagem: String,
    cargo: String,
    datanasc: String
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

module.exports.getPerfil = function (req, res) {
    var mail = req.param("mail");
    if (mail !== "") {
        var query = Contact.where({mail: new RegExp(mail, 'ig')});
        query.find(function (err, data) {
            if (err) return console.error(err);
            res.json(data);
        })
    }
    else res.json(null);
};

module.exports.getInscritos = function (req, res) {
    var inscritos = req.body;
    if (inscritos.length >= 1) {
        var mails = [];
        inscritos.forEach(function (inscrito) {
            mails.push(new RegExp(inscrito.sAMAccountName, 'ig'));                  //find the subscribers' emails
        });
        if (mails.length) {
            Contact.find().where('mail').in(mails).exec(function (err, contacts) {  //find the contacts with the listed emails above inside the database
                res.json(contacts);
            });
        }
        else
            res.json(null);
    } else {
        res.json(null);
    }
};

module.exports.getAll = function (req, res) {
    var search = req.param("inputed");
    if (search) {
        var query = Contact.where({$or: [{'tooltable.tools_basic': new RegExp(search, 'i')}, {'tooltable.tools_intermediate': new RegExp(search, 'i')}, {'tooltable.tools_advanced': new RegExp(search, 'i')}]})
        query.find(function (err, contacts) {
            if (err) return console.error(err);
            res.json(contacts);
        })
    }
    else {
        Contact.find(function (err, contacts) {
            if (err) return console.error(err);
            res.json(contacts);
        })
    }
};

module.exports.insertNewContact = function (req, res) {
    var newContact = new Contact({
        nome: req.body.nome,
        sobre: req.body.sobre,
        grupo: req.body.grupo,
        tooltable: req.body.tooltable,
        mail: req.body.mail,
        telefone: req.body.phone,
        skype: req.body.skype,
        linkedin: req.body.linkedin,
        imagem: req.body.imagem,
        datanasc: req.body.datanasc
    });


    newContact.save(function (err) {
        if (err) throw err;
        res.json({data: 'Contato salvo com successo!'});
    });
};

module.exports.editContact = function (req, res,next) {
    var mail = req.param("mail");
    var query = Contact.where({mail: new RegExp(mail, 'ig')});

    query.findOne(function (err, data) {
        data.sobre = req.body.sobre;
        data.tooltable = req.body.tooltable;
        data.telefone = req.body.telefone;
        data.skype = req.body.skype;
        data.linkedin = req.body.linkedin;
        data.datanasc = req.body.datanasc;
        if (req.body.imagem != null && req.body.imagem !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFIklEQVR4Xu3VsRHAMAzEsHj/pTOBXbB9pFchyLycz0eAwFXgsCFA4C4gEK+DwENAIJ4HAYF4AwSagD9IczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhH4AStUAMmSuOW2AAAAAElFTkSuQmCC")
            data.imagem = req.body.imagem;
        data.save(function (err, data) {
            if (err) {
                return next(err);
            }
            res.status(201).json(data);
        });

    });
};

