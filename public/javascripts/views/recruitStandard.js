const register = new Vue({
  el: '#app',
  data: {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    companyList: [],

    companyModalTitle: '',
    technologyList: [],

    isLogin: commonUtility.isLogin(),
    loginUser: commonUtility.getLoginUser(),
  },
  methods: {      
    initPage: function () {
      commonUtility.setNavActive(7);
      this.loadCompany();
    },
    loadCompany: function () {
      let that = this;
      axios.get(`/recruit_standard/list?pageNumber=${that.pageNumber}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }

        if(commonUtility.isEmptyList(res.data.dataContent.dataList)) {
          return false;
        }

        that.totalCount = res.data.dataContent.totalCount;
        that.pageNumber = parseInt(res.data.dataContent.currentPageNum);
        that.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
        if (!that.isLogin) {
          res.data.dataContent.dataList.forEach((data) => {
            data.isCollect = 0;
            that.companyList.push(data);
          });
          return false;
        }

        res.data.dataContent.dataList.forEach((data) => {
          axios.get(`/collection/check/collected?studentID=${that.loginUser.studentID}&companyID=${data.companyID}`)
          .then(checkRes => {
            if (!checkRes.data.err) {
              data.isCollect = checkRes.data.isCollected ? 1 : 0;
              data.collectionID = checkRes.data
              that.companyList.push(data);
            }
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
        });
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },

    onLoadMore: function () {
      this.pageNumber++;
      this.loadCompany();
    },

    onShowDetail: function (company) {
      this.companyModalTitle = company.companyAbbreviation;
      axios.get(`/recruit_standard/technology/using?companyID=${company.companyID}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }

        if(commonUtility.isEmptyList(res.data.dataList)) {
          return false;
        }

        this.technologyList = res.data.dataList
        $('#modal_using_technology').modal('show');
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    onCollect: function (company) {
      if (company.isCollect === 1) {
        this.cancelCollect(company);
        return false;
      }
      this.addCollect(company);
    },
    addCollect: function (company) {
      axios.post('/collection/add', {
        studentID: this.loginUser.studentID,
        companyID: company.companyID,
        loginUser: this.loginUser.studentID,
      })
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        company.isCollect = company.isCollect === 0 ? 1 : 0;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    cancelCollect: function (company) {
      axios.delete(`/collection/delete?studentID=${this.loginUser.studentID}&companyID=${company.companyID}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        company.isCollect = company.isCollect === 0 ? 1 : 0;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
  },
  mounted() {
    this.initPage();
  },
});