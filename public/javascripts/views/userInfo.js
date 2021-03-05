const register = new Vue({
    el: '#app',
    data: {
        universityList: [],
        selectedUniversity: { universityCode: 0, universityName: localMessage.NO_SELECT_UNIVERSITY },
        showUniversityAlert: false,
        universityAlertMessage: '',

        schoolList: [],
        selectedSchool: { schoolID: 0, schoolName: localMessage.NO_SELECT_SCHOOL },
        showSchoolAlert: false,
        schoolAlertMessage: localMessage.NO_SELECT_SCHOOL,

        majorList: [],
        selectedMajor: { majorID: 0, majorName: localMessage.NO_SELECT_MAJOR },
        showMajorAlert: false,
        majorAlertMessage: localMessage.NO_SELECT_MAJOR,

        educationLevelList: [
            {levelID: 1, levelName: '大专'},
            {levelID: 2, levelName: '本科'},
            {levelID: 3, levelName: '硕士'},
            {levelID: 4, levelName: '博士'},
        ],
        selectEducationLevel: {levelID: 0, levelName: localMessage.NO_SELECT_EDUCATION_LEVEL},

        studentName: '',
        showStudentNameAlert: false,
        studentNameAlertMessage: localMessage.STUDENT_NAME_EMPTY,

        photo: '',
        defaultPhoto: '/media/users/user_default.png',
        sex: '',

        cellphone: '',
        showCellphoneAlert: false,
        cellphoneAlertMessage: localMessage.CELLPHONE_EMPTY,

        birth: '',
        enrollmentYear: '',
        graduationDate: '',

        email: '',
        showEmailAlert: false,
        emailAlertMessage: localMessage.EMAIL_INVALID,
        selfIntroductionUrl: '',

        loginUser: commonUtility.getLoginUser()
    },
    methods: {
        initPage: function() {
            if (this.loginUser === null) {
                location.href = '/login';
                return false;
            }
            tracking.view(trackingSetting.view.myInformation);
            commonUtility.setUserCenterActive();
            this.graduationDate = this.loginUser.graduationDate;
            this.selfIntroductionUrl = this.loginUser.selfIntroductionUrl;
            let level = this.educationLevelList.find((level) => level.levelID === this.loginUser.educationLevel);
            if (!commonUtility.isEmpty(level)) {
                this.selectEducationLevel = level;
            }
            this.studentName = this.loginUser.fullName;
            this.photo = commonUtility.isEmpty(this.loginUser.photo) ? this.defaultPhoto : this.loginUser.photo;
            this.sex = this.loginUser.sex;
            if (!commonUtility.isEmpty(this.loginUser.birth)) {
                this.birth = this.loginUser.birth;
            }
            if (!commonUtility.isEmpty(this.loginUser.enrollmentYear)) {
                this.enrollmentYear = this.loginUser.enrollmentYear;
            }
            this.cellphone = this.loginUser.cellphone;
            this.email = this.loginUser.email;
            this.loadUniversity();
        },
        loadUniversity: function() {
            let _this = this;
            axios.get('/common/university')
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    _this.universityList = res.data.dataList;
                    _this.selectedUniversity = { universityCode: _this.loginUser.universityCode, universityName: _this.loginUser.universityName };
                    _this.loadSchool();
                })
                .catch(error => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        loadSchool: function() {
            let _this = this;
            axios.get(`/common/school?universityCode=${this.selectedUniversity.universityCode}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    _this.schoolList = res.data.dataList;
                    if (_this.selectedUniversity.universityCode === _this.loginUser.universityCode) {
                        _this.selectedSchool = { schoolID: _this.loginUser.schoolID, schoolName: _this.loginUser.schoolName };
                    }
                    _this.loadMajor();
                })
                .catch(error => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        loadMajor: function() {
            if (this.selectedUniversity.universityCode === 0 || this.selectedSchool.schoolID === 0) {
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
                    if (_this.selectedUniversity.universityCode === _this.loginUser.universityCode && _this.selectedSchool.schoolID === _this.loginUser.schoolID) {
                        _this.selectedMajor = { majorID: _this.loginUser.majorID, majorName: _this.loginUser.majorName };
                    }
                })
                .catch(error => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onUniversityChange: function(code, name) {
            this.selectedUniversity = { universityCode: code, universityName: name };
            this.selectedSchool = { schoolID: 0, schoolName: localMessage.NO_SELECT_SCHOOL };
            this.showSchoolAlert = true;
            this.schoolList = [];
            this.selectedMajor = { majorID: 0, majorName: localMessage.NO_SELECT_MAJOR };
            this.showMajorAlert = true;
            this.majorList = [];
            this.loadSchool();
        },
        onSchoolChange: function(id, name) {
            this.selectedSchool = { schoolID: id, schoolName: name };
            this.showSchoolAlert = id === 0;
            this.selectedMajor = { majorID: 0, majorName: localMessage.NO_SELECT_MAJOR };
            this.showMajorAlert = true;
            this.majorList = [];
            this.loadMajor();
        },
        onMajorChange: function(id, name) {
            this.showMajorAlert = id === 0;
            this.selectedMajor = { majorID: id, majorName: name }
        },
        onEducationLevelChange: function(id, name) {
            this.selectEducationLevel = { levelID: id, levelName: name }
        },
        checkPreChange: function() {
            let checkPass = true;
            this.showUniversityAlert = this.selectedUniversity.universityCode === 0;
            checkPass = !checkPass ? checkPass : this.selectedUniversity.universityCode !== 0;

            this.showSchoolAlert = this.selectedSchool.schoolID === 0;
            checkPass = !checkPass ? checkPass : this.selectedSchool.schoolID !== 0;

            this.showMajorAlert = this.selectedMajor.majorID === 0;
            checkPass = !checkPass ? checkPass : this.selectedMajor.majorID !== 0;

            this.showStudentNameAlert = commonUtility.isEmpty(this.studentName);
            this.studentNameAlertMessage = commonUtility.isEmpty(this.studentName) ? localMessage.STUDENT_NAME_EMPTY : '';
            checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.studentName);

            this.showCellphoneAlert = commonUtility.isEmpty(this.cellphone);
            this.cellphoneAlertMessage = commonUtility.isEmpty(this.cellphone) ? localMessage.CELLPHONE_EMPTY : '';
            checkPass = !checkPass ? checkPass : !commonUtility.isEmpty(this.cellphone);

            if (!commonUtility.isEmpty(this.cellphone)) {
                this.showCellphoneAlert = !commonUtility.isCellphoneNumber(this.cellphone);
                this.cellphoneAlertMessage = !commonUtility.isCellphoneNumber(this.cellphone) ? localMessage.CELLPHONE_INVALID : '';
                checkPass = !checkPass ? checkPass : commonUtility.isCellphoneNumber(this.cellphone);
            }

            if (!commonUtility.isEmpty(this.email)) {
                this.showEmailAlert = !commonUtility.isEmail(this.email);
                this.emailAlertMessage = !commonUtility.isEmail(this.email) ? localMessage.EMAIL_INVALID : '';
                checkPass = !checkPass ? checkPass : commonUtility.isEmail(this.email);
            }

            return checkPass;
        },
        changeUserInfo: function() {
            let userInfo = {
                studentID: this.loginUser.studentID,
                universityCode: this.selectedUniversity.universityCode,
                universityName: this.selectedUniversity.universityName,
                schoolID: this.selectedSchool.schoolID,
                schoolName: this.selectedSchool.schoolName,
                majorID: this.selectedMajor.majorID,
                majorName: this.selectedMajor.majorName,
                educationLevel: this.selectEducationLevel.levelID,
                fullName: this.studentName,
                sex: this.sex,
                birth: this.birth,
                enrollmentYear: this.enrollmentYear,
                graduationDate: this.graduationDate,
                cellphone: this.cellphone,
                email: this.email,
                photo: this.photo === this.defaultPhoto ? '' : this.photo,
                selfIntroductionUrl: this.selfIntroductionUrl,
                loginUser: this.loginUser.studentID
            };
            axios.put('/center/my/info/change', userInfo)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    commonUtility.delCookie(Constants.COOKIE_LOGIN_USER);
                    commonUtility.setCookie(Constants.COOKIE_LOGIN_USER, JSON.stringify(userInfo));
                    message.success('保存成功！');
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onChange: function() {
            if (!this.checkPreChange()) {
                return false;
            }
            //判断手机号码是否已被注册
            let _this = this;
            axios.get(`/register/checkCellphone?cellphone=${this.cellphone}`)
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    if (res.data.exist && _this.cellphone !== _this.loginUser.cellphone) {
                        _this.showCellphoneAlert = true;
                        _this.cellphoneAlertMessage = localMessage.CELLPHONE_REGISTERED;
                        return false;
                    }

                    if (commonUtility.isEmpty(_this.email)) {
                        _this.changeUserInfo();
                        return false;
                    }

                    //#region 判断电子邮件是否已注册
                    axios.get(`/common/email/check?email=${_this.email}`)
                        .then(res => {
                            if (res.data.err) {
                                message.error(localMessage.exception(res.data.code, res.data.msg));
                                return false;
                            }
                            if (res.data.exist && _this.email !== _this.loginUser.email) {
                                _this.showEmailAlert = true;
                                _this.emailAlertMessage = localMessage.EMAIL_REGISTERED;
                                return false;
                            }
                            _this.changeUserInfo();
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
        },
        onUpload: function() {
            $('#form-control-photo').trigger('click');
        },
        onFileChange: function(e) {
            let that = this;
            let uploadDir = { "dir1": "university", "dir2": this.loginUser.universityCode, "dir3": "student", "dir4": this.loginUser.studentID };
            let uploadUrl = commonUtility.buildSystemRemoteUri(Constants.UPLOAD_SERVICE_URI, uploadDir);

            let file = e.target.files[0];
            let formData = new FormData();
            formData.append('file', file);
            axios.post(uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    that.photo = res.data.fileUrlList[0];
                })
                .catch(err => {
                    message.error(localMessage.UPLOAD_FAILED);
                });
        },
        onUploadVideo: function () {
            $('#form-control-video').trigger('click');
        },
        onVideoChange: function (e) {
            KTApp.block('#portlet_content', {
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: '上传中...'
            });
            let that = this;
            let uploadDir = { "dir1": "university", "dir2": this.loginUser.universityCode, "dir3": "student", "dir4": this.loginUser.studentID };
            let uploadUrl = commonUtility.buildSystemRemoteUri(Constants.UPLOAD_SERVICE_URI, uploadDir);

            let file = e.target.files[0];
            let formData = new FormData();
            formData.append('file', file);
            axios.post(uploadUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    that.selfIntroductionUrl = res.data.fileUrlList[0];
                    KTApp.unblock('#portlet_content');
                })
                .catch(err => {
                    message.error(localMessage.UPLOAD_FAILED);
                    KTApp.unblock('#portlet_content');
                });
        }
    },
    mounted() {
        this.initPage();
    },
});