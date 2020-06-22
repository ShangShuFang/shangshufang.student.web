const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('comprehensiveExercises', { title: '综合测评' });
});

router.get('/list', (req, res, next) => {
  const apiKey = 'comprehensiveExercisesList';
  const pageNumber = req.query.pageNumber;
  const pageSize = sysConfig.pageSize.ten;
  const directionID = req.query.directionID;
  const categoryID = req.query.categoryID;
  const technologyID = req.query.technologyID;
  const dataStatus = 'A';


  const parameters = [pageNumber, pageSize, directionID, categoryID, technologyID, dataStatus];
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

module.exports = router;
