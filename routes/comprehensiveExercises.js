const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('comprehensiveExercises', { title: '就业测评' });
});

router.get('/list', (req, res, next) => {
    const apiKey = 'comprehensiveExercisesList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const direction = req.query.direction;
    const difficulty = req.query.difficulty;
    const dataStatus = 'A';
    const parameters = [pageNumber, pageSize, direction, difficulty, dataStatus];
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
    const apiKey = 'checkComprehensiveExercisesCollected';
    const pageNumber = req.query.studentID;
    const exercisesID = req.query.exercisesID;
    const parameters = [pageNumber, exercisesID];
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


router.post('/add', function(req, res, next) {
    let apiKey = 'addStudentComprehensiveExercises';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.post(requestUri, {
            studentID: req.body.studentID,
            exercisesID: req.body.exercisesID,
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
    const apiKey = 'deleteStudentComprehensiveExercises';
    const studentID = req.query.studentID;
    const exercisesID = req.query.exercisesID;
    const parameters = [studentID, exercisesID];
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