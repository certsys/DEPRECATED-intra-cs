var express = require('express');
var router = express.Router();
var Auth = require('./auth');

router.post('/', function (req, res) {
    Auth.createCredentials(req, res);
});

module.exports = router;
