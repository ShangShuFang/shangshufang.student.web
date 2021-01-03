const app = new Vue({
    el: '#app',
    data: {
        pageNumber: 1,
        totalCount: 0,
        maxPageNumber: 0,
        dataList: [],
        loginUser: commonUtility.getLoginUser()
    },
    methods: {
        initPage: function() {
            tracking.view(trackingSetting.view.myConcern);
            commonUtility.setUserCenterActive();
            this.loadCollectionList();
        },
        loadCollectionList: function() {
            let that = this;
            axios.get(`/collection/list?pageNumber=${this.pageNumber}&studentID=${this.loginUser.studentID}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    that.totalCount = res.data.dataContent.totalCount;
                    that.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    that.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);

                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach(function(data) {
                            that.dataList.push(data);
                        });
                    }
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onLoadMoreCollect: function() {
            this.pageNumber++;
            this.loadCollectionList();
        },
        onCancel: function(data) {
            let that = this;
            bootbox.confirm({
                message: `您确定不再关注${data.companyAbbreviation}了吗？`,
                buttons: {
                    confirm: {
                        label: '确认',
                        className: 'btn-danger'
                    },
                    cancel: {
                        label: '取消',
                        className: 'btn-secondary'
                    }
                },
                callback: function(result) {
                    if (result) {
                        axios.delete(`/collection/delete?studentID=${that.loginUser.studentID}&companyID=${data.companyID}`)
                            .then(res => {
                                if (res.data.err) {
                                    message.error(localMessage.exception(res.data.code, res.data.msg));
                                    return false;
                                }
                                that.pageNumber = 1;
                                that.dataList = [];
                                that.loadCollectionList();
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