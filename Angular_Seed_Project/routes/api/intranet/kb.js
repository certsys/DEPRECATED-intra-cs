var express = require('express');
var router = express.Router();
var kbtree = require('../../../models/kbtree');
var kbcontent = require('../../../models/kbcontent');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var Auth = require('../authentication/auth');
var Debug = require('../../debug');

if (!Debug.isDebug()) {
    router.use(Auth.auth);
}
// router.get('/set', function(req, res){
//     KB.findOne({ 'text': 'Certsys' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
//  })

// })

var rootFolderId;

router.get('/', function (req, res) {
    var array_montado
    kbtree.find({text:"Produtos"}, function (err, folders) {
        if (err) return console.error(err);
        //console.log(folders[0]._id)
        rootFolderId=folders[0]._id
        //console.log(folders[0]._id)
        kbtree.find({parent: folders[0]._id.toString()}, function(err,lvl1){
            //console.log(lvl1)
            // for (i=0; i<lvl1.length; i++){
            //     kbtree.find({parent: lvl1[i]._id.toString()}, function(err,lvl2){
            //         if(lvl2.length>0) {
            //             console.log(lvl1[i])
            //             for(j=0; j<lvl2.length; j++) lvl1[i].children.push(lvl2[j]);
            //         }
            //     })
            // }
            res.json(lvl1);
        })
    })
});



router.get('/get_folders', function (req, res) {
    // get folders from mongo;
    kbtree.find({text:"Produtos"}, function (err, produtos) {
        if (err) return console.error(err);
        // console.log(produtos)
        rootFolderId=produtos[0]._id
        kbtree.find({}, function (err, folders) {
        if (err) return console.error(err);
        // for (i=0; i<folders.length; i++){
        //         if (folders[i].text=='Produto' && !rootFolderId) rootFolderId=folder[i]._id
        //     }
        res.json(folders);
        })
    })
});


router.get('/get_pages', function (req, res) {
    // get pages from mongo;
        kbcontent.find({}, function (err, pages) {
        if (err) return console.error(err);
        res.json(pages);
    })
});

router.get('/pages:id_parent', function (req, res) {
    // get pages from mongo;
    console.log(req.params.id_parent)
        kbcontent.find({parent: req.params.id_parent}, function (err, pages) {
        if (err) return console.error(err);
        console.log(pages)
        res.json(pages);
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
    console.log(newTreeNode);
    //push to array if nested.
    // kbtree.find()
    if (newTreeNode.parent == rootFolderId){
        newTreeNode.save(function (err) {
            if (err) throw err;
        });
        res.json('Success')
    } else{
        kbtree.findByIdAndUpdate(newTreeNode.parent, {$push: {children: newTreeNode}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if (err) console.log(err);
            else {
                console.log(model)
                res.json({success: true})
                }
        });
    }
});

router.post('/ins_page', function (req, res) {
    console.log('vamo bota pra fude');
    var newKbContent = new kbcontent({
        title: req.body.title,
        parent: req.body.parent,
        text: req.body.text,
        createdBy: req.body.assinatura,
        files:[],
        editions: [],
        versions: [],
        tags: req.body.tags,
        data: req.body.data,
        type: 'page'
    });
    console.log(newKbContent)

    newKbContent.save(function (err) {
        if (err) throw err;
    });
    res.json({success:true})
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

router.post('/uploadfile', multipartMiddleware, function(req, res){
    //console.log(req.body)
    var originalFilename = req.files.files.originalFilename
    // console.log(req.files.files.originalFilename)
    fs.readFile(req.files.files.path, function (err, data) {
  // ...
          var newPath = __dirname.substring(0, __dirname.indexOf("routes"))+"uploads/kb/"+originalFilename;
          fs.writeFile(newPath, data, function (err) {
            //res.redirect("back");
        });
          res.json(originalFilename)
    });
})

router.post('/uploadfile2', function(req, res){
    var cursoId=req.body._id;
    Curso.findByIdAndUpdate(cursoId, {$push: {arquivos: req.body.originalFilename}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if (err) console.log(err);
            else {
                console.log(model)
                res.json({success: true})
                }
        });

})

router.post('/download', function (req, res) {
    console.log(req.body.filename);
    var file = 'uploads/kb/' + req.body.filename;
    res.download(file);
    // res.json(file);
});

module.exports = router;

