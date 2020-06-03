const app = new Vue({
  el: '#app',
  data: {
    commonModel: { 
      technologyID: 0, 
      loginUser: null
    },
    technologyModel: {
      technologyName: '',
      technologyThumbnailSquare: '',
      technologyStars: 0,
      directionName: '',
      categoryName: '',
      usingCompanyCount: 0,
      difficultyLevel: '',
      difficultyLevelText: '',
      technologyMemo: ''
    },
    companyModel: {
      dataList: []
    },
    topStudentModel: {
      totalCount: 0,
      dataList: []
    },
    knowledgeModel: {
      fromIndex : 0,
      toIndex: 0,
      pageNumber: 1,
      totalCount: 0,
      maxPageNumber: 0,
      dataList: [],
      paginationArray: [],
      prePageNum: -1,
      nextPageNum: -1
    },
    studentModel: {
      fromIndex : 0,
      toIndex: 0,
      pageNumber: 1,
      totalCount: 0,
      maxPageNumber: 0,
      dataList: [],
      paginationArray: [],
      prePageNum: -1,
      nextPageNum: -1
    }
  },
  methods: {
    initPage: function () {
      commonUtility.setNavActive(2);
      if (!this.checkParameter()) {
        message.error(localMessage.PARAMETER_ERROR_TECHNOLOGY_ID);
        return false;
      }
      this.getParameter();
      this.loadTechnologyInfo();
      this.loadCompanyList();
      this.loadTopStudent();
      this.loadKnowledgeList();
      this.loadStudentList();
    },
    checkParameter: function () {
      let technologyID = commonUtility.getUriParameter('technologyID');
      return commonUtility.isNumber(technologyID);
    },
    getParameter: function () {
      this.commonModel.technologyID = commonUtility.getUriParameter('technologyID');
      this.commonModel.loginUser = commonUtility.getLoginUser();
    },
    loadTechnologyInfo: function () {
      axios.get(`/technology/info/data?technologyID=${this.commonModel.technologyID}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        this.technologyModel.technologyThumbnailSquare = res.data.technology.technologyThumbnailSquare;
        this.technologyModel.technologyName = res.data.technology.technologyName;
        this.technologyModel.technologyStars = res.data.technology.technologyStars;
        this.technologyModel.directionName = res.data.technology.directionName;
        this.technologyModel.categoryName = res.data.technology.categoryName;
        this.technologyModel.usingCompanyCount = res.data.technology.usingCompanyCount;
        this.technologyModel.difficultyLevel = res.data.technology.difficultyLevel;
        this.technologyModel.difficultyLevelText = res.data.technology.difficultyLevelText;
        this.technologyModel.technologyMemo = res.data.technology.technologyMemo;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadCompanyList: function () {
      axios.get('/common/company/list/top')
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        this.companyModel.dataList = res.data.dataList;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadTopStudent: function () {
      axios.get(`/technology/info/student/top/list?technologyID=${this.commonModel.technologyID}`)
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (!commonUtility.isEmptyList(res.data.dataList)) {
              res.data.dataList.forEach((data)=>{
                if (commonUtility.isEmpty(data.studentPhoto)) {
                  data.studentPhoto = '/media/users/user_default.png';
                }
              });
            }
            this.topStudentModel.totalCount = commonUtility.isEmptyList(res.data.dataList) ? 0 : res.data.dataList.length;
            this.topStudentModel.dataList = res.data.dataList;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadKnowledgeList: function () {
      axios.get(`/technology/info/knowledge/list?pageNumber=${this.knowledgeModel.pageNumber}&technologyID=${this.commonModel.technologyID}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        this.knowledgeModel.totalCount = res.data.dataContent.totalCount;
        this.knowledgeModel.dataList = res.data.dataContent.dataList;
        this.knowledgeModel.pageNumber = res.data.dataContent.currentPageNum;
        this.knowledgeModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
        this.knowledgeModel.paginationArray = res.data.dataContent.paginationArray;
        this.knowledgeModel.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
        this.knowledgeModel.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
        this.knowledgeModel.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.knowledgeModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + 1;
        this.knowledgeModel.toIndex = res.data.dataContent.dataList === null ? 0 : (this.knowledgeModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + this.knowledgeModel.dataList.length;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadStudentList: function () {
      axios.get(`/technology/info/student/list?pageNumber=${this.studentModel.pageNumber}&technologyID=${this.commonModel.technologyID}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }

        if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
          res.data.dataContent.dataList.forEach((data)=>{
            if (commonUtility.isEmpty(data.studentPhoto)) {
              data.studentPhoto = '/media/users/user_default.png';
            }
          });
        }

        this.studentModel.totalCount = res.data.dataContent.totalCount;
        this.studentModel.dataList = res.data.dataContent.dataList;
        this.studentModel.pageNumber = res.data.dataContent.currentPageNum;
        this.studentModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
        this.studentModel.paginationArray = res.data.dataContent.paginationArray;
        this.studentModel.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
        this.studentModel.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
        this.studentModel.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.studentModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + 1;
        this.studentModel.toIndex = res.data.dataContent.dataList === null ? 0 : (this.studentModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + this.studentModel.dataList.length;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    onKnowledgeFirstPage: function () {
      if (this.knowledgeModel.pageNumber === 1) {
        return false;
      }
      this.knowledgeModel.pageNumber = 1;
      this.loadKnowledgeList();
    },
    onKnowledgePrePage: function () {
      if (this.knowledgeModel.pageNumber === 1) {
        return false;
      }
      this.knowledgeModel.pageNumber--;
      this.loadKnowledgeList();
    },
    onKnowledgePagination: function (pageNumber) {
      if (this.knowledgeModel.pageNumber === pageNumber) {
        return false;
      }
      this.knowledgeModel.pageNumber = pageNumber;
      this.loadKnowledgeList();
    },
    onKnowledgeNextPage: function () {
      if (this.knowledgeModel.pageNumber === this.knowledgeModel.maxPageNumber) {
        return false;
      }
      this.knowledgeModel.pageNumber++;
      this.loadKnowledgeList();
    },
    onKnowledgeLastPage: function () {
      if (this.knowledgeModel.pageNumber === this.knowledgeModel.maxPageNumber) {
        return false;
      }
      this.knowledgeModel.pageNumber = this.knowledgeModel.maxPageNumber;
      this.loadKnowledgeList();
    },
    onStudentFirstPage: function () {
      if (this.studentModel.pageNumber === 1) {
        return false;
      }
      this.studentModel.pageNumber = 1;
      this.loadStudentList();
    },
    onStudentPrePage: function () {
      if (this.studentModel.pageNumber === 1) {
        return false;
      }
      this.studentModel.pageNumber--;
      this.loadStudentList();
    },
    onStudentPagination: function (pageNumber) {
      if (this.studentModel.pageNumber === pageNumber) {
        return false;
      }
      this.studentModel.pageNumber = pageNumber;
      this.loadStudentList();
    },
    onStudentNextPage: function () {
      if (this.studentModel.pageNumber === this.studentModel.maxPageNumber) {
        return false;
      }
      this.studentModel.pageNumber++;
      this.loadStudentList();
    },
    onStudentLastPage: function () {
      if (this.studentModel.pageNumber === this.studentModel.maxPageNumber) {
        return false;
      }
      this.studentModel.pageNumber = this.studentModel.maxPageNumber;
      this.loadStudentList();
    }
  },
  mounted() {
    this.initPage();
  },
});