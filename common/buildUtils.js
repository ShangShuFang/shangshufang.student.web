let sysConfig = require('../config/sysConfig');
let apiConfig = require('../config/apiConfig');
let pagingUtils = require('../common/pagingUtils');

exports.buildRequestApiUri = function (apiName, parameters) {
  let host = apiConfig.shs.host;
  let port = apiConfig.shs.port;
  let path = apiConfig.shs.path[apiName];
  let serviceUri = `http://${host}:${port}/${path}`;

  if (parameters !== undefined && parameters instanceof Array) {
    parameters.forEach(function (parameter) {
      serviceUri = `${serviceUri}/${parameter}`;
    })
  }

  return serviceUri;
};

exports.buildRenderData = function (title, pageNumber, pageSize, serviceResult) {
  let renderData = {};
  if(!serviceResult.data.result){
    renderData = {
      title: title,
      totalCount: 0,
      pageSize: pageSize,
      paginationArray:[],
      dataList: []
    };
  }else{
    let paginationArray = pagingUtils.getPaginationArray(pageNumber, pageSize, serviceResult.data.totalCount);
    let prePaginationNum = pagingUtils.getPrePaginationNum(pageNumber);
    let nextPaginationNum = pagingUtils.getNextPaginationNum(pageNumber, pageSize, serviceResult.data.totalCount);
    if(serviceResult.data.responseData === null){
      renderData = {
        title: title,
        totalCount: serviceResult.data.totalCount,
        currentPageNum: pageNumber,
        pageSize: pageSize,
        dataList: serviceResult.data.responseData
      }
    }else{
      if(prePaginationNum > 0 && nextPaginationNum > 0){
        renderData = {
          title: title,
          totalCount: serviceResult.data.totalCount,
          paginationArray: paginationArray,
          prePageNum: prePaginationNum,
          nextPageNum: nextPaginationNum,
          currentPageNum: pageNumber,
          pageSize: pageSize,
          dataList: serviceResult.data.responseData
        }
      }else if(prePaginationNum === 0 && nextPaginationNum === -1){
        renderData = {
          title: title,
          totalCount: serviceResult.data.totalCount,
          paginationArray: paginationArray,
          currentPageNum: pageNumber,
          pageSize: pageSize,
          dataList: serviceResult.data.responseData
        }
      }else if(prePaginationNum === 0) {
        renderData = {
          title: title,
          totalCount: serviceResult.data.totalCount,
          paginationArray: paginationArray,
          nextPageNum: nextPaginationNum,
          currentPageNum: pageNumber,
          pageSize: pageSize,
          dataList: serviceResult.data.responseData
        }
      }else{
        renderData = {
          title: title,
          totalCount: serviceResult.data.totalCount,
          paginationArray: paginationArray,
          prePageNum: prePaginationNum,
          currentPageNum: pageNumber,
          pageSize: pageSize,
          dataList: serviceResult.data.responseData
        }
      }
    }
  }

  return renderData;
};