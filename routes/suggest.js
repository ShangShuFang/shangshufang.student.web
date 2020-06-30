let express = require('express');
let router = express.Router();
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');

router.get('/', function(req, res, next) {
    res.render('suggest', { title: '意见反馈' });
});

router.get('/suggestType', (req, res, next) => {
    let apiKey = 'suggestType';
    let portal = 'S';
    let parameters = [portal];
    let requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

    axios.get(requestUri)
        .then(result => {
            res.json({
                err: !result.data.result,
                code: result.data.responseCode,
                msg: result.data.responseMessage,
                totalCount: result.data.totalCount,
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

router.post('/', (req, res, next) => {
    let apiKey = 'addSuggest';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.post(requestUri, {
            suggestTypeID: req.body.suggestTypeID,
            suggestContent: req.body.suggestContent,
            cellphone: req.body.cellphone,
            portal: 'S',
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