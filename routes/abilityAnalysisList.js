let express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('abilityAnalysisList', { title: '看看别人' });
});

router.get('/data', function(req, res, next) {
  const apiKey = 'studentAbilityList';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.sixteen;
  const directionID = req.query.directionID;
  const categoryID = req.query.categoryID;
  const technologyID = req.query.technologyID;
  const universityCode = req.query.universityCode;
  const schoolID = req.query.schoolID;
  const studentName = req.query.studentName;
  const studentID = req.query.studentID;
  const parameters = [pageNumber, pageSize, directionID, categoryID, technologyID, universityCode, schoolID, studentName, studentID];
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
