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
        initPage: function() {
            commonUtility.setNavActive(6);
            this.loadCompany();
        },
        loadCompany: function() {
            let that = this;
            axios.get(`/recruit_standard/list?pageNumber=${that.pageNumber}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    if (commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        return false;
                    }

                    that.totalCount = res.data.dataContent.totalCount;
                    that.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    that.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                    that.paginationArray = res.data.dataContent.paginationArray;
                    that.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : res.data.dataContent.prePageNum;
                    that.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : res.data.dataContent.nextPageNum;
                    that.fromIndex = res.data.dataContent.dataList === null ? 0 : (that.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + 1;
                    that.toIndex = res.data.dataContent.dataList === null ? 0 : (that.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_16 + res.data.dataContent.dataList.length;


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

        onFirstPage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber = 1;
            this.loadCompany();
        },
        onPrePage: function() {
            if (this.pageNumber === 1) {
                return false;
            }
            this.pageNumber--;
            this.loadCompany();
        },
        onPagination: function(pageNumber) {
            if (this.pageNumber === pageNumber) {
                return false;
            }
            this.pageNumber = pageNumber;
            this.loadCompany();
        },
        onNextPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber++;
            this.loadCompany();
        },
        onLastPage: function() {
            if (this.pageNumber === this.maxPageNumber) {
                return false;
            }
            this.pageNumber = this.maxPageNumber;
            this.loadCompany();
        },


        // onLoadMore: function() {
        //     this.pageNumber++;
        //     this.loadCompany();
        // },

        onShowDetail: function(company) {
            this.companyModalTitle = company.companyAbbreviation;
            axios.get(`/recruit_standard/technology/using?companyID=${company.companyID}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    if (commonUtility.isEmptyList(res.data.dataList)) {
                        return false;
                    }

                    this.technologyList = res.data.dataList
                    $('#modal_using_technology').modal('show');
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onCollect: function(company) {
            if (company.isCollect === 1) {
                this.cancelCollect(company);
                return false;
            }
            this.addCollect(company);
        },
        addCollect: function(company) {
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
        cancelCollect: function(company) {
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