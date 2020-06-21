const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('collection', { title: '我关注的' });
});

router.get('/list', (req, res, next) => {
  const apiKey = 'studentCollectionList';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.sixteen;
  const studentID = sysConfig.pageSize.studentID;
  const parameters = [pageNumber, pageSize, studentID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.get('/check/collected', (req, res, next) => {
  const apiKey = 'checkCollected';
  const pageNumber = req.query.studentID;
  const companyID = req.query.companyID;
  const parameters = [pageNumber, companyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          isCollected: result.data.responseData
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

router.post('/add', (req, res, next) => {
  const apiKey = 'addStudentCollection';
  const requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.post(requestUri, {
    studentID: req.body.studentID,
    companyID: req.body.companyID,
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

router.delete('/delete', (req, res, next) => {
  const apiKey = 'deleteStudentCollection';
  const studentID = req.query.studentID;
  const companyID = req.query.companyID;
  const parameters = [studentID, companyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.delete(requestUri)
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
