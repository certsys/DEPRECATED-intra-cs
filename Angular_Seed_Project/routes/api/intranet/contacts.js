var express = require('express');
var router = express.Router();
var Contact = require('../../../models/contacts');
var Auth = require('../authentication/auth');
var Debug = require('../../debug');
var ActiveDirectory = require('../maintenance/activeDirectory');

var ad = ActiveDirectory.getActiveDirectory();
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

if (!Debug.isDebug()) {
    router.use(Auth.auth);
}

// Pega usuário pelo email
router.get('/perfil', Contact.getPerfil);

//Pega os inscritos de um curso
router.post('/inscritos', Contact.getInscritos);

// Pega todos os contatos
router.get('/', Contact.getAll);

// Recebe um JSON e insere no banco de dados, para cadastrar novo contato
router.post('/', Contact.insertNewContact);

// Edita contato
router.put('/edit', Contact.editContact);

module.exports = router;