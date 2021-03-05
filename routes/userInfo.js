let express = require('express');
let axios = require('axios');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('userInfo', { title: '个人信息' });
});


router.put('/change', (req, res, next) => {
    let apiKey = 'changeStudentInfo';
    let requestUri = buildUtils.buildRequestApiUri(apiKey);

    axios.put(requestUri, {
          studentID: req.body.studentID,
          universityCode: req.body.universityCode,
          schoolID: req.body.schoolID,
          majorID: req.body.majorID,
          educationLevel: req.body.educationLevel,
          fullName: req.body.fullName,
          sex: req.body.sex,
          birth: req.body.birth,
          enrollmentYear: req.body.enrollmentYear,
          graduationDate: req.body.graduationDate,
          cellphone: req.body.cellphone,
          email: req.body.email,
          photo: req.body.photo,
          selfIntroductionUrl: req.body.selfIntroductionUrl,
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