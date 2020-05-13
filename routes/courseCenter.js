const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('courseCenter', { title: '选课中心' });
});

router.get('/list/like', function(req, res, next) {
  const apiKey = 'courseListByContent';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.page_size_16;
  const content = req.query.content;
  const parameters = [pageNumber, pageSize, content];
  const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

  axios.get(requestUri)
    .then(result => {
      let dataContent = buildUtils.buildRenderData('课程列表', pageNumber, pageSize, result);
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

router.get('/list', function(req, res, next) {
  const apiKey = 'courseList';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.page_size_16;
  const directionID = req.query.directionID;
  const categoryID = req.query.categoryID;
  const technologyID = req.query.technologyID;
  const universityCode = req.query.universityCode;
  const schoolID = req.query.schoolID;
  const isSelf = req.query.isSelf;
  const dataStatus = 'NULL'
  
  const parameters = [pageNumber, pageSize, universityCode, schoolID, 0, directionID, categoryID, technologyID, 'NULL', dataStatus, isSelf, 'H'];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
    .then(result => {
      let dataContent = buildUtils.buildRenderData('课程列表', pageNumber, pageSize, result);
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
