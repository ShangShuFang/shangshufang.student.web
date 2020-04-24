let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('register', { title: '注册', layout: null });
});

module.exports = router;
