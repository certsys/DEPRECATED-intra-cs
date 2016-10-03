var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs');
var Contact = require('../models/contacts');
var ActiveDirectory = require('activedirectory');

var config = {
    url: 'ldap://192.168.129.2:389',
    baseDN: 'OU=Certsys,DC=certsys,DC=local',
    username: 'svc_intranet@certsys.local',
    password: 'dAgAcupU6rA='
};

var ad = new ActiveDirectory(config);
// var username = 'pedro.strabeli@certsys.com.br';
var username = 'svc_intranet@certsys.local';
// var password = 'password';
var password = 'dAgAcupU6rA=';
var groupName = 'Certsys';

/* PUT users listing. */
router.put('/', function (req, res, next) {
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            users.forEach(function (user) {
                var sAMAccountName = user.sAMAccountName;
                var final = [];
                var extra_groups = user.dn.split(",");

                ad.getGroupMembershipForUser(sAMAccountName, function (err, groups) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        return;
                    }

                    if (!groups) console.log('User: ' + sAMAccountName + ' not found.');
                    else {
                        extra_groups.forEach(function (extra) {
                            extra = (extra.split("="))[1];
                            if (extra != null && final.indexOf(extra) == -1) final.push(extra);
                        });

                        groups.forEach(function (group) {
                            var group_cn = group.cn.split(",");
                            var group_dn = group.dn.split(",");

                            group_cn.forEach(function (element) {
                                element = (element.split("="))[1];
                                if (element != null && final.indexOf(element) == -1) final.push(element);
                            });

                            group_dn.forEach(function (element) {
                                element = (element.split("="))[1];
                                if (element != null && final.indexOf(element) == -1) final.push(element);
                            });

                        });
                        Contact.findOne({nome: user.cn}, function (err, data) {
                            if (err) return err;
                            else if (user.sAMAccountName === "marco.villa.adm") {
                            }
                            else if (final.indexOf("Ex-Funcionarios") < 0 && data == null) {
                                if (user.mail != undefined && user.mail.indexOf("@") < 0)
                                    email = user.mail + "@certsys.com.br";
                                else email = user.mail;
                                var newContact = new Contact({
                                    nome: user.cn,
                                    sobre: "",
                                    grupo: final,
                                    tooltable: {},
                                    mail: user.mail,
                                    telefone: "",
                                    skype: "",
                                    linkedin: "https://www.linkedin.com/in/",
                                    imagem: ""
                                });

                                newContact.save(function (err) {
                                    if (err) return err;
                                });
                            }
                            else if (data != null) {
                                if (final.indexOf("Ex-Funcionarios") > -1) {
                                    data.remove(function (err, data) {
                                        if (err) return next(err);
                                    });
                                }
                                else {
                                    if (user.mail != undefined && user.mail.indexOf("@") < 0)
                                        email = user.mail + "@certsys.com.br";
                                    else email = user.mail;
                                    if (data.mail == undefined) {
                                        data.mail = user.sAMAccountName + "@certsys.com.br"
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                    else if (user.mail != undefined && data.mail !== email) {
                                        data.mail = email;
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                    var is_same = (data.grupo.length == final.length) && data.grupo.every(function (element, index) {
                                            return element === final[index];
                                        });
                                    if (!is_same) {
                                        data.grupo = final;
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                    if (data.linkedin === "") {
                                        data.linkedin = "https://www.linkedin.com/in/";
                                        data.save(function (err, data) {
                                            if (err) return next(err);
                                            // res.status(201).json(data);
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            });
            res.json(null);
        }
    });
});

router.use(function (req, res, next) {
    global.verificaToken(req, res, next)
});

// Pega usuário pelo email
router.get('/perfil', function (req, res) {
    var mail = req.param("mail");
    if (mail !== "") {
        var query = Contact.where({mail: new RegExp(mail, 'ig')});
        query.find(function (err, data) {
            if (err) return console.error(err);
            res.json(data);
        })
    }
    else res.json(null);
});

//Pega os inscritos de um curso
router.post('/inscritos', function (req, res) {
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

});

// Pega todos os contatos
router.get('/', function (req, res) {
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
});


// Recebe um JSON e insere no banco de dados, para cadastrar novo contato
router.post('/', function (req, res) {
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
});

router.put('/edit', function (req, res, next) {

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
});

module.exports = router;