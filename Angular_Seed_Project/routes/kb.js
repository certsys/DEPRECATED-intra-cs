var express = require('express');
var router = express.Router();
var kbtree = require('../models/kb');


router.use(function (req, res, next) {
    global.verificaToken(req, res, next)
});

// router.get('/set', function(req, res){
//     KB.findOne({ 'text': 'Certsys' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
//  })
//
// })

var rootFolderId;

router.get('/', function (req, res) {
    var array_montado
    kbtree.find({text:"Produtos"}, function (err, folders) {
        if (err) return console.error(err);
        //console.log(folders[0]._id)
        rootFolderId=folders[0]._id
        kbtree.find({parent: rootFolderId}, function(err,lvl1){
            res.json(lvl1);
        })
    })

    // res.download('util/fotos.csv');
    // res.json(folders[0]._id);
});




router.get('/get_folders', function (req, res) {
    // get folders from mongo;
    kbtree.find({}, function (err, folders) {
        if (err) return console.error(err);
        res.json(folders);
    })
});


router.get('/get_folders', function (req, res) {
    // get folders from mongo;
    kbtree.find({}, function (err, folders) {
        if (err) return console.error(err);
        for (i=0; i<folders.length; i++){
                if (folders[i].text=='Produto' && !rootFolderId) rootFolderId=folder[i]._id
            }
        res.json(folders);
    })
});


router.post('/', function (req, res) {
    console.log(req.body.id);
    var file = 'kb/' + req.body.id;
    res.download(file);
    // res.json(file);
});

router.post('/ins_folder', function (req, res) {
    var newTreeNode = new kbtree({
        parent : req.body.parent, //id do pai
        text : req.body.text, //Nome que aparecerá
        type: req.body.type, //[folder, page, file]
        children: req.body.children //recebe todos os filhos deste produto.
    });
    newTreeNode.save(function (err) {
        if (err) throw err;
    });
    res.json('Success')
});

router.post('/ins_page', function (req, res) {
    var newKbTree = new kbtree({
        titulo: req.body.titulo,
        imagem: req.body.imagem,
        texto: req.body.texto,
        assinatura: req.body.assinatura,
        editions: [],
        data: req.body.data
    });

    newKbTree.save(function (err) {
        if (err) throw err;
    });
});

router.post('/ins_file', function (req, res) {
    var newKbTree = new kbtree({
        titulo: req.body.titulo,
        imagem: req.body.imagem,
        texto: req.body.texto,
        assinatura: req.body.assinatura,
        editions: [],
        data: req.body.data
    });

    newKbTree.save(function (err) {
        if (err) throw err;
    });
});

module.exports = router;

