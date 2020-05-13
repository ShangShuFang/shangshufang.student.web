const register = new Vue({
  el: '#kt_forgetPassword',
  data: {
      cellphone: '',
      showCellphoneAlert: false,
      cellphoneAlertMessage: '',

      validCode: '',
      isSended: false,
      countdown: 60,
      sendValidCodeText: '免费获取验证码',
      showValidCodeAlert: false,
      validCodeAlertMessage: '',

      password: '',
      showPasswordAlert: false,
      passwordAlertMessage: '',

      confirmPassword: '',
      showConfirmPasswordAlert: false,
      confirmPasswordAlertMessage: '',

      step: 1
  },
  methods: {      
      checkPreSendValidCode: function () {
        let checkPass = true;
        this.showCellphoneAlert = commonUtility.isEmpty(this.cellphone);
        this.cellphoneAlertMessage = commonUtility.isEmpty(this.cellphone) ? localMessage.CELLPHONE_EMPTY : '';
        checkPass = !commonUtility.isEmpty(this.cellphone);

        if (!commonUtility.isEmpty(this.cellphone)) {
          this.showCellphoneAlert = !commonUtility.isCellphoneNumber(this.cellphone);
          this.cellphoneAlertMessage = !commonUtility.isCellphoneNumber(this.cellphone) ? localMessage.CELLPHONE_INVALID : '';
          checkPass = commonUtility.isCellphoneNumber(this.cellphone);
        }
        return checkPass;
      },
      startCountdown: function () {
        let timer = setInterval(() => {
          if (this.countdown === 0) {
            this.isSended = false;
            this.countdown = 60;
            this.sendValidCodeText = '免费获取验证码';
            clearInterval(timer);
            return false;
          } else {
            this.countdown--;
            this.sendValidCodeText = `${this.countdown}秒后重新发送`;
          }
        }, 1000);
      },
      onSendValidCode: function () {
        if (!this.checkPreSendValidCode()) {
          return false;
        }
        let _this = this;
        axios.get('/common/verificationCode/generate')
        .then(res => {
          axios.post('/common/verificationCode/send', {
            systemFunction: 'register',
            cellphone: this.cellphone,
            verificationCode: res.data.code,
          })
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            this.isSended = true;
            this.startCountdown();
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
        })
        .catch(err => {
          message.error(localMessage.NETWORK_ERROR);
        });
      },
      check4Step1: function () {
        let checkPass = true;
        
        this.showCellphoneAlert = commonUtility.isEmpty(this.cellphone);
        this.cellphoneAlertMessage = commonUtility.isEmpty(this.cellphone) ? localMessage.CELLPHONE_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.cellphone);

        this.showValidCodeAlert = commonUtility.isEmpty(this.validCode);
        this.validCodeAlertMessage = commonUtility.isEmpty(this.validCode) ? localMessage.VALID_CODE_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.validCode);

        if (!commonUtility.isEmpty(this.cellphone)) {
          this.showCellphoneAlert = !commonUtility.isCellphoneNumber(this.cellphone);
          this.cellphoneAlertMessage = !commonUtility.isCellphoneNumber(this.cellphone) ? localMessage.CELLPHONE_INVALID : '';
          checkPass = !checkPass ? checkPass : commonUtility.isCellphoneNumber(this.cellphone);
        }

        return checkPass;
      },
      check4Step2: function () {
        let checkPass = true;

        this.showPasswordAlert = commonUtility.isEmpty(this.password);
        this.passwordAlertMessage = commonUtility.isEmpty(this.password) ? localMessage.PASSWORD_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.password);

        this.showConfirmPasswordAlert = commonUtility.isEmpty(this.confirmPassword);
        this.confirmPasswordAlertMessage = commonUtility.isEmpty(this.confirmPassword) ? localMessage.CONFIRM_PASSWORD_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.confirmPassword);

        if (!commonUtility.isEmpty(this.password) && !commonUtility.isEmpty(this.confirmPassword)) {
          this.showConfirmPasswordAlert = this.password !== this.confirmPassword;
          this.confirmPasswordAlertMessage = this.password !== this.confirmPassword ? localMessage.CONFIRM_PASSWORD_ERROR: '';
          checkPass = !checkPass ? checkPass : this.password === this.confirmPassword;
        }
        return checkPass;
      },
      onStep1: function () {
        if (!this.check4Step1()) {
          return false;
        }
        //判断手机号码是否存在
        let _this = this;
        axios.get(`/forgetPassword/checkCellphone?cellphone=${_this.cellphone}`)
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          if (!res.data.exist) {
            _this.showCellphoneAlert = true;
            _this.cellphoneAlertMessage = localMessage.CELLPHONE_NOT_EXISTS;
            return false;
          }
          //#region 判断验证码是否正确
          axios.get(`/common/verificationCode/check?cellphone=${_this.cellphone}&code=${_this.validCode}`)
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (!res.data.result) {
              _this.showValidCodeAlert = true;
              _this.validCodeAlertMessage = res.data.msg;
              return false;
            }
            this.step = 2;
          })
          .catch(error => {
            message.error(localMessage.NETWORK_ERROR);
          });
          //#endregion
        })
        .catch(error => {
          message.error(localMessage.NETWORK_ERROR);
        });
      },
      onStep2: function () {
        if (!this.check4Step2()) {
          return false;
        }
        // 修改密码
        let _this = this;
        axios.put('/forgetPassword/change', {
          cellphone: _this.cellphone,
          password: _this.password,
          loginUser: 0
        })
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          this.step = 3;
        })
        .catch(err => {
          message.error(localMessage.NETWORK_ERROR);
        });
      },
      onPreStep: function () {
        this.step = 1;
      }
  }
});