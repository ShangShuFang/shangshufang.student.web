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
            commonUtility.setNavActive(3);
            this.loadCollectionList();
        },
        loadCollectionList: function() {
            let that = this;
            axios.get(`/center/follow/me/list?pageNumber=${this.pageNumber}&studentID=${this.loginUser.studentID}`)
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
        }
    },
    mounted() {
        this.initPage();
    },
});