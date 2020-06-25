const app = new Vue({
    el: '#app',
    data: {
        commonModel: {
            universityCode: 0,
            schoolID: 0,
            courseID: 0,
            applied: false,
            loginUser: null
        },
        courseModel: {
            detail: {}
        },
        courseScheduleModel: {
            weeklyDayList: [
                { day: 1, dayText: '周一' },
                { day: 2, dayText: '周二' },
                { day: 3, dayText: '周三' },
                { day: 4, dayText: '周四' },
                { day: 5, dayText: '周五' },
                { day: 6, dayText: '周六' },
                { day: 7, dayText: '周日' },
            ],
            courseList: [
                { order: 1, orderText: '第一节', time: '08:00~08:45' },
                { order: 2, orderText: '第二节', time: '09:00~09:45' },
                { order: 3, orderText: '第三节', time: '10:00~10:45' },
                { order: 4, orderText: '第四节', time: '11:00~11:45' },
                { order: 5, orderText: '第五节', time: '14:00~14:45' },
                { order: 6, orderText: '第六节', time: '15:00~15:45' },
                { order: 7, orderText: '第七节', time: '16:00~16:45' },
                { order: 8, orderText: '第八节', time: '17:00~17:45' }
            ],
            dataList: []
        },
        coursePlanModel: {
            dataList: []
        },
        courseStudentModel: {
            fromIndex: 0,
            toIndex: 0,
            pageNumber: 1,
            totalCount: 0,
            maxPageNumber: 0,
            dataList: [],
            paginationArray: [],
            prePageNum: -1,
            nextPageNum: -1
        },
        courseOnlineQuestionModel: {
            pageNumber: 1,
            totalCount: 0,
            maxPageNumber: 0,
            dataList: []
        },
        leaveMessageModel: {
            questionID: 0,
            questionerName: '',
            commenterUniversityCode: 0,
            commenterSchoolID: 0,
            commenterID: 0,
            commenterType: 'S',
            messageContent: '',
            showAlert: false
        },
        courseExercisesModel: {
            dataList: []
        },
        knowledgeExercisesModel: {
            courseClass: 0,
            dataList: []
        },
        courseMyExercisesModel: {
            isShow: false,
            fromIndex: 0,
            toIndex: 0,
            pageNumber: 1,
            totalCount: 0,
            maxPageNumber: 0,
            dataList: [],
            paginationArray: [],
            prePageNum: -1,
            nextPageNum: -1,
            filterStatus: 'NULL',
            studentName: 'NULL'
        },
        courseOtherExercisesModel: {
            isShow: false,
            fromIndex: 0,
            toIndex: 0,
            pageNumber: 1,
            totalCount: 0,
            maxPageNumber: 0,
            dataList: [],
            paginationArray: [],
            prePageNum: -1,
            nextPageNum: -1,
            filterStatus: 'NULL',
            studentName: ''
        },
        reviewHistoryModel: {
            exercisesID: 0,
            exercisesName: '',
            totalCount: 0,
            pageNumber: 1,
            maxPageNumber: 0,
            dataList: []
        },
        exercisesGitModel: {
            courseClass: 0,
            studentExercisesID: 0,
            exercisesName: '',
            sourceCodeGitUrl: '',
            showAlert: false
        },
        reviewModel: {
            courseUniversityCode: 0,
            courseSchoolID: 0,
            courseID: 0,
            courseClass: 0,
            exercisesID: 0,

            studentID: '',
            studentName: '',
            studentUniversityCode: 0,
            studentUniversityName: '',
            studentSchoolID: 0,
            studentSchoolName: '',
            languageID: 0,
            technologyID: 0,
            technologyName: '',
            learningPhaseName: '',
            knowledgeName: '',
            exercisesDocumentUrl: '',
            exercisesDocumentName: '',
            exercisesAnswerUrl: '',
            sourceCodeSubmitTime: '',
            sourceCodeGitUrl: '',

            compilationResult: REVIEW_RESULT.INIT,
            runResult: REVIEW_RESULT.INIT,
            codeStandardResult: REVIEW_RESULT.INIT,
            reviewResult: REVIEW_RESULT.INIT,
            reviewMemo: '',
            codeStandardList: [],
            codeStandardErrorList: []
        }
    },
    methods: {
        initPage: function() {
            commonUtility.setNavActive(2);
            if (!this.checkParameter()) {
                message.error(localMessage.PARAMETER_ERROR);
                return false;
            }
            this.getParameter();
            this.loadCourseDetail();
            this.loadApplyStudent();
            this.loadCourseExercises();
            this.loadOnlineQuestion();
            this.loadMyExercises();
            this.loadOtherExercises();
        },
        checkParameter: function() {
            let universityCode = commonUtility.getUriParameter('universityCode');
            let schoolID = commonUtility.getUriParameter('schoolID');
            let courseID = commonUtility.getUriParameter('courseID');
            return !(!commonUtility.isNumber(universityCode) || !commonUtility.isNumber(schoolID) || !commonUtility.isNumber(courseID));
        },
        getParameter: function() {
            this.commonModel.universityCode = commonUtility.getUriParameter('universityCode');
            this.commonModel.schoolID = commonUtility.getUriParameter('schoolID');
            this.commonModel.courseID = commonUtility.getUriParameter('courseID');
            this.commonModel.loginUser = commonUtility.getLoginUser();
        },
        getWeekdayObject: function(weekDay) {
            let mapWeekDay = null;
            this.courseScheduleModel.weeklyDayList.forEach((obj) => {
                if (obj.day === weekDay) {
                    mapWeekDay = obj;
                }
            });
            return mapWeekDay;
        },
        getCourseArray: function(courseOrder, arr) {
            let mapCourse = null;
            this.courseScheduleModel.courseList.forEach((obj) => {
                if (obj.order === courseOrder) {
                    mapCourse = obj;
                }
            });
            arr.push(mapCourse);
            return arr;
        },
        loadCourseDetail: function() {
            axios.get('/course/detail/info'
                    .concat(`?universityCode=${this.commonModel.universityCode}`)
                    .concat(`&schoolID=${this.commonModel.schoolID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    if (commonUtility.isEmpty(res.data.courseDetail)) {
                        message.info(localMessage.NOT_FOUND_DATA);
                        return false;
                    }
                    this.courseModel.detail = res.data.courseDetail;
                    this.loadCourseSchedule(res.data.courseDetail.courseScheduleList);
                    this.loadCoursePlan(res.data.courseDetail.coursePlanList);
                    this.loadCodeStandard();
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        loadCourseSchedule: function(originalScheduleList) {
            if (commonUtility.isEmptyList(originalScheduleList)) {
                return false;
            }
            let courseScheduleArr = [];
            let that = this;
            originalScheduleList.forEach(function(schedule) {
                if (that.courseScheduleModel.dataList.length === 0) {
                    that.courseScheduleModel.dataList.push({
                        weekday: that.getWeekdayObject(schedule.weekday),
                        schedule: that.getCourseArray(schedule.weekdayClass, courseScheduleArr),
                    });
                } else {
                    let currentWeekday = schedule.weekday;
                    let isExistCurrentWeekday = false;
                    let isExistCurrentWeekdayIndex = -1;
                    that.courseScheduleModel.dataList.forEach(function(s, i) {
                        if (s.weekday.day === currentWeekday) {
                            isExistCurrentWeekday = true;
                            isExistCurrentWeekdayIndex = i;
                        }
                    });

                    if (isExistCurrentWeekday) {
                        that.courseScheduleModel.dataList[isExistCurrentWeekdayIndex].schedule = that.getCourseArray(schedule.weekdayClass, courseScheduleArr)
                    } else {
                        courseScheduleArr = [];
                        that.courseScheduleModel.dataList.push({
                            weekday: that.getWeekdayObject(schedule.weekday),
                            schedule: that.getCourseArray(schedule.weekdayClass, courseScheduleArr),
                        });
                    }
                }
            });
        },
        loadCoursePlan: function(originalPlanList) {
            let courseKnowledgeIDArray = [];
            let courseKnowledgeNameArray = [];
            let that = this;
            this.coursePlanModel.dataList = [];
            originalPlanList.forEach(function(plan) {
                if (that.coursePlanModel.dataList.length === 0) {
                    courseKnowledgeIDArray.push(plan.knowledgeID);
                    courseKnowledgeNameArray.push(plan.knowledgeName);
                    that.coursePlanModel.dataList.push({
                        technologyID: that.courseModel.detail.technologyID,
                        technologyName: that.courseModel.detail.technologyName,
                        technologyThumbnail: that.courseModel.detail.technologyThumbnail,
                        courseOrder: plan.courseClass,
                        learningPhaseID: plan.learningPhaseID,
                        learningPhaseName: plan.learningPhaseName,
                        knowledgeIDArray: courseKnowledgeIDArray,
                        knowledgeNameArray: courseKnowledgeNameArray,
                        dataStatus: plan.dataStatus,
                        dataStatusText: plan.dataStatusText
                    });
                } else {
                    let currentCourseClass = plan.courseClass;
                    let isExistCurrentCourseClass = false;
                    let isExistCurrentCourseClassIndex = -1;
                    that.coursePlanModel.dataList.forEach(function(p, i) {
                        if (p.courseOrder === currentCourseClass) {
                            isExistCurrentCourseClass = true;
                            isExistCurrentCourseClassIndex = i;
                        }
                    });

                    if (isExistCurrentCourseClass) {
                        courseKnowledgeIDArray.push(plan.knowledgeID);
                        courseKnowledgeNameArray.push(plan.knowledgeName);
                        that.coursePlanModel.dataList[isExistCurrentCourseClassIndex].knowledgeIDArray = courseKnowledgeIDArray;
                        that.coursePlanModel.dataList[isExistCurrentCourseClassIndex].knowledgeNameArray = courseKnowledgeNameArray;
                    } else {
                        courseKnowledgeIDArray = [];
                        courseKnowledgeNameArray = [];
                        courseKnowledgeIDArray.push(plan.knowledgeID);
                        courseKnowledgeNameArray.push(plan.knowledgeName);
                        that.coursePlanModel.dataList.push({
                            technologyID: that.courseModel.detail.technologyID,
                            technologyName: that.courseModel.detail.technologyName,
                            technologyThumbnail: that.courseModel.detail.technologyThumbnail,
                            courseOrder: plan.courseClass,
                            learningPhaseID: plan.learningPhaseID,
                            learningPhaseName: plan.learningPhaseName,
                            knowledgeIDArray: courseKnowledgeIDArray,
                            knowledgeNameArray: courseKnowledgeNameArray,
                            dataStatus: plan.dataStatus,
                            dataStatusText: plan.dataStatusText
                        });
                    }
                }
            });
        },
        loadCourseExercises: function() {
            axios.get('/course/detail/exercises/course'
                    .concat(`?universityCode=${this.commonModel.universityCode}`)
                    .concat(`&schoolID=${this.commonModel.schoolID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    res.data.dataList.forEach(function(courseExercises) {
                        let exercisesTotalCount = 0;
                        courseExercises.knowledgeList.forEach(function(knowledge) {
                            exercisesTotalCount += knowledge.knowledgeExercisesList.length;
                        });
                        courseExercises.exercisesTotalCount = exercisesTotalCount;
                    });
                    this.courseExercisesModel.dataList = res.data.dataList;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        loadApplyStudent: function() {
            axios.get('/course/detail/student'
                    .concat(`?pageNumber=${this.courseStudentModel.pageNumber}`)
                    .concat(`&universityCode=${this.commonModel.universityCode}`)
                    .concat(`&schoolID=${this.commonModel.schoolID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach((data) => {
                            if (commonUtility.isEmpty(data.studentPhoto)) {
                                data.studentPhoto = '/media/users/customer_photo_demo.png';
                            }
                        })
                    }
                    this.courseStudentModel.totalCount = res.data.dataContent.totalCount;
                    this.courseStudentModel.dataList = res.data.dataContent.dataList;
                    this.courseStudentModel.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    this.courseStudentModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                    this.courseStudentModel.paginationArray = res.data.dataContent.paginationArray;
                    this.courseStudentModel.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : parseInt(res.data.dataContent.prePageNum);
                    this.courseStudentModel.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : parseInt(res.data.dataContent.nextPageNum);
                    this.courseStudentModel.fromIndex = res.data.dataContent.dataList === null ? 0 : (this.courseStudentModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + 1;
                    this.courseStudentModel.toIndex = res.data.dataContent.dataList === null ? 0 : (this.courseStudentModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + this.courseStudentModel.dataList.length;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        loadOnlineQuestion: function() {
            axios.get('/course/detail/question'
                    .concat(`?pageNumber=${this.courseOnlineQuestionModel.pageNumber}`)
                    .concat(`&universityCode=${this.commonModel.universityCode}`)
                    .concat(`&schoolID=${this.commonModel.schoolID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    this.courseOnlineQuestionModel.totalCount = res.data.dataContent.totalCount;
                    this.courseOnlineQuestionModel.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    this.courseOnlineQuestionModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                    if (res.data.dataContent.dataList === null) {
                        return false;
                    }
                    res.data.dataContent.dataList.forEach((data) => {
                        if (commonUtility.isEmpty(data.questionerPhoto)) {
                            data.questionerPhoto = '/media/users/customer_photo_demo.png';
                        }
                        data.questionContent = data.questionContent.replace(/\n/g, '<br />');
                        data.leaveMessageList.forEach(function(leaveMessage) {
                            leaveMessage.messageContent = leaveMessage.messageContent.replace(/\n/g, '<br />');
                        });
                        this.courseOnlineQuestionModel.dataList.push(data);
                    });
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        onShowKnowledgeExercisesModal: function(data) {
            this.knowledgeExercisesModel.courseClass = data.courseClass;
            this.knowledgeExercisesModel.dataList = data.knowledgeList;
            $('#kt_modal_knowledge_exercises').modal('show');
        },
        onShowLeaveMessageModal: function(question) {
            this.leaveMessageModel.questionID = question.questionID;
            this.leaveMessageModel.questionerName = question.questionerName;
            this.leaveMessageModel.commenterUniversityCode = this.commonModel.loginUser.universityCode;
            this.leaveMessageModel.commenterSchoolID = this.commonModel.loginUser.schoolID;
            this.leaveMessageModel.commenterID = this.commonModel.loginUser.studentID;
            this.leaveMessageModel.messageContent = '';
            $('#kt_modal_leave_message').modal('show');
        },
        onSubmitAnswerMessage: function() {
            if (commonUtility.isEmpty(this.leaveMessageModel.messageContent)) {
                this.leaveMessageModel.showAlert = true;
                return false;
            }
            let btn = $('#btnSubmitAnswerMessage');
            $(btn).attr('disabled', true);
            KTApp.progress(btn);
            this.leaveMessageModel.showAlert = false;
            let that = this;
            axios.post('/course/detail/leaveMessage', {
                    questionID: this.leaveMessageModel.questionID,
                    commenterUniversityCode: this.leaveMessageModel.commenterUniversityCode,
                    commenterSchoolID: this.leaveMessageModel.commenterSchoolID,
                    commenterID: this.leaveMessageModel.commenterID,
                    commenterType: this.leaveMessageModel.commenterType,
                    messageContent: this.leaveMessageModel.messageContent,
                    loginUser: this.commonModel.loginUser.studentID
                })
                .then(function(res) {
                    if (res.data.err) {
                        KTApp.unprogress(btn);
                        $(btn).removeAttr('disabled');
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    KTApp.unprogress(btn);
                    $(btn).removeAttr('disabled');
                    $('#kt_modal_leave_message').modal('hide');
                    that.courseOnlineQuestionModel.dataList = [];
                    that.loadOnlineQuestion();
                })
                .catch(function(error) {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        loadMyExercises: function() {
            if (commonUtility.isEmpty(this.commonModel.loginUser)) {
                this.courseMyExercisesModel.isShow = false;
                return false;
            }
            this.checkLoginUserIsAppliedCourse(
                this.loadExercises,
                this.courseMyExercisesModel.pageNumber,
                this.courseMyExercisesModel.filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        loadOtherExercises: function() {
            if (commonUtility.isEmpty(this.commonModel.loginUser)) {
                this.courseMyExercisesModel.isShow = false;
                return false;
            }
            this.checkLoginUserIsAppliedCourse(
                this.loadExercises,
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false,
                this.checkIsAssistant);
        },
        checkLoginUserIsAppliedCourse: function(loadExercisesCallback, pageNumber, dataStatus, studentName, isSelf, checkIsAssistantCallback) {
            axios.get('/course/detail/check/applied'
                    .concat(`?studentID=${this.commonModel.loginUser.studentID}`)
                    .concat(`&universityCode=${this.commonModel.universityCode}`)
                    .concat(`&schoolID=${this.commonModel.schoolID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    this.commonModel.applied = res.data.result;
                    if (!res.data.result) {
                        this.courseOtherExercisesModel.isShow = false;
                        return false;
                    }
                    if (checkIsAssistantCallback === undefined) {
                        loadExercisesCallback(pageNumber, dataStatus, studentName, isSelf);
                        return false;
                    }
                    checkIsAssistantCallback(loadExercisesCallback, pageNumber, dataStatus, studentName, isSelf);
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        checkIsAssistant: function(loadExercisesCallback, pageNumber, dataStatus, studentName, isSelf) {
            axios.get('/course/detail/check/assistant'
                    .concat(`?studentID=${this.commonModel.loginUser.studentID}`)
                    .concat(`&universityCode=${this.commonModel.universityCode}`)
                    .concat(`&schoolID=${this.commonModel.schoolID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    if (!res.data.result) {
                        this.courseOtherExercisesModel.isShow = false;
                        return false;
                    }
                    loadExercisesCallback(pageNumber, dataStatus, studentName, isSelf);
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        loadExercises: function(pageNumber, dataStatus, studentName, isSelf) {
            let fullName = commonUtility.isEmpty(studentName) ? 'NULL' : studentName;

            axios.get('/course/detail/exercises'
                    .concat(`?pageNumber=${pageNumber}`)
                    .concat(`&studentID=${this.commonModel.loginUser.studentID}`)
                    .concat(`&courseID=${this.commonModel.courseID}`)
                    .concat(`&dataStatus=${dataStatus}`)
                    .concat(`&studentName=${fullName}`)
                    .concat(`&isSelf=${isSelf}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    let exercisesModel = isSelf ? this.courseMyExercisesModel : this.courseOtherExercisesModel;
                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach((data) => {
                            if (commonUtility.isEmpty(data.studentPhoto)) {
                                data.studentPhoto = '/media/users/customer_photo_demo.png';
                            }
                        })
                    }
                    exercisesModel.totalCount = res.data.dataContent.totalCount;
                    exercisesModel.dataList = res.data.dataContent.dataList;
                    exercisesModel.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    exercisesModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                    exercisesModel.paginationArray = res.data.dataContent.paginationArray;
                    exercisesModel.prePageNum = res.data.dataContent.prePageNum === undefined ? -1 : parseInt(res.data.dataContent.prePageNum);
                    exercisesModel.nextPageNum = res.data.dataContent.nextPageNum === undefined ? -1 : parseInt(res.data.dataContent.nextPageNum);
                    exercisesModel.fromIndex = res.data.dataContent.dataList === null ? 0 : (exercisesModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + 1;
                    exercisesModel.toIndex = res.data.dataContent.dataList === null ? 0 : (exercisesModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + exercisesModel.dataList.length;
                    exercisesModel.isShow = true;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        loadReviewHistory: function() {
            let that = this;
            axios.get('/course/detail/exercises/review'
                    .concat(`?pageNumber=${this.reviewHistoryModel.pageNumber}`)
                    .concat(`&exercisesID=${this.reviewHistoryModel.exercisesID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    if (!commonUtility.isEmptyList(res.data.dataContent.dataList)) {
                        res.data.dataContent.dataList.forEach((data) => {
                            if (data.reviewerType === 'T' && commonUtility.isEmpty(data.reviewerTeacherPhoto)) {
                                data.reviewerPhoto = '/media/users/user_default.png';
                            }
                            if (data.reviewerType === 'T' && !commonUtility.isEmpty(data.reviewerTeacherPhoto)) {
                                data.reviewerPhoto = data.reviewerTeacherPhoto;
                            }
                            if (data.reviewerType === 'S' && commonUtility.isEmpty(data.reviewerStudentPhoto)) {
                                data.reviewerPhoto = '/media/users/customer_photo_demo.png';
                            }
                            if (data.reviewerType === 'S' && !commonUtility.isEmpty(data.reviewerStudentPhoto)) {
                                data.reviewerPhoto = data.reviewerStudentPhoto;
                            }
                            that.reviewHistoryModel.dataList.push(data);
                        })
                    }
                    this.reviewHistoryModel.totalCount = res.data.dataContent.totalCount;
                    this.reviewHistoryModel.pageNumber = parseInt(res.data.dataContent.currentPageNum);
                    this.reviewHistoryModel.maxPageNumber = Math.ceil(res.data.dataContent.totalCount / res.data.dataContent.pageSize);
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        onShowReviewHistoryModal: function(data) {
            this.reviewHistoryModel.exercisesID = data.studentExercisesID;
            this.reviewHistoryModel.exercisesName = data.exercisesDocumentUrl.substr(data.exercisesDocumentUrl.lastIndexOf('/') + 1);
            this.reviewHistoryModel.totalCount = 0;
            this.reviewHistoryModel.maxPageNumber = 0;
            this.reviewHistoryModel.pageNumber = 1;
            this.reviewHistoryModel.dataList = [];
            this.loadReviewHistory();
            $('#kt_modal_review_list').modal('show');
        },
        onShowReview: function(data) {
            this.reviewModel.courseUniversityCode = data.courseUniversityCode;
            this.reviewModel.courseSchoolID = data.courseSchoolID;
            this.reviewModel.courseID = data.courseID;
            this.reviewModel.courseClass = data.courseClass;
            this.reviewModel.exercisesID = data.studentExercisesID;

            this.reviewModel.studentID = data.studentID;
            this.reviewModel.studentName = data.studentName;
            this.reviewModel.studentUniversityCode = data.studentUniversityCode;
            this.reviewModel.studentUniversityName = data.studentUniversityName;
            this.reviewModel.studentSchoolID = data.studentSchoolID;
            this.reviewModel.studentSchoolName = data.studentSchoolName;
            this.reviewModel.technologyID = data.technologyID;
            this.reviewModel.languageID = this.courseModel.detail.languageID;
            this.reviewModel.technologyName = data.technologyName;
            this.reviewModel.learningPhaseName = data.learningPhaseName;
            this.reviewModel.knowledgeName = data.knowledgeName;
            this.reviewModel.exercisesDocumentName = data.exercisesDocumentUrl.substr(data.exercisesDocumentUrl.lastIndexOf('/') + 1);
            this.reviewModel.exercisesDocumentUrl = data.exercisesDocumentUrl;

            this.reviewModel.exercisesAnswerUrl = data.exercisesAnswerUrl;
            this.reviewModel.sourceCodeSubmitTime = data.updateTime;
            this.reviewModel.sourceCodeGitUrl = data.sourceCodeGitUrl;

            this.reviewModel.compilationResult = REVIEW_RESULT.INIT;
            this.reviewModel.runResult = REVIEW_RESULT.INIT;
            this.reviewModel.codeStandardResult = REVIEW_RESULT.INIT;
            this.reviewModel.reviewResult = REVIEW_RESULT.INIT;
            this.reviewModel.reviewMemo = '';

            $.each($('input[name="codeStandard"]'), (index, obj) => {
                $(obj).prop("checked", "");
            });

            $('#kt_modal_review').modal('show');
        },
        loadCodeStandard: function() {
            axios.get('/course/detail/codeStandard'
                    .concat(`?languageID=${this.courseModel.detail.languageID}`))
                .then(res => {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    this.reviewModel.codeStandardList = res.data.dataList;
                })
                .catch(err => {
                    message.error(localMessage.NETWORK_ERROR);
                })
        },
        onLoadMoreReviewHistory: function() {
            this.reviewHistoryModel.pageNumber++;
            this.loadReviewHistory();
        },
        onShowExercisesCodeSourceModal: function(data) {
            this.exercisesGitModel.courseClass = data.courseClass;
            this.exercisesGitModel.studentExercisesID = data.studentExercisesID;
            this.exercisesGitModel.exercisesName = data.exercisesDocumentUrl.substr(data.exercisesDocumentUrl.lastIndexOf('/') + 1);
            this.exercisesGitModel.sourceCodeGitUrl = data.sourceCodeGitUrl;
            $('#kt_modal_resource_uri').modal('show');
        },
        checkDataPreSubmitReview: function() {
            let alterMessage = '请选择以下批改意见：';
            let result = true;
            if (this.reviewModel.compilationResult === REVIEW_RESULT.INIT) {
                alterMessage = alterMessage.concat('<br/>编译结果');
                result = false;
            }
            if (this.reviewModel.runResult === REVIEW_RESULT.INIT) {
                alterMessage = alterMessage.concat('<br/>运行结果');
                result = false;
            }
            if (this.reviewModel.codeStandardResult === REVIEW_RESULT.INIT) {
                alterMessage = alterMessage.concat('<br/>代码规范结果');
                result = false;
            }
            if (parseInt(this.reviewModel.codeStandardResult) === REVIEW_RESULT.NOT_PASS &&
                this.reviewModel.codeStandardErrorList.length === 0) {
                alterMessage = alterMessage.concat('<br/>代码规范问题');
                result = false;
            }
            if (this.reviewModel.reviewResult === REVIEW_RESULT.INIT) {
                alterMessage = alterMessage.concat('<br/>综合评定结果');
                result = false;
            }
            if (!result) {
                message.info(alterMessage);
            }
            return result;
        },
        onReviewSubmit: function() {
            if (!this.checkDataPreSubmitReview()) {
                return false;
            }

            let btn = $('#btnReviewSubmit');
            $(btn).attr('disabled', true);
            KTApp.progress(btn);
            let codeStandardErrorList = [];
            let that = this;
            this.reviewModel.codeStandardErrorList.forEach(function(standardID) {
                codeStandardErrorList.push({
                    studentUniversityCode: that.reviewModel.studentUniversityCode,
                    studentSchoolID: that.reviewModel.studentSchoolID,
                    studentID: that.reviewModel.studentID,
                    languageID: that.reviewModel.languageID,
                    codeStandardID: standardID,
                });
            });

            axios.post('/course/detail/review', {
                    courseUniversityCode: that.reviewModel.courseUniversityCode,
                    courseSchoolID: that.reviewModel.courseSchoolID,
                    courseID: that.reviewModel.courseID,
                    courseClass: that.reviewModel.courseClass,
                    studentExercisesID: that.reviewModel.exercisesID,
                    reviewerID: that.commonModel.loginUser.studentID,
                    reviewerUniversityCode: that.commonModel.loginUser.universityCode,
                    reviewerSchoolID: that.commonModel.loginUser.schoolID,
                    reviewerType: 'S',
                    compilationResult: parseInt(that.reviewModel.compilationResult) === 1 ? 'S' : 'N',
                    runResult: parseInt(that.reviewModel.runResult) === 1 ? 'S' : 'N',
                    codeStandardResult: parseInt(that.reviewModel.codeStandardResult) === 1 ? 'S' : 'N',
                    codeStandardErrorListJson: JSON.stringify(codeStandardErrorList),
                    reviewResult: parseInt(that.reviewModel.reviewResult) === 1 ? 'S' : 'N',
                    reviewMemo: that.reviewModel.reviewMemo,
                    loginUser: that.commonModel.loginUser.studentID
                })
                .then(function(res) {
                    if (res.data.err) {
                        KTApp.unprogress(btn);
                        $(btn).removeAttr('disabled');
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    KTApp.unprogress(btn);
                    $(btn).removeAttr('disabled');
                    $('#kt_modal_review').modal('hide');
                    that.loadOtherExercises();
                })
                .catch(function(error) {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onStudentFirstPage: function() {
            if (this.courseStudentModel.pageNumber === 1) {
                return false;
            }
            this.courseStudentModel.pageNumber = 1;
            this.loadApplyStudent();
        },
        onStudentPrePage: function() {
            if (this.courseStudentModel.pageNumber === 1) {
                return false;
            }
            this.courseStudentModel.pageNumber--;
            this.loadApplyStudent();
        },
        onStudentPagination: function(pageNumber) {
            if (this.courseStudentModel.pageNumber === pageNumber) {
                return false;
            }
            this.courseStudentModel.pageNumber = pageNumber;
            this.loadApplyStudent();
        },
        onStudentNextPage: function() {
            if (this.courseStudentModel.pageNumber === this.courseStudentModel.maxPageNumber) {
                return false;
            }
            this.courseStudentModel.pageNumber++;
            this.loadApplyStudent();
        },
        onStudentLastPage: function() {
            if (this.courseStudentModel.pageNumber === this.courseStudentModel.maxPageNumber) {
                return false;
            }
            this.courseStudentModel.pageNumber = this.courseStudentModel.maxPageNumber;
            this.loadApplyStudent();
        },
        onFilterCourseMyExercises: function(filterStatus) {
            this.courseMyExercisesModel.filterStatus = filterStatus;
            this.courseMyExercisesModel.pageNumber = 1;
            this.loadExercises(
                this.courseMyExercisesModel.pageNumber,
                filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        onMyExercisesFirstPage: function() {
            if (this.courseMyExercisesModel.pageNumber === 1) {
                return false;
            }
            this.courseMyExercisesModel.pageNumber = 1;
            this.loadExercises(
                this.courseMyExercisesModel.pageNumber,
                this.courseMyExercisesModel.filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        onMyExercisesPrePage: function() {
            if (this.courseMyExercisesModel.pageNumber === 1) {
                return false;
            }
            this.courseMyExercisesModel.pageNumber--;
            this.loadExercises(
                this.courseMyExercisesModel.pageNumber,
                this.courseMyExercisesModel.filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        onMyExercisesPagination: function(pageNumber) {
            if (this.courseMyExercisesModel.pageNumber === pageNumber) {
                return false;
            }
            this.courseMyExercisesModel.pageNumber = pageNumber;
            this.loadExercises(
                this.courseMyExercisesModel.pageNumber,
                this.courseMyExercisesModel.filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        onMyExercisesNextPage: function() {
            if (this.courseMyExercisesModel.pageNumber === this.courseMyExercisesModel.maxPageNumber) {
                return false;
            }
            this.courseMyExercisesModel.pageNumber++;
            this.loadExercises(
                this.courseMyExercisesModel.pageNumber,
                this.courseMyExercisesModel.filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        onMyExercisesLastPage: function() {
            if (this.courseMyExercisesModel.pageNumber === this.courseMyExercisesModel.maxPageNumber) {
                return false;
            }
            this.courseMyExercisesModel.pageNumber = this.courseMyExercisesModel.maxPageNumber;
            this.loadExercises(
                this.courseMyExercisesModel.pageNumber,
                this.courseMyExercisesModel.filterStatus,
                this.courseMyExercisesModel.studentName,
                true);
        },
        onFilterOtherCourseExercises: function(filterStatus) {
            this.courseOtherExercisesModel.filterStatus = filterStatus;
            this.courseOtherExercisesModel.pageNumber = 1;
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        onOtherExercisesFirstPage: function() {
            if (this.courseOtherExercisesModel.pageNumber === 1) {
                return false;
            }
            this.courseOtherExercisesModel.pageNumber = 1;
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        onOtherExercisesPrePage: function() {
            if (this.courseOtherExercisesModel.pageNumber === 1) {
                return false;
            }
            this.courseOtherExercisesModel.pageNumber--;
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        onOtherExercisesPagination: function(pageNumber) {
            if (this.courseOtherExercisesModel.pageNumber === pageNumber) {
                return false;
            }
            this.courseOtherExercisesModel.pageNumber = pageNumber;
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        onOtherExercisesNextPage: function() {
            if (this.courseOtherExercisesModel.pageNumber === this.courseOtherExercisesModel.maxPageNumber) {
                return false;
            }
            this.courseOtherExercisesModel.pageNumber++;
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        onOtherExercisesLastPage: function() {
            if (this.courseOtherExercisesModel.pageNumber === this.courseOtherExercisesModel.maxPageNumber) {
                return false;
            }
            this.courseOtherExercisesModel.pageNumber = this.courseOtherExercisesModel.maxPageNumber;
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        onOtherExercisesKeydown: function(e) {
            let keyCode = e.keyCode;
            if (keyCode !== 13) {
                return false;
            }
            this.loadExercises(
                this.courseOtherExercisesModel.pageNumber,
                this.courseOtherExercisesModel.filterStatus,
                this.courseOtherExercisesModel.studentName,
                false);
        },
        submitSourceCodeGitUrl: function() {
            if (commonUtility.isEmpty(this.exercisesGitModel.sourceCodeGitUrl)) {
                this.exercisesGitModel.showAlert = true;
                return false;
            }
            let that = this;
            axios.put('/course/detail/sourceCode/uri', {
                    courseUniversityCode: this.commonModel.universityCode,
                    courseSchoolID: this.commonModel.schoolID,
                    courseID: this.commonModel.courseID,
                    courseClass: this.exercisesGitModel.courseClass,
                    studentExercisesID: this.exercisesGitModel.studentExercisesID,
                    sourceCodeGitUrl: this.exercisesGitModel.sourceCodeGitUrl,
                    loginUser: this.commonModel.loginUser.studentID
                })
                .then(function(res) {
                    if (res.data.err) {
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }

                    $('#kt_modal_resource_uri').modal('hide');

                    that.loadExercises(
                        that.courseMyExercisesModel.pageNumber,
                        that.courseMyExercisesModel.filterStatus,
                        that.courseMyExercisesModel.studentName,
                        true);
                })
                .catch(function(error) {
                    message.error(localMessage.NETWORK_ERROR);
                });
        },
        onApplyCourse: function() {
            let that = this;
            bootbox.confirm({
                message: `您确认要报名该课程吗？`,
                buttons: {
                    confirm: {
                        label: '确认',
                        className: 'btn-warning'
                    },
                    cancel: {
                        label: '取消',
                        className: 'btn-secondary'
                    }
                },
                callback: function(result) {
                    if (result) {
                        that.applyCourse();
                    }
                }
            });
        },
        applyCourse: function() {
            let btn = $('#btnApplyCourse');
            $(btn).attr('disabled', true);
            KTApp.progress(btn);
            let that = this;
            axios.post('/course/detail/apply', {
                    studentUniversityCode: this.commonModel.loginUser.universityCode,
                    studentSchoolID: this.commonModel.loginUser.schoolID,
                    studentID: this.commonModel.loginUser.studentID,
                    courseUniversityCode: this.commonModel.universityCode,
                    courseSchoolID: this.commonModel.schoolID,
                    courseID: this.commonModel.courseID,
                    loginUser: this.commonModel.loginUser.studentID
                })
                .then(function(res) {
                    if (res.data.err) {
                        KTApp.unprogress(btn);
                        $(btn).removeAttr('disabled');
                        message.error(localMessage.exception(res.data.code, res.data.msg));
                        return false;
                    }
                    KTApp.unprogress(btn);
                    $(btn).removeAttr('disabled');
                    location.reload();
                })
                .catch(function(error) {
                    message.error(localMessage.NETWORK_ERROR);
                });
        }
    },
    mounted() {
        this.initPage();
    }
});