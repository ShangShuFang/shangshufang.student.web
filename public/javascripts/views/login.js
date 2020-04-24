const login = new Vue({
  el: '#kt_login',
  data: {
    cellphone: '',
    password: '',
    showError: false,
    errorMessage: '111'
  },
  methods: {
    //测试注册内容11111
    //111
    checkData: function () {
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
          _this.showError = true;
          _this.errorMessage = res.msg;
          return false;
        }
        if (!res.data.accountValid) {
          _this.showError = true;
          _this.errorMessage = '您输入的账号和密码不匹配';
          return false;
        }
        commonUtility.setCookie(Constants.COOKIE_LOGIN_USER, JSON.stringify(res.data.userInfo));
        location.href = '/index';
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
});