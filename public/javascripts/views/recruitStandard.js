const register = new Vue({
  el: '#app',
  data: {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    companyList: [],

    companyModalTitle: '',
    technologyList: []
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
        res.data.dataContent.dataList.forEach((data) => {
          that.companyList.push(data);
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
    }
  },
  mounted() {
    this.initPage();
  },
});