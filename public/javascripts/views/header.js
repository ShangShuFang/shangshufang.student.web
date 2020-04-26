const vm = new Vue({
  el: '#kt_header',
  data: {
    isLogin: false,
    userName: '',
    userPhoto: '',
    universityName: '',
    schoolName: '',
    majorName: ''
  },
  methods: {
    setHeader: function () {
      this.isLogin = commonUtility.isLogin();
      const KT_HIDDEN_CLASS = 'kt-hidden';
      let header_logout = $('.header-logout');
      let header_login = $('.header-login');
      if (this.isLogin) {
        $(header_logout).addClass(KT_HIDDEN_CLASS);
        $(header_login).removeClass(KT_HIDDEN_CLASS);
        let userInfo = JSON.parse(commonUtility.getCookie(Constants.COOKIE_LOGIN_USER));
        this.userName = userInfo.fullName;
        this.userPhoto = userInfo.photo;
        if (this.userPhoto.length === 0) {
          this.userPhoto = '/media/users/user_default.png';
        }
        this.universityName = userInfo.universityName;
        this.schoolName = userInfo.schoolName;
        this.majorName = userInfo.majorName;
        return false;
      }
      $(header_logout).removeClass(KT_HIDDEN_CLASS);
      $(header_login).addClass(KT_HIDDEN_CLASS);
    },
    onLogin: function () {
      location.href = '/login';
    },
    onRegister: function () {
      location.href = '/register';
    }
  },
  mounted: function () {
    this.setHeader();
  }
});