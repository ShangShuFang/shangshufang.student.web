let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('changePassword', { title: '修改密码', layout: null});
});

router.put('/change', (req, res, next) => {
  let apiKey = 'changePassword';
  let requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.put(requestUri, {
    studentID: req.body.studentID,
    universityCode: req.body.universityCode,
    schoolID: req.body.schoolID,
    password: req.body.password,
    loginUser: req.body.loginUser
  })
  .then(response => {
    res.json({
      err: !response.data.result,
      code: response.data.responseCode,
      msg: response.data.responseMessage
    });
  })
  .catch(error => {
    res.json({
      err: true,
      code: error.code,
      msg: customerMessage[error.code]
    });
  });
});

module.exports = router;
