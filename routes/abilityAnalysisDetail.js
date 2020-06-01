let express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('abilityAnalysisDetail', { title: '我的成就' });
});

router.get('/studentInfo', (req, res, next) => {
  const apiKey = 'studentAbilityResultSummary';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID];
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

router.get('/learningTechnology', (req, res, next) => {
  const apiKey = 'studentLearningTechnologyAbilityResultSummary';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          list: result.data.responseData
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

router.get('/technologyAnalysis', (req, res, next) => {
  const apiKey = 'studentAbility4Technology';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.technologyID];
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

router.get('/knowledgeAnalysis', (req, res, next) => {
  const apiKey = 'studentAbility4knowledge';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.technologyID];
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

router.get('/codeStandardAnalysis', (req, res, next) => {
  const apiKey = 'studentAbility4codeStandard';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.languageID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          list: result.data.responseData
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

router.get('/exerciseAnalysis', (req, res, next) => {
  const apiKey = 'exerciseAnalysis';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.technologyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          list: result.data.responseData
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

router.get('/exercisePercentAnalysis', (req, res, next) => {
  const apiKey = 'exercisePercentAnalysis';
  const parameters = [req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.technologyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          list: result.data.responseData
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
