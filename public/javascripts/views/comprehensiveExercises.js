const app = new Vue({
  el: '#app',
  data: {
    directionList: [],
    selectedDirection: {directionID: 0, directionName: '全部'},

    categoryList: [],
    selectedCategory: {categoryID: 0, categoryName: '全部'},

    technologyList:[],
    selectedTechnology: {technologyID: 0, technologyName: '全部'},

    universityFilterList: [],
    selectedUniversityFilter: {filterID: 0, filterName: '全部院校'},

    fromIndex : 0,
    toIndex: 0,
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: [],
    prePageNum: -1,
    nextPageNum: -1,

    loginUser: commonUtility.getLoginUser(),
    isLogin: commonUtility.isLogin(),
  },
  methods: {
    initPage: function () {
      commonUtility.setNavActive(4);
      this.loadDirectionList();
      this.loadTechnologyCategoryList();
      this.loadTechnologyList();
      this.loadData();
    },
    loadDirectionList: function () {
      axios.get('/common/direction/list')
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            this.directionList = res.data.dataList;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadTechnologyCategoryList: function () {
      axios.get(`/common/technology/category/list?directionID=${this.selectedDirection.directionID}`)
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            this.categoryList = res.data.dataList;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadTechnologyList: function () {
      axios.get(`/common/technology/simple/list?directionID=${this.selectedDirection.directionID}&categoryID=${this.selectedCategory.categoryID}`)
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            this.technologyList = res.data.dataList;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    
    loadData: function () {
      KTApp.blockPage({
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: '正在查询...'
      });
      axios.get(`/exercises/comprehensive/list?`
          .concat(`pageNumber=${this.pageNumber}`)
          .concat(`&directionID=${this.selectedDirection.directionID}`)
          .concat(`&categoryID=${this.selectedCategory.categoryID}`)
          .concat(`&technologyID=${this.selectedTechnology.technologyID}`))
          .then(res => {
            if (res.data.err) {
              KTApp.unblockPage();
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }

            if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
              res.data.dataContent.dataList.forEach((data)=>{
                data.isCollected = false;
              });
            }

            this.totalCount = res.data.dataContent.totalCount;
            this.dataList = res.data.dataContent.dataList;
            this.pageNumber = parseInt(res.data.dataContent.currentPageNum);
            this.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
            this.paginationArray = res.data.dataContent.paginationArray;
            this.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
            this.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
            this.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + 1;
            this.toIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + res.data.dataContent.dataList.length;
            KTApp.unblockPage();
          })
          .catch(err => {
            KTApp.unblockPage();
            message.error(localMessage.NETWORK_ERROR);
          });
    },

    onCollect: function (data) {
      data.isCollected = !data.isCollected;
    },
    onFilterByDirection: function (direction) {
      if ((direction === undefined && this.selectedDirection.directionID === 0) ||
          (direction !== undefined && this.selectedDirection.directionID === direction.directionID)) {
        return false;
      }
      this.selectedDirection = direction === undefined ? { directionID: 0, directionName: '全部' } : { directionID: direction.directionID, directionName: direction.directionName };
      this.selectedCategory = { categoryID: 0, categoryName: '全部' };
      this.selectedTechnology = {technologyID: 0, technologyName: '全部'};
      this.loadTechnologyCategoryList();
      this.loadTechnologyList();
      this.loadData();
    },
    onFilterByCategory: function (category) {
      if ((category === undefined && this.selectedCategory.categoryID === 0 ||
          (category !== undefined && this.selectedCategory.categoryID === category.technologyCategoryID))) {
        return false;
      }
      this.selectedCategory = category === undefined ? {categoryID: 0, categoryName: '全部' } : {categoryID: category.technologyCategoryID, categoryName: category.technologyCategoryName };
      this.selectedTechnology = {technologyID: 0, technologyName: '全部'};
      this.loadTechnologyList();
      this.loadData();
    },
    onFilterByTechnology: function (technology) {
      if ((technology === undefined && this.selectedTechnology.technologyID === 0 ||
          (technology !== undefined && this.selectedTechnology.technologyID === technology.technologyID))) {
        return false;
      }
      this.selectedTechnology = technology === undefined ? {technologyID: 0, technologyName: '全部' } : {technologyID: technology.technologyID, technologyName: technology.technologyName };
      this.loadData();
    },
    onFirstPage: function () {
      if (this.pageNumber === 1) {
        return false;
      }
      this.pageNumber = 1;
      this.loadStudentList();
    },
    onPrePage: function () {
      if (this.pageNumber === 1) {
        return false;
      }
      this.pageNumber--;
      this.loadStudentList();
    },
    onPagination: function (pageNumber) {
      if (this.pageNumber === pageNumber) {
        return false;
      }
      this.pageNumber = pageNumber;
      this.loadStudentList();
    },
    onNextPage: function () {
      if (this.pageNumber === this.maxPageNumber) {
        return false;
      }
      this.pageNumber++;
      this.loadStudentList();
    },
    onLastPage: function () {
      if (this.pageNumber === this.maxPageNumber) {
        return false;
      }
      this.pageNumber = this.maxPageNumber;
      this.loadStudentList();
    }
  },
  mounted() {
    this.initPage();
  },
});