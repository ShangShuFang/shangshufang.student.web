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
  const parameters = [req.query.studentID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          studentInfo: result.data.responseData
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
  const apiKey = 'studentLearningTechnology';
  const parameters = [req.query.studentID];
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
  const parameters = [req.query.studentID, req.query.technologyID];
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
  const parameters = [req.query.studentID, req.query.languageID];
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

router.get('/knowledge/finish', (req, res, next) => {
  const apiKey = 'finishKnowledgeList';
  const parameters = [req.query.pageNumber, sysConfig.pageSize.all, req.query.studentID, req.query.technologyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          totalCount: result.data.totalCount,
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

router.get('/knowledge/noLearning', (req, res, next) => {
  const apiKey = 'noLearningKnowledgeList';
  const parameters = [req.query.pageNumber, sysConfig.pageSize.all, req.query.studentID, req.query.technologyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          totalCount: result.data.totalCount,
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

router.get('/knowledge/weak', (req, res, next) => {
  const apiKey = 'weaknessKnowledgeList';
  const parameters = [req.query.pageNumber, sysConfig.pageSize.all, req.query.studentID, req.query.technologyID];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
      .then(result => {
        //let dataContent = buildUtils.buildRenderData(req.query.pageNumber, sysConfig.pageSize.all, result);
        res.json({
          err: !result.data.result,
          code: result.data.responseCode,
          msg: result.data.responseMessage,
          totalCount: result.data.totalCount,
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

router.get('/exercise/list', (req, res, next) => {
  const apiKey = 'studentExercisesList';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.ten;
  const universityCode = req.query.universityCode;
  const schoolID = req.query.schoolID;
  const studentID = req.query.studentID;
  const technologyID = req.query.technologyID;
  const dataStatus = req.query.dataStatus;

  const parameters = [pageNumber, pageSize, universityCode, schoolID, studentID, technologyID, dataStatus];
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

router.get('/exercisePercentAnalysis', (req, res, next) => {
  const apiKey = 'exercisePercentAnalysis';
  const parameters = [req.query.pageSize, sysConfig.pageSize.sixteen, req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.technologyID];
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
  const parameters = [req.query.pageSize, sysConfig.pageSize.sixteen, req.query.studentUniversityCode, req.query.studentSchoolID, req.query.studentID, req.query.technologyID];
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

router.get('/comprehensiveExercisesAnalysis', (req, res, next) => {
  const apiKey = 'comprehensiveExercisesAnalysisList';
  const parameters = [req.query.studentID];
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

router.get('/comprehensiveExercisesSubmitList', (req, res, next) => {
  const apiKey = 'comprehensiveExercisesSubmitList';
  const parameters = [req.query.studentID];
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

router.get('/comprehensiveExercisesKnowledgeAnalysisList', (req, res, next) => {
  const apiKey = 'comprehensiveExercisesKnowledgeAnalysisList';
  const parameters = [req.query.studentID, req.query.technologyID];
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
