const app = new Vue({
    el: '#app',
    data: {
        suggestTypeList: [],
        selectedSuggestType: {},
        suggestContent: '',
        cellphone: '',
        isCellphoneInvalid: Constants.CHECK_INVALID.DEFAULT,
        loginUserID: 0,
        isSubmitSuccess: false
    },
    methods: {
        initPage: function() {
            tracking.view(trackingSetting.view.feedback);
            if (commonUtility.isLogin()) {
                this.loginUserID = commonUtility.getLoginUser().studentID;
            }
            this.loadSuggestTypeList();
        },
        loadSuggestTypeList: function() {
            axios.get(`/suggest/suggestType`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    this.suggestTypeList = res.data.dataList;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onChooseSuggestType: function(selectedSuggest) {
            this.selectedSuggestType = selectedSuggest;
        },
        onCellphoneBlur: function() {
            if (commonUtility.isEmpty(this.cellphone)) {
                this.isCellphoneInvalid = Constants.CHECK_INVALID.DEFAULT;
                return false;
            }
            if (!commonUtility.isCellphoneNumber(this.cellphone)) {
                this.isCellphoneInvalid = Constants.CHECK_INVALID.INVALID;
                return false;
            }
            this.isCellphoneInvalid = Constants.CHECK_INVALID.VALID;
        },
        checkData: function() {
            if (commonUtility.isEmpty(this.selectedSuggestType.suggestTypeID)) {
                message.info('请选择问题发生的场景！');
                return false;
            }
            if (commonUtility.isEmpty(this.suggestContent)) {
                message.info('请输入该问题的描述内容！');
                return false;
            }
            if (commonUtility.isEmpty(this.cellphone)) {
                message.info('请输入您的手机号码！');
                return false;
            }
            if (this.isCellphoneInvalid !== Constants.CHECK_INVALID.VALID) {
                message.info('您输入的不是有效的手机号码！');
                return false;
            }
            return true;
        },
        onSubmit: function() {
            if (!this.checkData()) {
                return false;
            }
            let that = this;
            let btn = $('#btnSubmitSuggest');
            $(btn).attr('disabled', true);
            KTApp.progress(btn);

            axios.post('/suggest', {
                    suggestTypeID: this.selectedSuggestType.suggestTypeID,
                    suggestContent: this.suggestContent,
                    cellphone: this.cellphone,
                    loginUser: this.loginUserID
                })
                .then(function(res) {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        KTApp.unprogress(btn);
                        that.isSubmitSuccess = false;
                        return false;
                    }
                    that.isSubmitSuccess = true;
                })
                .catch(function(error) {
                    message.error(localMessage.NETWORK_ERROR);
                });
        }
    },
    mounted() {
        this.initPage();
    },
});