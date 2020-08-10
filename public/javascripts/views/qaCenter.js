const app = new Vue({
    el: '#app',
    data: {
        questionModel: {
            pageNumber: 1,
            maxPageNumber: 0,
            totalCount: 0,
            dataList: [],
        },
        answerModel: {
            pageNumber: 1,
            maxPageNumber: 0,
            totalCount: 0,
            dataList: []
        },
        dialogModel: {
            modalTitle: '',
            questionContent: '',
            dataList: []
        },
        loginUser: commonUtility.getLoginUser()
    },
    methods: {
        initPage: function() {
            commonUtility.setUserCenterActive();
            this.loadQuestionList();
            this.loadAnswerList();
        },
        loadQuestionList: function() {
            let that = this;
            axios.get(`/center/qa/list/question?pageNumber=${this.questionModel.pageNumber}&studentID=${this.loginUser.studentID}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    that.questionModel.totalCount = res.data.dataContent.totalCount;
                    that.questionModel.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    that.questionModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);

                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach(function(data) {
                            that.questionModel.dataList.push(data);
                        });
                    }
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        loadMoreQuestion: function() {
            this.questionModel.pageNumber++;
            this.loadQuestionList();
        },
        onShowAnswerModal: function(data) {
            this.dialogModel.modalTitle = `共计${data.leaveMessageCount}条回复`;
            this.dialogModel.questionContent = data.questionContent;
            axios.get(`/center/qa/list/question/answer?questionID=${data.questionID}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    this.dialogModel.dataList = res.data.dataList;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
            $('#modal_answer').modal('show');
        },
        loadAnswerList: function() {
            let that = this;
            axios.get(`/center/qa/list/answer?pageNumber=${this.answerModel.pageNumber}&studentID=${this.loginUser.studentID}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    that.answerModel.totalCount = res.data.dataContent.totalCount;
                    that.answerModel.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    that.answerModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);

                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach(function(data) {
                            that.answerModel.dataList.push(data);
                        });
                    }
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        loadMoreAnswer: function() {
            this.answerModel.pageNumber++;
            this.loadAnswerList();
        },
    },
    mounted() {
        this.initPage();
    },
});