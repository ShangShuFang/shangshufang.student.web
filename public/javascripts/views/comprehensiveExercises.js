const app = new Vue({
    el: '#app',
    data: {
        directionList: [
            { directionCode: 1, directionName: '服务端' }
            // { directionCode: 2, directionName: '前端' },
            // { directionCode: 3, directionName: '数据库' },
            // { directionCode: 4, directionName: '全栈' }
        ],
        selectedDirection: { directionCode: 0, directionName: '全部' },

        difficultyLevelList: [
            { difficultyLevelCode: 1, difficultyLevelName: '入门' },
            { difficultyLevelCode: 2, difficultyLevelName: '简单' },
            { difficultyLevelCode: 3, difficultyLevelName: '中等' },
            { difficultyLevelCode: 4, difficultyLevelName: '较难' },
            { difficultyLevelCode: 5, difficultyLevelName: '困难' }
        ],
        selectedDifficultyLevel: { difficultyLevelCode: 0, difficultyLevelName: '全部难度' },

        fromIndex: 0,
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
        initPage: function() {
            commonUtility.setNavActive(5);
            this.loadData();
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

        loadData: function() {
            KTApp.blockPage({
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: '正在查询...'
            });
            let that = this;
            axios.get(`/exercises/comprehensive/list?`
                    .concat(`pageNumber=${this.pageNumber}`)
                    .concat(`&direction=${this.selectedDirection.directionCode}`)
                    .concat(`&difficulty=${this.selectedDifficultyLevel.difficultyLevelCode}`))
                .then(res => {
                    if (res.data.err) {
                        KTApp.unblockPage();
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    this.dataList = res.data.dataContent.dataList;
                    this.totalCount = res.data.dataContent.totalCount;
                    this.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    this.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                    this.paginationArray = res.data.dataContent.paginationArray;
                    this.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
                    this.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
                    this.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + 1;
                    this.toIndex = res.data.dataContent.dataList === null ? 0 : (this.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + res.data.dataContent.dataList.length;

                    if (!commonUtility.isEmpty(this.loginUser) && !commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach((data) => {
                            axios.get(`/exercises/comprehensive/check/collected?studentID=${this.loginUser.studentID}&exercisesID=${data.exercisesID}`)
                                .then(checkRes => {
                                    if (!checkRes.data.err) {
                                        data.isCollected = checkRes.data.isCollected;
                                        that.dataList.push(data);
                                    }
                                })
                                .catch(err => {
                                    message.error(localMessage.NETWORK_ERROR);
                                });
                        });
                    }


                    KTApp.unblockPage();
                })
                .catch(err => {
                    KTApp.unblockPage();
                    message.error(localMessage.NETWORK_ERROR);
                });
        },

        onCollect: function(data) {
            //TODO: 判断是否登陆
            if (!data.isCollected) {
                //收藏
                axios.post('/exercises/comprehensive/add', {
                        studentID: this.loginUser.studentID,
                        exercisesID: data.exercisesID,
                        loginUser: this.loginUser.studentID
                    })
                    .then(function(res) {
                        if (res.data.err) {
                            message.error(localMessage.exception(res.data.code, res.data.msg));
                            return false;
                        }
                        data.isCollected = !data.isCollected;
                    })
                    .catch(function(error) {
                        message.error(localMessage.NETWORK_ERROR);
                    });
            } else {
                //取消收藏
                axios.delete(`/exercises/comprehensive/delete?studentID=${this.loginUser.studentID}&exercisesID=${data.exercisesID}`)
                    .then(res => {
                        if (res.data.err) {
                            message.error(localMessage.exception(res.data.code, res.data.msg));
                            return false;
                        }
                        data.isCollected = !data.isCollected;
                    })
                    .catch(err => {
                        message.error(localMessage.NETWORK_ERROR);
                    });
            }

        },
        onFilterByDirection: function(code, name) {
            if (this.selectedDirection.directionCode === code) {
                return false;
            }
            this.selectedDirection = { directionCode: code, directionName: name };
            this.pageNumber = 1;
            this.loadData();
        },
        onFilterByLanguage: function(code, name) {
            if (this.programLanguage.languageCode === code) {
                return false;
            }
            this.programLanguage = { languageCode: code, languageName: name };
            this.pageNumber = 1;
            this.loadData();
        },
        onFilterByDifficulty: function(code, name) {
            if (this.selectedDifficultyLevel.difficultyLevelCode === code) {
                return false;
            }
            this.selectedDifficultyLevel = { difficultyLevelCode: code, difficultyLevelName: name };
            this.pageNumber = 1;
            this.loadData();
        },
        onFirstPage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber = 1;
            this.loadData();
        },
        onPrePage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber--;
            this.loadData();
        },
        onPagination: function(pageNumber) {
            if (this.pageNumber === pageNumber) {
                return false;
            }
            this.pageNumber = pageNumber;
            this.loadData();
        },
        onNextPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber++;
            this.loadData();
        },
        onLastPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber = this.maxPageNumber;
            this.loadData();
        }
    },
    mounted() {
        this.initPage();
    },
});