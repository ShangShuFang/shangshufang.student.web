const register = new Vue({
  el: '#kt_register',
  data: {
      universityList: [],
      selectedUniversity: {universityCode: 0, universityName: '请选择高校'},
      schoolList: [],
      selectedSchool: {schoolID: 0, schoolName: '请选择学院'},
      majorList: [],
      selectedMajor: {majorID: 0, majorName: '请选择专业'},
      studentName: '',
      cellphone: '',
      validCode: '',
      password: '',
      confirmPassword: '',
      showError: false,
      errorMessage: ''
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
            _this.showError = true;
            _this.errorMessage = res.data.msg;
            return false;
          }
          _this.universityList = res.data.dataList;
        })
        .catch(error => {
          _this.showError = true;
          _this.errorMessage = localMessage.NETWORK_ERROR;
        });
      },
      loadSchool: function () {
        if (this.selectedUniversity.universityCode === 0) {
          this.selectedSchool = {schoolID: 0, schoolName: '请选择学院'};
          this.schoolList = [];
          return false;
        }
        let _this = this;
        axios.get(`/common/school?universityCode=${this.selectedUniversity.universityCode}`)
        .then(res => {
          if (res.data.err) {
            _this.showError = true;
            _this.errorMessage = res.data.msg;
            return false;
          }
          _this.selectedSchool = {schoolID: 0, schoolName: '请选择学院'};
          _this.schoolList = res.data.dataList;
        })
        .catch(error => {
          _this.showError = true;
          _this.errorMessage = localMessage.NETWORK_ERROR;
        });
      },
      loadMajor: function () {

      },
      onUniversityChange: function (code, name) {
        this.selectedUniversity = {universityCode: code, universityName: name};
        this.loadSchool();
      },
      onSchoolChange: function (id, name) {
        this.selectedSchool = {schoolID: id, schoolName: name}
      },
      onMajorChange: function (id, name) {
        this.selectedMajor = {majorID: id, majorName: name}
      },
      checkPreSendValidCode: function () {},
      onSendValidCode: function () {},
      checkPreRegister: function () {},
      onRegister: function () {}
  },
  mounted() {
      this.initPage();
  },
});