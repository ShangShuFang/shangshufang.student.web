const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
  let exercisesID = req.query.exercisesID;
  res.render('comprehensiveExercisesDetail', { title: '就业测评', exercisesID: exercisesID });
});

router.get('/data', (req, res, next) => {
  const apiKey = 'comprehensiveExercises';
  const exercisesID = req.query.exercisesID;
  const dataStatus = 'A';
  const parameters = [exercisesID, dataStatus];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          detail: result.data.responseData
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

router.get('/result', (req, res, next) => {
  const apiKey = 'getStudentComprehensiveExercises';
  const studentID = req.query.studentID;
  const exercisesID = req.query.exercisesID;
  const parameters = [studentID, exercisesID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          detail: result.data.responseData
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

router.post('/add', function(req, res, next) {
  let apiKey = 'addStudentComprehensiveExercises';
  let requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.post(requestUri, {
    studentID: req.body.studentID,
    exercisesID: req.body.exercisesID,
    programLanguage: req.body.programLanguage,
    gitUrl: req.body.gitUrl,
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

router.put('/change', function(req, res, next) {
  let apiKey = 'changeStudentComprehensiveExercises';
  let requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.put(requestUri, {
    collectionID: req.body.collectionID,
    studentID: req.body.studentID,
    exercisesID: req.body.exercisesID,
    programLanguage: req.body.programLanguage,
    gitUrl: req.body.gitUrl,
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