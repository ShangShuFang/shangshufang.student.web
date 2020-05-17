let express = require('express');
let axios = require('axios');
let dateUtils = require('../common/dateUtils');
let buildUtils = require('../common/buildUtils');
let customerMessage = require('../config/customerMessage');
let router = express.Router();

router.get('/university', (req, res, next) => {
  let apiKey = 'universityList';
  let pageNumber = 1;
  let pageSize = 9999;
  let provinceCode = 0;
  let cityCode = 0;
  let dataStatus = 'A';
  let parameters = [pageNumber, pageSize, provinceCode, cityCode, dataStatus];
  let requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.get('/school', (req, res, next) => {
  let apiKey = 'schoolList';
  let pageNumber = 1;
  let pageSize = 9999;
  let universityCode = req.query.universityCode;
  let dataStatus = 'A';
  let parameters = [pageNumber, pageSize, universityCode, dataStatus];
  let requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.get('/major', (req, res, next) => {
  let apiKey = 'majorList';
  let pageNumber = 1;
  let pageSize = 9999;
  let universityCode = req.query.universityCode;
  let schoolID = req.query.schoolID;
  let parameters = [pageNumber, pageSize, universityCode, schoolID];
  let requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.post('/buryingPoint', (req, res, next) => {
  let apiKey = 'buryingPoint';
  let requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.post(requestUri, {
    cityIP: req.body.cityIP,
    cityID: req.body.cityID,
    cityName: req.body.cityName,
    browser: req.body.browser,
    portal: req.body.portal,
    device: req.body.device,
    pageName: req.body.pageName,
    operationName: req.body.operationName,
    operationResult: req.body.operationResult,
    operationType: req.body.operationType,
    memo: req.body.memo,
    customerID: req.body.customerID
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

router.get('/verificationCode/generate', (req, res, next) => {
  let chars = ['0','1','2','3','4','5','6','7','8','9'];
  let maxIndex = chars.length - 1;
  let code = '';
  for(let i = 0; i < 6 ; i ++) {
    let index = Math.ceil(Math.random() * maxIndex);
    code += chars[index];
  }
  res.json({code: code});
});

router.post('/verificationCode/send', function (req, res, next) {
  //TODO 调用阿里云，发送手机验证码

  //保存发送的手机验证码
  let apiKey = 'saveVerificationCode';
  let requestUri = buildUtils.buildRequestApiUri(apiKey);

  axios.post(requestUri, {
    systemFunction: req.body.systemFunction,
    cellphone: req.body.cellphone,
    code: req.body.verificationCode
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

router.get('/verificationCode/check', (req, res, next) => {
  let apiKey = 'checkVerificationCode';
  let cellphone = req.query.cellphone;
  let code = req.query.code;
  let parameters = [cellphone, code];
  let requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

  axios.get(requestUri)
    .then(result => {
      let checkResult = false;
      let checkResultMessage = '您输入的验证码不正确';
      if (result.data.responseData !== null) {
        let createTime = result.data.responseData.createTime;
        let now = dateUtils.currentTime();
        let expiredTime = dateUtils.addMinutes(createTime, 5);
        let compareResult = dateUtils.compare(Date.parse(expiredTime), Date.parse(now));
        if (compareResult < 0) {
          checkResult = false;
          checkResultMessage = '您输入的验证码已过期';
        } else {
          checkResult = true;
          checkResultMessage = '验证码输入正确';
        }
      }
      res.json({
        err: false,
        code: result.data.responseCode,
        msg: checkResultMessage,
        result: checkResult
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

router.get('/email/check', (req, res, next) => {
  let apiKey = 'checkStudentEmail';
  let email = req.query.email.replace('.', '%2E');
  let parameters = [email];
  let requestUri = encodeURI(buildUtils.buildRequestApiUri(apiKey, parameters));

  axios.get(requestUri)
    .then(result => {
      res.json({
        err: false,
        code: result.data.responseCode,
        msg: result.data.responseMessage,
        exist: result.data.responseData
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

router.get('/direction/list', (req, res, next) => {
  const apiKey = 'directionList';
  const pageNumber = 1;
  const pageSize = 9999;
  const dataStatus = 'A';
  const parameters = [pageNumber, pageSize, dataStatus];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.get('/technology/category/list', (req, res, next) => {
  const apiKey = 'technologyCategoryList';
  const pageNumber = 1;
  const pageSize = 9999;
  const directionID = req.query.directionID;
  const dataStatus = 'A';
  const parameters = [pageNumber, pageSize, directionID, dataStatus];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.get('/technology/simple/list', (req, res, next) => {
  const apiKey = 'technologySimple';
  const directionID = req.query.directionID;
  const categoryID = req.query.categoryID;
  const dataStatus = 'A';
  const parameters = [directionID, categoryID, dataStatus];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

router.get('/company/list/top', (req, res, next) => {
  const apiKey = 'company';
  const pageNumber = 1;
  const pageSize = 12;
  const provinceCode = 0;
  const cityCode = 0;
  const dataStatus = 'A';
  const parameters = [pageNumber, pageSize, provinceCode, cityCode, dataStatus];
  const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

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

module.exports = router;
