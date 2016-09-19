var express = require('express');
var router = express.Router();

// router.use(function (req, res, next) {
//     global.verificaToken(req, res, next)
// });

router.get('/', function (req, res) {
    res.json(null);
});


module.exports = router;

