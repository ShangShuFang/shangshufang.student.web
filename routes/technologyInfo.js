const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('technologyInfo', { title: '市场技术' });
});

router.get('/data', function(req, res, next) {
  const apiKey = 'technology';
  const technologyID = req.query.technologyID;
  const parameters = [technologyID];
  const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

  axios.get(requestUri)
    .then(result => {
      res.json({
        err: !result.data.result,
        code: result.data.responseCode,
        msg: result.data.responseMessage,
        technology: result.data.responseData
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

router.get('/knowledge/list', function(req, res, next) {
  const apiKey = 'knowledgeList';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.ten;
  const technologyID = req.query.technologyID;
  const learningPhaseID = 0;
  const dataStatus = 'A';
  const parameters = [pageNumber, pageSize, technologyID, learningPhaseID, dataStatus];
  const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

  axios.get(requestUri)
    .then(result => {
      let dataContent = buildUtils.buildRenderData(pageNumber, pageSize, result);
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

router.get('/student/list', function(req, res, next) {
  const apiKey = 'signUp4Technology';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.ten;
  const technologyID = req.query.technologyID;
  const parameters = [pageNumber, pageSize, technologyID];
  const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

  axios.get(requestUri)
    .then(result => {
      let dataContent = buildUtils.buildRenderData(pageNumber, pageSize, result);
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

module.exports = router;
