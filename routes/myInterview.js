let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let sysConfig = require('../config/sysConfig.json')
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('myInterview', { title: '个人中心' });
});

router.get('/list', (req, res, next) => {
    const apiKey = 'interviewList';
    const pageNumber = req.query.pageNumber;
    const pageSize = sysConfig.pageSize.ten;
    const studentID = req.query.studentID;
    const dataStatus = req.query.dataStatus;
    const parameters = [pageNumber, pageSize, studentID, dataStatus];
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

router.put('/change/status', (req, res, next) => {
    let apiKey = 'changeCompanyTalentStatus';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.put(requestUri, {
        talentID: req.body.talentID,
        dataStatus: req.body.dataStatus,
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