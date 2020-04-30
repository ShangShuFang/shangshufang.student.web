const register = new Vue({
  el: '#kt_changePassword',
  data: {
    oldPassword: '',
    showOldPasswordAlert: false,
    oldPasswordAlertMessage: '',

    password: '',
    showPasswordAlert: false,
    passwordAlertMessage: '',

    confirmPassword: '',
    showConfirmPasswordAlert: false,
    confirmPasswordAlertMessage: '',

    loginUser: commonUtility.getLoginUser()
  },
  methods: {
    initPage: function () {
      if (this.loginUser === null) {
        location.href = '/login';
        return false;
      }
    },
    checkPreChange: function () {
      let checkPass = true;
      this.showOldPasswordAlert = commonUtility.isEmpty(this.oldPassword);
      this.oldPasswordAlertMessage = commonUtility.isEmpty(this.oldPassword) ? localMessage.OLD_PASSWORD_EMPTY : '';
      checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.oldPassword);

      this.showPasswordAlert = commonUtility.isEmpty(this.password);
      this.passwordAlertMessage = commonUtility.isEmpty(this.password) ? localMessage.NEW_PASSWORD_EMPTY : '';
      checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.password);

      this.showConfirmPasswordAlert = commonUtility.isEmpty(this.confirmPassword);
      this.confirmPasswordAlertMessage = commonUtility.isEmpty(this.confirmPassword) ? localMessage.CONFIRM_NEW_PASSWORD_EMPTY : '';
      checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.confirmPassword);

      if (!commonUtility.isEmpty(this.password) && !commonUtility.isEmpty(this.confirmPassword)) {
        this.showConfirmPasswordAlert = this.password !== this.confirmPassword;
        this.confirmPasswordAlertMessage = this.password !== this.confirmPassword ? localMessage.CONFIRM_PASSWORD_ERROR: '';
        checkPass = !checkPass ? checkPass : this.password === this.confirmPassword;
      }

      return checkPass;
    },
    onChange: function () {
      if (!this.checkPreChange()) {
        return false;
      }

      let _this = this;
      //判断密码是否正确
      axios.post('/login', {
        cellphone: this.loginUser.cellphone,
        password: this.oldPassword
      })
      .then(function (res) {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        //旧密码不正确
        if (!res.data.accountValid) {
          _this.showOldPasswordAlert = true;
          _this.oldPasswordAlertMessage = localMessage.OLD_PASSWORD_ERROR;
          return false;
        }
        //旧密码验证通过
        axios.put('/changePassword/change', {
          studentID: _this.loginUser.studentID,
          universityCode: _this.loginUser.universityCode,
          schoolID: _this.loginUser.schoolID,
          password: _this.password,
          loginUser: _this.loginUser.studentID
        })
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          
          _this.oldPassword = '';
          _this.password= '';
          _this.confirmPassword = '';
          message.success('密码修改成功！');
        })
        .catch(err => {
          message.error(localMessage.NETWORK_ERROR);
        });
      })
      .catch(function (error) {
        message.error(localMessage.NETWORK_ERROR);
      });
    }
  },
  mounted() {
    this.initPage();
  },
});