/**
 * Created by marcos on 24/11/16.
 */
var express = require('express');
var router = express.Router();
var Vaga = require('../../../models/vagas');
var Auth = require('../authentication/auth');
var Upload = require('./upload');
var Debug = require('../../debug');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();

if (!Debug.isDebug()) {
    router.use(Auth.auth);
}

// Pega todos os Vagas
router.get('/', Vaga.getAllJobs);

// Recebe um JSON e insere no banco de dados, para cadastrar novo Vaga
router.post('/', Vaga.insertNewJob);

// Edita um Vaga específico
router.put('/edit/:id', Vaga.editJob);

// Adiciona um inscrito a um Vaga específico
router.put('/addSubscription/:id', Vaga.addSubscriberToJob);

// Remove um inscrito de um Vaga específico
router.put('/removeSubscription/:id', Vaga.removeSubscriberFromJob);

// Muda a presença de um inscrito
router.put('/mudaPresenca/:id', Vaga.changeSubscribersPresence);

// Remove um Vaga específico
router.delete('/remove/:id', Vaga.removeJob);

// Salva arquivo na pasta uploads/Vagas/
router.post('/uploadfile', multipartMiddleware, function (req, res) {
    Upload.uploadFileToPath(req, res, 'vagas');
});

// Salva a informação no Banco de Dados
router.post('/uploadfile2', multipartMiddleware, function (req, res) {
    Upload.saveFileOnDB(req, res, 'vagas');
});

// Faz download do arquivo
router.post('/download', function (req, res) {
    Upload.downloadFile(req, res, 'vagas');
});

module.exports = router;