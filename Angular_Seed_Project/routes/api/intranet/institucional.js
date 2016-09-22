var express = require('express');
var router = express.Router();
var Auth = require('../authentication/auth');
var Debug = require('../../debug');

if (!Debug.isDebug()) {
    router.use(Auth.auth);
}

router.get('/', function (req, res) {
    res.json(null);
});


module.exports = router;

