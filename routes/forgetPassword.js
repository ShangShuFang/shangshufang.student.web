let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('forgetPassword', { title: '忘记密码', layout: null });
});

router.get('/checkCellphone', function(req, res, next) {
  let apiKey = 'checkCellphone4ChangePassword';
  let cellphone = req.query.cellphone;
  let parameters = [cellphone];
  let requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
    .then(result => {
      res.json({
        err: !result.data.result,
        code: result.data.responseCode,
        msg: result.data.responseMessage,
        exist: result.data.responseData
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

router.put('/change', (req, res, next) => {
  let apiKey = 'resetPassword';
  let requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.put(requestUri, {
    cellphone: req.body.cellphone,
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
