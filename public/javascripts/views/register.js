const register = new Vue({
  el: '#kt_register',
  data: {
      universityList: [],
      selectedUniversity: {universityCode: 0, universityName: localMessage.NO_SELECT_UNIVERSITY},
      showUniversityAlert: false,
      universityAlertMessage: '',

      schoolList: [],
      selectedSchool: {schoolID: 0, schoolName: localMessage.NO_SELECT_SCHOOL},
      showSchoolAlert: false,
      schoolAlertMessage: '',

      majorList: [],
      selectedMajor: {majorID: 0, majorName: localMessage.NO_SELECT_MAJOR},
      showMajorAlert: false,
      majorAlertMessage: '',

      studentName: '',
      showStudentNameAlert: false,
      studentNameAlertMessage: '',

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

      registerCompleted: false
  },
  methods: {
      initPage: function () {
        this.loadUniversity();
      },
      loadUniversity: function () {
        let _this = this;
        axios.get('/common/university')
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          _this.universityList = res.data.dataList;
        })
        .catch(error => {
          message.error(localMessage.NETWORK_ERROR);
        });
      },
      loadSchool: function () {
        if (this.selectedUniversity.universityCode === 0) {
          return false;
        }
        let _this = this;
        axios.get(`/common/school?universityCode=${this.selectedUniversity.universityCode}`)
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          _this.schoolList = res.data.dataList;
        })
        .catch(error => {
          message.error(localMessage.NETWORK_ERROR);
        });
      },
      loadMajor: function () {
        if (this.selectedSchool.schoolID === 0) {
          return false;
        }
        let _this = this;
        axios.get(`/common/major?universityCode=${this.selectedUniversity.universityCode}&schoolID=${this.selectedSchool.schoolID}`)
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          _this.majorList = res.data.dataList;
        })
        .catch(error => {
          message.error(localMessage.NETWORK_ERROR);
        });
      },
      onUniversityChange: function (code, name) {
        this.selectedUniversity = {universityCode: code, universityName: name};
        this.selectedSchool = {schoolID: 0, schoolName: localMessage.NO_SELECT_SCHOOL};
        this.schoolList = [];
        this.selectedMajor = {majorID: 0, majorName: localMessage.NO_SELECT_MAJOR};
        this.majorList = [];
        this.loadSchool();
      },
      onSchoolChange: function (id, name) {
        this.selectedSchool = {schoolID: id, schoolName: name};
        this.selectedMajor = {majorID: 0, majorName: localMessage.NO_SELECT_MAJOR};
        this.majorList = [];
        this.loadMajor();
      },
      onMajorChange: function (id, name) {
        this.selectedMajor = {majorID: id, majorName: name}
      },
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
      checkPreRegister: function () {
        let checkPass = true;
        this.showUniversityAlert = this.selectedUniversity.universityCode === 0;
        this.universityAlertMessage = this.selectedUniversity.universityCode === 0 ? localMessage.NO_SELECT_UNIVERSITY : '';
        checkPass = !checkPass ? checkPass : this.selectedUniversity.universityCode !== 0;

        this.showSchoolAlert = this.selectedSchool.schoolID === 0;
        this.schoolAlertMessage = this.selectedSchool.schoolID === 0 ? localMessage.NO_SELECT_SCHOOL : '';
        checkPass = !checkPass ? checkPass : this.selectedSchool.schoolID !== 0;

        this.showMajorAlert = this.selectedMajor.majorID === 0;
        this.majorAlertMessage = this.selectedMajor.majorID === 0 ? localMessage.NO_SELECT_MAJOR : '';
        checkPass = !checkPass ? checkPass : this.selectedMajor.majorID !== 0;

        this.showStudentNameAlert = commonUtility.isEmpty(this.studentName);
        this.studentNameAlertMessage = commonUtility.isEmpty(this.studentName) ? localMessage.STUDENT_NAME_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.studentName);

        this.showCellphoneAlert = commonUtility.isEmpty(this.cellphone);
        this.cellphoneAlertMessage = commonUtility.isEmpty(this.cellphone) ? localMessage.CELLPHONE_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.cellphone);

        this.showValidCodeAlert = commonUtility.isEmpty(this.validCode);
        this.validCodeAlertMessage = commonUtility.isEmpty(this.validCode) ? localMessage.VALID_CODE_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.validCode);

        this.showPasswordAlert = commonUtility.isEmpty(this.password);
        this.passwordAlertMessage = commonUtility.isEmpty(this.password) ? localMessage.PASSWORD_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.password);

        this.showConfirmPasswordAlert = commonUtility.isEmpty(this.confirmPassword);
        this.confirmPasswordAlertMessage = commonUtility.isEmpty(this.confirmPassword) ? localMessage.CONFIRM_PASSWORD_EMPTY : '';
        checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.confirmPassword);

        if (!commonUtility.isEmpty(this.cellphone)) {
          this.showCellphoneAlert = !commonUtility.isCellphoneNumber(this.cellphone);
          this.cellphoneAlertMessage = !commonUtility.isCellphoneNumber(this.cellphone) ? localMessage.CELLPHONE_INVALID : '';
          checkPass = !checkPass ? checkPass : commonUtility.isCellphoneNumber(this.cellphone);
        }

        if (!commonUtility.isEmpty(this.password) && !commonUtility.isEmpty(this.confirmPassword)) {
          this.showConfirmPasswordAlert = this.password !== this.confirmPassword;
          this.confirmPasswordAlertMessage = this.password !== this.confirmPassword ? localMessage.CONFIRM_PASSWORD_ERROR: '';
          checkPass = !checkPass ? checkPass : this.password === this.confirmPassword;
        }
        return checkPass;
      },
      onRegister: function () {
        if (!this.checkPreRegister()) {
          return false;
        }
        //判断手机号码是否已被注册
        let _this = this;
        axios.get(`/register/checkCellphone?cellphone=${_this.cellphone}`)
        .then(res => {
          if (res.data.err) {
            message.error(localMessage.exception(res.data.code, res.data.msg));
            return false;
          }
          if (res.data.exist) {
            _this.showCellphoneAlert = true;
            _this.cellphoneAlertMessage = localMessage.CELLPHONE_REGISTERED;
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

            //#region 提交注册信息
            axios.post('/register', {
              universityCode: this.selectedUniversity.universityCode,
              schoolID: this.selectedSchool.schoolID,
              majorID: this.selectedMajor.majorID,
              fullName: this.studentName,
              cellphone: this.cellphone,
              password: this.password
            })
            .then(function (res) {
              if (res.data.err) {
                message.error(localMessage.exception(res.data.code, res.data.msg));
                return false;
              }
              _this.registerCompleted = true;
            })
            .catch(function (error) {
              message.error(localMessage.NETWORK_ERROR);
            });
            //#endregion
          })
          .catch(error => {
            message.error(localMessage.NETWORK_ERROR);
          });
          //#endregion
        })
        .catch(error => {
          message.error(localMessage.NETWORK_ERROR);
        });
      }
  },
  mounted() {
      this.initPage();
  },
});