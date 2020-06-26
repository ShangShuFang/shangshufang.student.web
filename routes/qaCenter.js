let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('qaCenter', { title: '个人中心' });
});

router.get('/list/question', function(req, res, next) {
    const apiKey = 'studentQuestionList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const studentID = req.query.studentID;

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

router.get('/list/question/answer', function(req, res, next) {
    const apiKey = 'questionAnswerList';
    const questionID = req.query.questionID;

    const parameters = [questionID];
    const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

    axios.get(requestUri)
        .then(result => {
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                dataList: result.data.responseData,
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

router.get('/list/answer', function(req, res, next) {
    const apiKey = 'studentAnswerList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const studentID = req.query.studentID;

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

module.exports = router;