const app = new Vue({
  el: '#app',
  data: {
    collectionID: 0,
    exercisesID: 0,
    exercises: {},
    programLanguage: '',
    lanIsValid: false,
    gitUrl: '',
    gitUrlIsValid: false,
    optionType: 'add',
    correctResult: '',
    correctResultText: '',
    isShowResult: false,
    correctMemo: '',
    isShowMemo: false,
    submitText: '提 交',
    submitDisabled: false,
    loginUser: commonUtility.getLoginUser(),
    isLogin: commonUtility.isLogin(),
  },
  methods: {
    initPage: function() {
      if (!this.isLogin) {
        this.exercisesID = $('#hidden_exercisesID').val();
        location.href = `/login??backUrl=/exercises/comprehensive/detail?exercisesID=${this.exercisesID}`;
        return false;
      }
      commonUtility.setNavActive(5);
      this.loadData();
      this.loadResult();
    },
    loadData: function() {
      KTApp.blockPage({
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: '正在查询...'
      });
      let that = this;
      this.exercisesID = $('#hidden_exercisesID').val();
      axios.get(`/exercises/comprehensive/detail/data?`
          .concat(`exercisesID=${this.exercisesID}`))
          .then(res => {
            if (res.data.err) {
              KTApp.unblockPage();
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            this.exercises = res.data.detail;
            KTApp.unblockPage();
          })
          .catch(err => {
            KTApp.unblockPage();
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadResult: function () {
      let that = this;
      this.exercisesID = $('#hidden_exercisesID').val();
      axios.get(`/exercises/comprehensive/detail/result`
          .concat(`?studentID=${this.loginUser.studentID}`)
          .concat(`&exercisesID=${this.exercisesID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (res.data.detail === null) {
              that.optionType = 'add';
              that.submitText = '提 交';
              return false;
            }
            that.collectionID = res.data.detail.collectionID;
            that.programLanguage = res.data.detail.programLanguage.toString();
            that.gitUrl = res.data.detail.gitUrl;
            that.correctResult = res.data.detail.dataStatus;
            that.correctResultText = res.data.detail.dataStatusText;
            that.correctMemo = res.data.detail.memo;
            that.isShowResult = true;
            that.isShowMemo = res.data.detail.dataStatus !== 'P';
            that.optionType = 'upd';
            that.submitText = '修 改';
            if (res.data.detail.dataStatus === 'Y') {
              $('#btnSubmit').attr('disabled', true);
            }
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    add: function () {
      let that = this;
      let btn = $('#btnSubmit');
      $(btn).attr('disabled', true);
      KTApp.progress(btn);
      axios.post('/exercises/comprehensive/detail/add', {
        studentID: this.loginUser.studentID,
        exercisesID: this.exercisesID,
        programLanguage: this.programLanguage,
        gitUrl: this.gitUrl,
        loginUser: this.loginUser.studentID
      })
      .then(function(res) {
        if (res.data.err) {
          KTApp.unprogress(btn);
          $(btn).removeAttr('disabled');
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        KTApp.unprogress(btn);
        that.isShowResult = true;
        that.correctResult = 'P';
        that.correctResultText = '待批改';
        message.success('练习提交成功，两日之内将批改完成！')
      })
      .catch(function(error) {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    change: function () {
      let that = this;
      let btn = $('#btnSubmit');
      this.submitDisabled = true;
      // $(btn).attr('disabled', true);
      KTApp.progress(btn);
      axios.put('/exercises/comprehensive/detail/change', {
        collectionID: this.collectionID,
        studentID: this.loginUser.studentID,
        exercisesID: this.exercisesID,
        programLanguage: this.programLanguage,
        gitUrl: this.gitUrl,
        loginUser: this.loginUser.studentID
      })
      .then(function(res) {
        if (res.data.err) {
          KTApp.unprogress(btn);
          $(btn).removeAttr('disabled');
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        KTApp.unprogress(btn);
        that.isShowResult = true;
        that.correctResult = 'P';
        that.correctResultText = '待批改';
        message.success('练习提交成功，两日之内将批改完成！')
      })
      .catch(function(error) {
        KTApp.unprogress(btn);
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    checkData: function () {
      let result = true;
      this.lanIsValid = false;
      this.gitUrlIsValid = false;
      if (commonUtility.isEmpty(this.programLanguage)) {
        this.lanIsValid = true;
        result = false;
      }
      if (commonUtility.isEmpty(this.gitUrl)) {
        this.gitUrlIsValid = true;
        result = false;
      }
      return result;
    },
    onSubmit: function () {
      if (!this.checkData()) {
        return false;
      }
      if (this.optionType === 'add') {
        this.add();
        return false;
      }
      this.change();

    }
  },
  mounted() {
    this.initPage();
  },
});