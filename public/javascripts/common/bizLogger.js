let bizLogger = {};
bizLogger.OPERATION_RESULT = {
  SUCCESS: 'S',
  FAILED: 'F'
};

bizLogger.OPERATION_TYPE = {
  LOAD: 'L',
  SEARCH: 'S',
  UPDATE: 'U',
  INSERT: 'I',
  DELETE: 'D',
  REDIRECT: 'R'
};

bizLogger.logInfo = function (pageName, operationName, operationType, operationResult, memo) {
  let ipAddress = commonUtility.getIpAddress();
  let browser = commonUtility.getBrowserName();
  let device = commonUtility.getDeviceName();
  let portal = 'T';
  let loginUser = commonUtility.isLogin() ? commonUtility.getLoginUser().customerID : 0;

  $.post('common/businessAnalyseLog',
    {
      cityIP: ipAddress.city_ip,
      cityID: ipAddress.city_id,
      cityName: ipAddress.city_name,
      browser: browser,
      portal: portal,
      device: device,
      pageName: pageName,
      operationName: operationName,
      operationResult: operationResult === undefined ? '' : operationResult,
      operationType: operationType,
      memo: memo === undefined ? '' : memo,
      customerID: loginUser
    },
    function(data,status){
      //alert("数据：" + data + "\n状态：" + status);
    }
  )
};