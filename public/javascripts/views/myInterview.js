const app = new Vue({
    el: '#app',
    data: {
        loginUser: commonUtility.getLoginUser(),
        fromIndex: 0,
        toIndex: 0,
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: [],
        paginationArray: [],
        prePageNum: -1,
        nextPageNum: -1,
        detailData: {}
    },
    methods: {
        initPage: function() {
            tracking.view(trackingSetting.view.myInterview);
            this.loadInterviewList();
            commonUtility.setUserCenterActive();
        },
        loadInterviewList: function () {
            let studentID = this.loginUser.studentID;
            let dataStatus = 'NULL';
            let that = this;
            axios.get('/center/my/interview/list'
                .concat(`?pageNumber=${that.pageNumber}`)
                .concat(`&studentID=${studentID}`)
                .concat(`&dataStatus=${dataStatus}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    if (res.data.dataContent.totalCount === 0) {
                        return false;
                    }

                    that.totalCount = res.data.dataContent.totalCount;
                    that.dataList = res.data.dataContent.dataList;
                    that.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    that.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                    that.paginationArray = res.data.dataContent.paginationArray;
                    that.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : parseInt(res.data.dataContent.prePageNum);
                    that.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : parseInt(res.data.dataContent.nextPageNum);
                    that.fromIndex = res.data.dataContent.dataList === null ? 0 : (res.data.dataContent.currentPageNum - 1) * res.data.dataContent.pageSize + 1;
                    that.toIndex = res.data.dataContent.dataList === null ? 0 : (res.data.dataContent.currentPageNum - 1) * res.data.dataContent.pageSize + res.data.dataContent.dataList.length;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onFirstPage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber = 1;
            this.loadInterviewList();
        },
        onPrePage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber--;
            this.loadInterviewList();
        },
        onPagination: function(pageNumber) {
            if (this.pageNumber === pageNumber) {
                return false;
            }
            this.pageNumber = pageNumber;
            this.loadInterviewList();
        },
        onNextPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber++;
            this.loadInterviewList();
        },
        onLastPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber = this.maxPageNumber;
            this.loadInterviewList();
        },
        onShowDetail: function (data) {
            this.detailData = data;
            $('#modal_detail').modal('show');
        },
        onAccept: function (data) {
            let that = this;
            bootbox.confirm({
                message: `您确认参加该企业的面试吗？`,
                buttons: {
                    confirm: {
                        label: '参加',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: '取消',
                        className: 'btn-secondary'
                    }
                },
                callback: function(result) {
                    if (result) {
                        that.changeStatus(data.talentID, '3');
                    }
                }
            });

        },
        onReject: function (data) {
            let that = this;
            bootbox.confirm({
                message: `您确认不参加该企业的面试吗？`,
                buttons: {
                    confirm: {
                        label: '不参加',
                        className: 'btn-danger'
                    },
                    cancel: {
                        label: '取消',
                        className: 'btn-secondary'
                    }
                },
                callback: function(result) {
                    if (result) {
                        that.changeStatus(data.talentID, '4');
                    }
                }
            });
        },
        changeStatus: function (talentID, status) {
            axios.put('/center/my/interview/change/status', {
                talentID: talentID,
                dataStatus: status,
                loginUser: this.loginUser.studentID
            })
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    this.loadInterviewList();
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