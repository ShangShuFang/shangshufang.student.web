const app = new Vue({
  el: '#app',
  data: {
    loginUser: commonUtility.getLoginUser(),
    content: '',
    directionList: [],
    selectedDirection: { directionID: 0, directionName: '全部' },
    categoryList: [],
    selectedCategory: { categoryID: 0, categoryName: '全部' },
    technologyList:[],
    selectedTechnology: {technologyID: 0, technologyName: '全部'},
    universityFilterList: [],
    selectedUniversityFilter: {filterID: 0, filterName: '全部院校'},

    courseFilterList: [],
    selectedCourseFilter: {filterID: 0, filterName: '全部课程'},

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
  methods: {
    initPage: function () {
      commonUtility.setNavActive(1);
      this.loadDirectionList();
      this.loadTechnologyCategoryList();
      this.loadTechnologyList();
      this.loadUniversityFilterList();
      this.loadCourseFilterList();
      this.loadCourseList();
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
    loadUniversityFilterList: function () {
      this.universityFilterList.push({filterID: 0, filterName: '全部院校'});
      this.universityFilterList.push({filterID: 1, filterName: '我们院校'});
      this.universityFilterList.push({filterID: 2, filterName: '我们学院'});
      this.universityFilterList.push({filterID: 3, filterName: '其他院校'});
    },
    loadCourseFilterList: function () {
      this.courseFilterList.push({filterID: 0, filterName: '全部课程'});
      this.courseFilterList.push({filterID: 1, filterName: '我已报名'});
    },
    onFilterByLikeContent: function (event) {
      if (event.keyCode !== 13) {
        return false;
      }
      this.loadCourseListByContent();
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
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onFilterByCategory: function (category) {
      if ((category === undefined && this.selectedCategory.categoryID === 0 || 
          (category !== undefined && this.selectedCategory.categoryID === category.technologyCategoryID))) {
        return false;
      }
      this.selectedCategory = category === undefined ? {categoryID: 0, categoryName: '全部' } : {categoryID: category.technologyCategoryID, categoryName: category.technologyCategoryName };
      this.selectedTechnology = {technologyID: 0, technologyName: '全部'};
      this.loadTechnologyList();
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onFilterByTechnology: function (technology) {
      if ((technology === undefined && this.selectedTechnology.technologyID === 0 || 
          (technology !== undefined && this.selectedTechnology.technologyID === technology.technologyID))) {
        return false;
      }
    this.selectedTechnology = technology === undefined ? {technologyID: 0, technologyName: '全部' } : {technologyID: technology.technologyID, technologyName: technology.technologyName };
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onFilterByUniversity: function (filter) {
      if (this.selectedUniversityFilter.filterID === filter.filterID) {
        return false;
      }
      this.selectedUniversityFilter = {filterID: filter.filterID, filterName: filter.filterName};
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onFilterByStudent: function (filter) {
      if (this.selectedCourseFilter.filterID === filter.filterID) {
        return false;
      }
      this.selectedCourseFilter = {filterID: filter.filterID, filterName: filter.filterName};
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    getUniversityFilterCondition: function () {
      let filter = {universityCode: 0, schoolID: 0, isSelf: false};
      if (this.loginUser === null) {
        return filter;
      }

      switch (this.selectedUniversityFilter.filterID) {
        case 0 :
          filter = {
            universityCode: 0, 
            schoolID: 0, 
            isSelf: false
          };
          break;
        case 1 :
          filter = {
            universityCode: this.loginUser.universityCode, 
            schoolID: 0, 
            isSelf: true
          };
          break;
        case 2 :
          filter = {
            universityCode: this.loginUser.universityCode, 
            schoolID: this.loginUser.schoolID, 
            isSelf: true
          };
          isSelf = true;
          break;
        case 3 :
          filter = {
            universityCode: this.loginUser.universityCode, 
            schoolID: 0, 
            isSelf: false
          };
          break;
      }
      return filter;
    },
    loadCourseListByContent: function () {
      KTApp.blockPage({
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: '正在查询...'
      });

      let content = commonUtility.isEmpty(this.content) ? 'NULL' : this.content;

      axios.get(`/course/center/list/like?`
      .concat(`pageNumber=${this.pageNumber}`)
      .concat(`&content=${content}`))
      .then(res => {
        if (res.data.err) {
          KTApp.unblockPage();
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
          res.data.dataContent.dataList.forEach((data)=>{
            if (commonUtility.isEmpty(data.teacherPhotoUrl)) {
              data.teacherPhotoUrl = '/media/users/user_default.png';
            }
          });
        }
        this.totalCount = res.data.dataContent.totalCount;
        this.pageNumber = res.data.dataContent.currentPageNum;
        this.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
        this.paginationArray = res.data.dataContent.paginationArray;
        this.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
        this.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
        this.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + 1;
        this.toIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + res.data.dataContent.dataList.length;
        this.setStudentAppliedCourse(res.data.dataContent.dataList);
        KTApp.unblockPage();
      })
      .catch(err => {
        KTApp.unblockPage();
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadCourseList: function () {
      KTApp.blockPage({
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: '正在查询...'
      });

      let universityFilter = this.getUniversityFilterCondition();
      axios.get(`/course/center/list?`
      .concat(`pageNumber=${this.pageNumber}`)
      .concat(`&directionID=${this.selectedDirection.directionID}`)
      .concat(`&categoryID=${this.selectedCategory.categoryID}`)
      .concat(`&technologyID=${this.selectedTechnology.technologyID}`)
      .concat(`&universityCode=${universityFilter.universityCode}`)
      .concat(`&schoolID=${universityFilter.schoolID}`)
      .concat(`&isSelf=${universityFilter.isSelf}`))
      .then(res => {
        if (res.data.err) {
          KTApp.unblockPage();
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }

        if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
          res.data.dataContent.dataList.forEach((data)=>{
            if (commonUtility.isEmpty(data.teacherPhotoUrl)) {
              data.teacherPhotoUrl = '/media/users/user_default.png';
            }
          });
        }
        
        this.totalCount = res.data.dataContent.totalCount;
        this.pageNumber = parseInt(res.data.dataContent.currentPageNum);
        this.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
        this.paginationArray = res.data.dataContent.paginationArray;
        this.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
        this.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
        this.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + 1;
        this.toIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + res.data.dataContent.dataList.length;
        this.setStudentAppliedCourse(res.data.dataContent.dataList);
        KTApp.unblockPage();
      })
      .catch(err => {
        KTApp.unblockPage();
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadCourseByStudent: function () {
      KTApp.blockPage({
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: '正在查询...'
      });

      let universityFilter = this.getUniversityFilterCondition();
      axios.get(`/course/center/list/student?`
          .concat(`pageNumber=${this.pageNumber}`)
          .concat(`&directionID=${this.selectedDirection.directionID}`)
          .concat(`&categoryID=${this.selectedCategory.categoryID}`)
          .concat(`&technologyID=${this.selectedTechnology.technologyID}`)
          .concat(`&universityCode=${universityFilter.universityCode}`)
          .concat(`&schoolID=${universityFilter.schoolID}`)
          .concat(`&isSelf=${universityFilter.isSelf}`)
          .concat(`&studentID=${this.loginUser.studentID}`))
          .then(res => {
            if (res.data.err) {
              KTApp.unblockPage();
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }

            if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
              res.data.dataContent.dataList.forEach((data)=>{
                if (commonUtility.isEmpty(data.teacherPhotoUrl)) {
                  data.teacherPhotoUrl = '/media/users/user_default.png';
                }
              });
            }

            this.totalCount = res.data.dataContent.totalCount;
            this.pageNumber = parseInt(res.data.dataContent.currentPageNum);
            this.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
            this.paginationArray = res.data.dataContent.paginationArray;
            this.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
            this.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
            this.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + 1;
            this.toIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + res.data.dataContent.dataList.length;
            this.setStudentAppliedCourse(res.data.dataContent.dataList);
            KTApp.unblockPage();
          })
          .catch(err => {
            KTApp.unblockPage();
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    setStudentAppliedCourse: function (dataList) {
      let that = this;
      if (commonUtility.isEmptyList(dataList)) {
        that.dataList = [];
        return false;
      }
      if (commonUtility.isEmpty(this.loginUser)) {
        dataList.forEach((data) => {
          if (data.dataStatus === '2') {
            data.actionText = '课程结束';
          } else {
            data.isApplied = false;
            data.actionText = '我要报名';
          }
          that.dataList.push(data);
          that.sortCourseList(that.dataList, 'courseID');
        });
        return false;
      }

      that.dataList = [];
      dataList.forEach((data) => {
        axios.get('/course/detail/check/applied'
            .concat(`?studentID=${this.loginUser.studentID}`)
            .concat(`&universityCode=${data.universityCode}`)
            .concat(`&schoolID=${data.schoolID}`)
            .concat(`&courseID=${data.courseID}`))
            .then(res => {
              if (res.data.err) {
                message.error(localMessage.exception(res.data.code, res.data.msg));
                return false;
              }
              if (data.dataStatus === '2') {
                data.actionText = '课程结束';
              } else {
                data.isApplied = res.data.result;
                data.actionText = res.data.result ? '去做任务' : '我要报名';
              }
              that.dataList.push(data);
              that.sortCourseList(that.dataList, 'courseID');
            })
            .catch(err => {
              message.error(localMessage.NETWORK_ERROR);
            })
      });
    },
    sortCourseList: function (array,key) {
      return array.sort(function(a,b){
        let x = a[key];
        let y = b[key];
        return ((x<y)?-1:(x>y)?1:0)
      })
    },
    onFirstPage: function () {
      if (this.pageNumber === 1) {
        return false;
      }
      this.pageNumber = 1;
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onPrePage: function () {
      if (this.pageNumber === 1) {
        return false;
      }
      this.pageNumber--;
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onPagination: function (pageNumber) {
      if (this.pageNumber === pageNumber) {
        return false;
      }
      this.pageNumber = pageNumber;
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onNextPage: function () {
      if (this.pageNumber === this.maxPageNumber) {
        return false;
      }
      this.pageNumber++;
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    },
    onLastPage: function () {
      if (this.pageNumber === this.maxPageNumber) {
        return false;
      }
      this.pageNumber = this.maxPageNumber;
      if (this.selectedCourseFilter.filterID === 1) {
        this.loadCourseByStudent();
      } else {
        this.loadCourseList();
      }
    }
  },
  mounted() {
    this.initPage();
  },
});