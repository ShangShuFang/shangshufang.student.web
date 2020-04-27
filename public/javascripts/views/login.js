const login = new Vue({
  el: '#kt_login',
  data: {
    cellphone: '',
    password: '',
    showError: false,
    errorMessage: ''
  },
  methods: {
    checkData: function () {
      if (commonUtility.isEmpty(this.cellphone)) {
        this.showError = true;
        this.errorMessage = localMessage.CELLPHONE_EMPTY;
        return false;
      }
      if (!commonUtility.isCellphoneNumber(this.cellphone)) {
        this.showError = true;
        this.errorMessage = localMessage.CELLPHONE_INVALID;
        return false;
      }
      if (commonUtility.isEmpty(this.password)) {
        this.showError = true;
        this.errorMessage = localMessage.PASSWORD_EMPTY;
        return false;
      }
      return true;
    },
    onLogin: function () {
      let _this = this;
      if (!_this.checkData()) {
        return false;
      }
      axios.post('/login', {
        cellphone: this.cellphone,
        password: this.password
      })
      .then(function (res) {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        if (!res.data.accountValid) {
          _this.showError = true;
          _this.errorMessage = localMessage.NO_ACCOUNT;
          return false;
        }
        commonUtility.setCookie(Constants.COOKIE_LOGIN_USER, JSON.stringify(res.data.userInfo));
        location.href = '/index';
      })
      .catch(function (error) {
        message.error(localMessage.NETWORK_ERROR);
      });
    }
  }
});