let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let sysConfig = require('../config/sysConfig.json');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('comprehensiveCenter', { title: '个人中心' });
});

router.get('/list', (req, res, next) => {
    const apiKey = 'studentComprehensiveExercisesList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.sixteen;
    const studentID = req.query.studentID;
    const directionID = req.query.directionID;
    const categoryID = req.query.categoryID;
    const technologyID = req.query.technologyID;
    const dataStatus = req.query.dataStatus;


    const parameters = [pageNumber, pageSize, studentID, directionID, categoryID, technologyID, dataStatus];
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

router.put('/change', (req, res, next) => {
    let apiKey = 'changeStudentComprehensiveExercises';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.put(requestUri, {
            collectionID: req.body.collectionID,
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