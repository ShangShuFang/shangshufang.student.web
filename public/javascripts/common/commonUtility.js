let commonUtility = {};
commonUtility.setNavActive = function () {
  let pathname = window.location.pathname;
  let linkObj = {};

  if(pathname.includes('index')){
    linkObj = $('#kt_aside_menu_wrapper ul.kt-menu__nav li a[href="/index"]');
    linkObj.parent().addClass('kt-menu__item--active');
    return false;
  }
  if(pathname.includes('softwareExercises')){
    pathname = '/softwareExercises';
  }

  linkObj = $(`#kt_aside_menu_wrapper ul.kt-menu__nav li a[href="${pathname}"]`);
  linkObj.parent().addClass('kt-menu__item--active');
  linkObj.parent().parent().parent().parent().addClass('kt-menu__item--open');
};

commonUtility.isEmpty = function (value) {
  return value === '' || value === undefined || value === null;
};

commonUtility.isEmptyList = function (list) {
  return list === null || list.length === 0;
};

commonUtility.isNumber = function (value) {
  if(commonUtility.isEmpty(value)){
    return false;
  }
  return !isNaN(value);

};

commonUtility.setCookie = function (name, value) {
  let days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

commonUtility.getCookie = function (name) {
  let reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  let arr = document.cookie.match(reg);
  if(arr === null){
    return null;
  }
  return unescape(arr[2]);
};

commonUtility.delCookie = function (name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cookieName = this.getCookie(name);
  if(cookieName !== null)
    document.cookie= name + "=" + cookieName + ";expires=" + exp.toGMTString();
};

commonUtility.getLoginUser = function () {
  let cookie = this.getCookie(Constants.COOKIE_LOGIN_USER);
  if(cookie === null){
    return null;
  }
  return JSON.parse(cookie);
};

commonUtility.buildUniversityUploadRemoteUri = function (serviceUrl, universityCode, dirName) {
  let systemName = 'shs';
  return `${serviceUrl}?system=${systemName}&customer=university&universityCode=${universityCode}&dirName=${dirName}`;
};

commonUtility.buildEnterpriseUploadRemoteUri = function (serviceUrl, companyName, dirName) {
  let systemName = 'shs';
  return `${serviceUrl}?system=${systemName}&customer=enterprise&companyName=${companyName}&dirName=${dirName}`;
};

commonUtility.buildSystemRemoteUri = function (serviceUrl, dirJson) {
  let systemName = 'shs';
  let remoteUri = `${serviceUrl}?system=${systemName}`;
  for (let key in dirJson) {
    remoteUri += `&${key}=${dirJson[key]}`;
  }
  return remoteUri;
};

commonUtility.isCellphoneNumber = function (cellphone) {
  let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
  return reg.test(cellphone);

};

commonUtility.isEmail = function (email) {
  let reg = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
  return reg.test(email);
};

commonUtility.isLogin = function () {
  let login_cookie = commonUtility.getCookie(Constants.COOKIE_LOGIN_USER);
  return login_cookie !== null;
};

commonUtility.getIpAddress = function () {
  return {
    city_ip: returnCitySN["cip"],
    city_id: returnCitySN["cid"],
    city_name: returnCitySN["cname"]
  }
};

commonUtility.getBrowserName = function () {
  //取得浏览器的userAgent字符串
  let userAgent = navigator.userAgent;
  //判断是否Opera浏览器
  let isOpera = userAgent.indexOf("Opera") > -1;
  //判断是否IE浏览器
  let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
  //判断是否IE的Edge浏览器
  let isEdge = userAgent.indexOf("Edge") > -1;
  //判断是否Firefox浏览器
  let isFF = userAgent.indexOf("Firefox") > -1;
  //判断是否Safari浏览器
  let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
  //判断Chrome浏览器
  let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;

  if (isIE) {
    let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    let fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion === 7) {
      return "IE7";
    } else if (fIEVersion === 8) {
      return "IE8";
    } else if (fIEVersion === 9) {
      return "IE9";
    } else if (fIEVersion === 10) {
      return "IE10";
    } else if (fIEVersion === 11) {
      return "IE11";
    } else {
      return "0";
    }

    //IE版本过低
    return "IE";
  }
  if (isOpera) {
    return "Opera";
  }
  if (isEdge) {
    return "Edge";
  }
  if (isFF) {
    return "FF";
  }
  if (isSafari) {
    return "Safari";
  }
  if (isChrome) {
    return "Chrome";
  }
};

commonUtility.getDeviceName = function () {
  let userAgentInfo = navigator.userAgent;
  let agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  let device = 'PC';
  for (let v = 0; v < agents.length; v++) {
    if (userAgentInfo.indexOf(agents[v]) > 0) {
      device = agents[v];
      break;
    }
  }
  return device;
};

commonUtility.distinctArray = function (arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  let array = [];
  for (let i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i])
    }
  }
  return array;
};

commonUtility.appendScript = function (url) {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.body.parentNode.appendChild(script);
};