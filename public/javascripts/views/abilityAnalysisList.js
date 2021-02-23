const app = new Vue({
    el: '#app',
    data: {
        loginUser: commonUtility.getLoginUser(),
        isLogin: commonUtility.isLogin(),
        directionList: [],
        selectedDirection: { directionID: 0, directionName: '全部' },

        categoryList: [],
        selectedCategory: { categoryID: 0, categoryName: '全部' },

        technologyList: [],
        selectedTechnology: { technologyID: 0, technologyName: '全部' },

        universityFilterList: [],
        selectedUniversityFilter: { filterID: 0, filterName: '全部院校' },

        studentName: '',

        fromIndex: 0,
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
        initPage: function() {
            tracking.view(trackingSetting.view.otherGrade);
            commonUtility.setNavActive(4);
            this.loadDirectionList();
            this.loadTechnologyCategoryList();
            this.loadTechnologyList();
            this.loadUniversityFilterList();
            this.loadStudentList();
        },
        loadDirectionList: function() {
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
        loadTechnologyCategoryList: function() {
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
        loadTechnologyList: function() {
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
        loadUniversityFilterList: function() {
            this.universityFilterList.push({ filterID: 0, filterName: '全部院校' });
            this.universityFilterList.push({ filterID: 1, filterName: '我们院校' });
            this.universityFilterList.push({ filterID: 2, filterName: '我们学院' });
        },
        loadStudentList: function() {
            KTApp.blockPage({
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: '正在查询...'
            });

            let universityFilter = this.getUniversityFilterCondition();
            let studentName = commonUtility.isEmpty(this.studentName) ? 'NULL' : this.studentName;
            let studentID = this.isLogin ? this.loginUser.studentID : 0;
            axios.get(`/ability/analysis/list/data?`
                    .concat(`pageNumber=${this.pageNumber}`)
                    .concat(`&directionID=${this.selectedDirection.directionID}`)
                    .concat(`&categoryID=${this.selectedCategory.categoryID}`)
                    .concat(`&technologyID=${this.selectedTechnology.technologyID}`)
                    .concat(`&universityCode=${universityFilter.universityCode}`)
                    .concat(`&schoolID=${universityFilter.schoolID}`)
                    .concat(`&studentName=${studentName}`)
                    .concat(`&studentID=${studentID}`))
                .then(res => {
                    if (res.data.err) {
                        KTApp.unblockPage();
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach((data) => {
                            if (commonUtility.isEmpty(data.photo)) {
                                data.photo = '/media/users/user_default.png';
                            }
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

        onFilterByDirection: function(direction) {
            if ((direction === undefined && this.selectedDirection.directionID === 0) ||
                (direction !== undefined && this.selectedDirection.directionID === direction.directionID)) {
                return false;
            }
            this.selectedDirection = direction === undefined ? { directionID: 0, directionName: '全部' } : { directionID: direction.directionID, directionName: direction.directionName };
            this.selectedCategory = { categoryID: 0, categoryName: '全部' };
            this.selectedTechnology = { technologyID: 0, technologyName: '全部' };
            this.loadTechnologyCategoryList();
            this.loadTechnologyList();
            this.loadStudentList();
        },
        onFilterByCategory: function(category) {
            if ((category === undefined && this.selectedCategory.categoryID === 0 ||
                    (category !== undefined && this.selectedCategory.categoryID === category.technologyCategoryID))) {
                return false;
            }
            this.selectedCategory = category === undefined ? { categoryID: 0, categoryName: '全部' } : { categoryID: category.technologyCategoryID, categoryName: category.technologyCategoryName };
            this.selectedTechnology = { technologyID: 0, technologyName: '全部' };
            this.loadTechnologyList();
            this.loadStudentList();
        },
        onFilterByTechnology: function(technology) {
            if ((technology === undefined && this.selectedTechnology.technologyID === 0 ||
                    (technology !== undefined && this.selectedTechnology.technologyID === technology.technologyID))) {
                return false;
            }
            this.selectedTechnology = technology === undefined ? { technologyID: 0, technologyName: '全部' } : { technologyID: technology.technologyID, technologyName: technology.technologyName };
            this.loadStudentList();
        },
        onFilterByUniversity: function(filter) {
            if (this.selectedUniversityFilter.filterID === filter.filterID) {
                return false;
            }
            this.selectedUniversityFilter = { filterID: filter.filterID, filterName: filter.filterName };
            this.loadStudentList();
        },
        onFilterByName: function(e) {
            let keyCode = e.keyCode;
            if (keyCode === 13) {
                this.loadStudentList();
            }
        },
        getUniversityFilterCondition: function() {
            let filter = { universityCode: 0, schoolID: 0 };
            if (this.loginUser === null) {
                return filter;
            }

            switch (this.selectedUniversityFilter.filterID) {
                case 0:
                    filter = {
                        universityCode: 0,
                        schoolID: 0
                    };
                    break;
                case 1:
                    filter = {
                        universityCode: this.loginUser.universityCode,
                        schoolID: 0
                    };
                    break;
                case 2:
                    filter = {
                        universityCode: this.loginUser.universityCode,
                        schoolID: this.loginUser.schoolID
                    };
                    break;
            }
            return filter;
        },
        onFirstPage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber = 1;
            this.loadStudentList();
        },
        onPrePage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber--;
            this.loadStudentList();
        },
        onPagination: function(pageNumber) {
            if (this.pageNumber === pageNumber) {
                return false;
            }
            this.pageNumber = pageNumber;
            this.loadStudentList();
        },
        onNextPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber++;
            this.loadStudentList();
        },
        onLastPage: function() {
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