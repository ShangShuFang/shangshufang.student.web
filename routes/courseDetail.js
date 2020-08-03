const express = require('express');
const axios = require('axios');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const sysConfig = require('../config/sysConfig.json');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('courseDetail', { title: '报名课程' });
});

router.get('/info', function(req, res, next) {
    const apiKey = 'courseDetail';
    const universityCode = req.query.universityCode;
    const schoolID = req.query.schoolID;
    const courseID = req.query.courseID;
    const dataStatus = 'NULL'
    const parameters = [universityCode, schoolID, courseID, dataStatus];
    const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

    axios.get(requestUri)
        .then(result => {
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                courseDetail: result.data.responseData
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

router.get('/student', function(req, res, next) {
    const apiKey = 'signUp4Student';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const universityCode = req.query.universityCode;
    const schoolID = req.query.schoolID;
    const courseID = req.query.courseID;
    const parameters = [pageNumber, pageSize, universityCode, schoolID, courseID];
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

router.get('/question', function(req, res, next) {
    const apiKey = 'courseQuestionList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const universityCode = req.query.universityCode;
    const schoolID = req.query.schoolID;
    const courseID = req.query.courseID;

    const parameters = [pageNumber, pageSize, universityCode, schoolID, courseID];
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

router.get('/check/applied', function(req, res, next) {
    const apiKey = 'checkAppliedCourse';
    const studentID = req.query.studentID;
    const universityCode = req.query.universityCode;
    const schoolID = req.query.schoolID;
    const courseID = req.query.courseID;

    const parameters = [studentID, universityCode, schoolID, courseID];
    const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

    axios.get(requestUri)
        .then(result => {
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                result: result.data.responseData
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

router.get('/check/assistant', function(req, res, next) {
    const apiKey = 'checkIsAssistant';
    const studentID = req.query.studentID;
    const universityCode = req.query.universityCode;
    const schoolID = req.query.schoolID;
    const courseID = req.query.courseID;

    const parameters = [studentID, universityCode, schoolID, courseID];
    const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

    axios.get(requestUri)
        .then(result => {
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                result: result.data.responseData
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

router.get('/exercises/review', function(req, res, next) {
    const apiKey = 'classExercisesReviewList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const exercisesID = req.query.exercisesID;

    const parameters = [pageNumber, pageSize, exercisesID];
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

router.get('/exercises', function(req, res, next) {
    const apiKey = 'exercises4Student';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const studentID = req.query.studentID;
    const courseID = req.query.courseID;
    const dataStatus = req.query.dataStatus;
    const studentName = req.query.studentName;
    const isSelf = req.query.isSelf;
    const parameters = [pageNumber, pageSize, studentID, courseID, dataStatus, studentName, isSelf];
    const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

    axios.get(requestUri)
        .then(result => {
            if (result.data.responseData !== null) {
                result.data.responseData.forEach((data) => {
                    data.exercisesAnswerUrl = '';
                });
            }

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

router.get('/codeStandard', function(req, res, next) {
    const apiKey = 'codeStandard';
    const pageNumber = req.query.languageID;
    const pageSize = sysConfig.pageSize.all;
    const languageID = req.query.languageID;

    const parameters = [pageNumber, pageSize, languageID];
    const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

    axios.get(requestUri)
        .then(result => {
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                dataList: result.data.responseData
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

router.get('/exercises/course', function(req, res, next) {
    const apiKey = 'courseExercises';
    const universityCode = req.query.universityCode;
    const schoolID = req.query.schoolID;
    const courseID = req.query.courseID;

    const parameters = [universityCode, schoolID, courseID];
    const requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

    axios.get(requestUri)
        .then(result => {
            if (result.data.responseData !== null) {
                result.data.responseData.forEach((data) => {
                    if (data.knowledgeList !== null) {
                        data.knowledgeList.forEach((knowledge) => {
                            if (knowledge.knowledgeExercisesList !== null) {
                                knowledge.knowledgeExercisesList.forEach(function(exercises) {
                                    exercises.answerUrl = '';
                                });
                            }
                        })
                    }
                })
            }
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                totalCount: result.data.totalCount,
                dataList: result.data.responseData
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

router.post('/question', (req, res, next) => {
    let apiKey = 'addCourseQuestion';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.post(requestUri, {
            courseUniversityCode: req.body.courseUniversityCode,
            courseSchoolID: req.body.courseSchoolID,
            courseID: req.body.courseID,
            questionerUniversityCode: req.body.questionerUniversityCode,
            questionerSchoolID: req.body.questionerSchoolID,
            questionerID: req.body.questionerID,
            questionContent: req.body.questionContent,
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

router.post('/leaveMessage', (req, res, next) => {
    let apiKey = 'submitCourseQuestionLeaveMessage';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.post(requestUri, {
            questionID: req.body.questionID,
            commenterUniversityCode: req.body.commenterUniversityCode,
            commenterSchoolID: req.body.commenterSchoolID,
            commenterID: req.body.commenterID,
            commenterType: req.body.commenterType,
            messageContent: req.body.messageContent,
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

router.put('/sourceCode/uri', (req, res, next) => {
    let apiKey = 'submitSourceCodeGitUrl';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.put(requestUri, {
            courseUniversityCode: req.body.courseUniversityCode,
            courseSchoolID: req.body.courseSchoolID,
            courseID: req.body.courseID,
            courseClass: req.body.courseClass,
            studentExercisesID: req.body.studentExercisesID,
            sourceCodeGitUrl: req.body.sourceCodeGitUrl,
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

router.post('/review', (req, res, next) => {
    let apiKey = 'addClassExercisesReview';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.post(requestUri, {
            courseUniversityCode: req.body.courseUniversityCode,
            courseSchoolID: req.body.courseSchoolID,
            courseID: req.body.courseID,
            courseClass: req.body.courseClass,
            studentExercisesID: req.body.studentExercisesID,
            reviewerID: req.body.reviewerID,
            reviewerUniversityCode: req.body.reviewerUniversityCode,
            reviewerSchoolID: req.body.reviewerSchoolID,
            reviewerType: req.body.reviewerType,
            compilationResult: req.body.compilationResult,
            runResult: req.body.runResult,
            codeStandardResult: req.body.codeStandardResult,
            codeStandardErrorListJson: req.body.codeStandardErrorListJson,
            reviewResult: req.body.reviewResult,
            reviewMemo: req.body.reviewMemo,
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

router.post('/apply', (req, res, next) => {
    let apiKey = 'applyCourse';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.post(requestUri, {
            studentUniversityCode: req.body.studentUniversityCode,
            studentSchoolID: req.body.studentSchoolID,
            studentID: req.body.studentID,
            courseUniversityCode: req.body.courseUniversityCode,
            courseSchoolID: req.body.courseSchoolID,
            courseID: req.body.courseID,
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