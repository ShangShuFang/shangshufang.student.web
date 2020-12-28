const app = new Vue({
    el: '#app',
    data: {
        loginUser: commonUtility.getLoginUser(),
        directionList: [
            { directionCode: 1, directionName: '服务端' }
            // { directionCode: 2, directionName: '前端' },
            // { directionCode: 3, directionName: '数据库' },
            // { directionCode: 4, directionName: '全栈' }
        ],
        selectedDirection: { directionCode: 0, directionName: '全部方向' },

        programLanguageList: [
            {languageCode: 1, languageName: 'Java'},
            {languageCode: 2, languageName: 'Python'}
        ],
        selectedLanguage: {languageCode: 0, languageName: '全部语言'},

        difficultyLevelList: [
            { difficultyLevelCode: 1, difficultyLevelName: '入门' },
            { difficultyLevelCode: 2, difficultyLevelName: '简单' },
            { difficultyLevelCode: 3, difficultyLevelName: '中等' },
            { difficultyLevelCode: 4, difficultyLevelName: '较难' },
            { difficultyLevelCode: 5, difficultyLevelName: '困难' }
        ],
        selectedDifficultyLevel: { difficultyLevelCode: 0, difficultyLevelName: '全部级别' },

        statusList: [
            {statusCode: 'P', statusName: '待批改'},
            {statusCode: 'Y', statusName: '正确'},
            {statusCode: 'N', statusName: '错误'}
        ],
        selectedStatus: { statusCode: 'NULL', statusName: '全部状态' },

        fromIndex: 0,
        toIndex: 0,
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: [],
        paginationArray: [],
        prePageNum: -1,
        nextPageNum: -1,

        modalTitle: '',
        collectionID: 0,
        gitUrl: '',
        gitUrlInValid: false,
        gitUrlInValidMessage: ''

    },
    methods: {
        initPage: function() {
            commonUtility.setUserCenterActive();
            // this.loadDirectionList();
            // this.loadTechnologyCategoryList();
            // this.loadTechnologyList();
            // this.loadStatusList();
            this.loadData();
        },
        //region delete code
        // loadDirectionList: function() {
        //     axios.get('/common/direction/list')
        //         .then(res => {
        //             if (res.data.err) {
        //                 message.error(localMessage.exception(res.data.code, res.data.msg));
        //                 return false;
        //             }
        //             this.directionList = res.data.dataList;
        //         })
        //         .catch(err => {
        //             message.error(localMessage.NETWORK_ERROR);
        //         });
        // },
        // loadTechnologyCategoryList: function() {
        //     axios.get(`/common/technology/category/list?directionID=${this.selectedDirection.directionID}`)
        //         .then(res => {
        //             if (res.data.err) {
        //                 message.error(localMessage.exception(res.data.code, res.data.msg));
        //                 return false;
        //             }
        //             this.categoryList = res.data.dataList;
        //         })
        //         .catch(err => {
        //             message.error(localMessage.NETWORK_ERROR);
        //         });
        // },
        // loadTechnologyList: function() {
        //     axios.get(`/common/technology/simple/list?directionID=${this.selectedDirection.directionID}&categoryID=${this.selectedCategory.technologyCategoryID}`)
        //         .then(res => {
        //             if (res.data.err) {
        //                 message.error(localMessage.exception(res.data.code, res.data.msg));
        //                 return false;
        //             }
        //             this.technologyList = res.data.dataList;
        //         })
        //         .catch(err => {
        //             message.error(localMessage.NETWORK_ERROR);
        //         });
        // },
        // loadStatusList: function() {
        //     this.statusList.push({ statusCode: 'P', statusName: '未提交' });
        //     this.statusList.push({ statusCode: 'A', statusName: '已提交' });
        // },
        //endregion

        onFilterByDirection: function(code, name) {
            if (this.selectedDirection.directionCode === code) {
                return false;
            }
            this.selectedDirection = { directionCode: code, directionName: name };
            this.pageNumber = 1;
            this.loadData();
        },
        onFilterByLanguage: function(code, name) {
            if (this.selectedLanguage.languageCode === code) {
                return false;
            }
            this.selectedLanguage = { languageCode: code, languageName: name };
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
        onFilterByStatus: function(code, name) {
            if (this.selectedStatus.statusCode === code) {
                return false;
            }
            this.selectedStatus = { statusCode: code, statusName: name };
            this.pageNumber = 1;
            this.loadData();
        },
        loadData: function() {
            KTApp.blockPage({
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: '正在查询...'
            });
            axios.get(`/center/comprehensive/list`
                    .concat(`?pageNumber=${this.pageNumber}`)
                    .concat(`&studentID=${this.loginUser.studentID}`)
                    .concat(`&directionCode=${this.selectedDirection.directionCode}`)
                    .concat(`&programLanguage=${this.selectedLanguage.languageCode}`)
                    .concat(`&difficultyLevelCode=${this.selectedDifficultyLevel.difficultyLevelCode}`)
                    .concat(`&dataStatus=${this.selectedStatus.statusCode}`))
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
                    KTApp.unblockPage();
                })
                .catch(err => {
                    KTApp.unblockPage();
                    message.error(localMessage.NETWORK_ERROR);
                });
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
        },
        onShowDialog: function(data) {
            this.gitUrl = data.gitUrl;
            this.gitUrlInValid = false;
            this.gitUrlInValidMessage = '';
            this.collectionID = data.collectionID;
            this.modalTitle = `提交练习地址：${data.exercisesName}`
            $('#modal_submit_git').modal('show');
        },
        onSubmit: function() {
            if (commonUtility.isEmpty(this.gitUrl)) {
                this.gitUrlInValid = true;
                this.gitUrlInValidMessage = '请填写练习在GitHub上的地址';
                return false;
            }
            if (!commonUtility.isUrl(this.gitUrl)) {
                this.gitUrlInValid = true;
                this.gitUrlInValidMessage = '请填写正确的GitHub地址';
                return false;
            }
            this.gitUrlInValid = false;
            axios.put('/center/comprehensive/change', {
                    collectionID: this.collectionID,
                    gitUrl: this.gitUrl,
                    loginUser: this.loginUser.studentID
                })
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    this.loadData();
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });

            $('#modal_submit_git').modal('hide');
        },
        onDelete: function(data) {
            let that = this;
            bootbox.confirm({
                message: `您确定要删除${data.exercisesName}吗？`,
                buttons: {
                    confirm: {
                        label: '确认删除',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: '取消',
                        className: 'btn-secondary'
                    }
                },
                callback: function(result) {
                    if (result) {
                        axios.delete(`/exercises/comprehensive/delete?studentID=${that.loginUser.studentID}&exercisesID=${data.exercisesID}`)
                            .then(res => {
                                if (res.data.err) {
                                    message.error(localMessage.exception(res.data.code, res.data.msg));
                                    return false;
                                }
                                that.loadData();
                            })
                            .catch(err => {
                                message.error(localMessage.NETWORK_ERROR);
                            });
                    }
                }
            });
        }
    },
    mounted() {
        this.initPage();
    },
});