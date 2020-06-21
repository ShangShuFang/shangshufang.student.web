const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('recruitStandard', { title: '企业招聘标准' });
});

router.get('/list', (req, res, next) => {
  const apiKey = 'company';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.sixteen;
  const parameters = [pageNumber, pageSize, 0, 0, 'A'];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        let dataContent = buildUtils.buildRenderData(req.query.pageNumber, sysConfig.pageSize.all, result);
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          dataContent: dataContent
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

router.get('/technology/using', (req, res, next) => {
  const apiKey = 'companyUsingTechnology';
  const companyID = req.query.companyID;
  const parameters = [companyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          dataList: result.data.responseData
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
