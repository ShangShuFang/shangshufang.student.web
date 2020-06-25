let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('projectCenter', { title: '个人中心' });
});

module.exports = router;