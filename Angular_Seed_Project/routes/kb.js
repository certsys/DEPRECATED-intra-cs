var express = require('express');
var router = express.Router();

//
router.get('/', function (req, res) {
    // res.download('util/fotos.csv');
});

router.post('/', function (req, res) {
    var file = 'kb/' + req.body.id;
    res.download(file);
    // res.json(file);
});

module.exports = router;

