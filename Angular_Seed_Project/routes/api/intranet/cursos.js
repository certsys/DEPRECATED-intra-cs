var express = require('express');
var router = express.Router();
var Curso = require('../../../models/cursos');
var Auth = require('../authentication/auth');
var Upload = require('./upload');
var Debug = require('../../debug');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();

if (!Debug.isDebug()) {
    router.use(Auth.auth);
}

// Pega todos os cursos
router.get('/', Curso.getAllCourses);

// Recebe um JSON e insere no banco de dados, para cadastrar novo curso
router.post('/', Curso.insertNewCourse);

// Edita um curso específico
router.put('/edit/:id', Curso.editCourse);

// Adiciona um inscrito a um curso específico
router.put('/addSubscription/:id', Curso.addSubscriberToCourse);

// Remove um inscrito de um curso específico
router.put('/removeSubscription/:id', Curso.removeSubscriberFromCourse);

// Muda a presença de um inscrito
router.put('/mudaPresenca/:id', Curso.changeSubscribersPresence);

// Remove um curso específico
router.delete('/remove/:id', Curso.removeCourse);

// Salva arquivo na pasta uploads/cursos/
router.post('/uploadfile', multipartMiddleware, function (req, res) {
    Upload.uploadFileToPath(req, res, 'cursos');
});

// Salva a informação no Banco de Dados
router.post('/uploadfile2', multipartMiddleware, function (req, res) {
    Upload.saveFileOnDB(req, res, 'cursos');
});

// Faz download do arquivo
router.post('/download', function (req, res) {
    Upload.downloadFile(req, res, 'cursos');
});

module.exports = router;