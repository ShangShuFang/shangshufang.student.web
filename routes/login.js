let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login', {title: '登陆', layout: null});
});

router.post('/', function (req, res, next) {
  let apiKey = 'login';
  let parameters = [req.body.cellphone, req.body.password];
  let requestApi = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestApi)
    .then(result => {
      res.json({
        err: !result.data.result,
        accountValid: result.data.totalCount > 0,
        userInfo: result.data.responseData,
        code: result.data.responseCode,
        msg: result.data.responseMessage
      });
    })
    .catch(error => {
      res.json({
        err: false,
        code: error.response.status,
        msg: error.response.data.message
      });
    });
});
module.exports = router;
