let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('abilityLevel', { title: '能力级别定义' });
});

module.exports = router;