var fs = require('fs');
var Curso = require('../../../models/cursos');
var Kb = require('../../../models/kbcontent');

exports.uploadFileToPath = function (req, res, path) {
    var originalFilename = req.files.files.originalFilename;
    fs.readFile(req.files.files.path, function (err, data) {
        var newPath = __dirname.substring(0, __dirname.indexOf("routes")) + "uploads/" + path + "/" + originalFilename;
        fs.writeFile(newPath, data, function (err) {
        });
        res.json(originalFilename)
    });
};


exports.saveFileOnDB = function (req, res, path) {
    var id = req.body._id;
    if(path === "cursos") {
        Curso.findByIdAndUpdate(id, {$push: {arquivos: req.body.originalFilename}},
            {safe: true, upsert: true, new: true},
            function (err, model) {
                if (err) console.log(err);
                else {
                    console.log(model);
                    res.json({success: true})
                }
            });
    } else {
        // KB
    }
};

exports.downloadFile = function (req, res, path) {
    var file = 'uploads/' + path + '/' + req.body.filename;
    res.download(file);
};
