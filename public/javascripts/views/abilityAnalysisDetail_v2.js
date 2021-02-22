const app = new Vue({
  el: '#app',
  data: {
    source: '',
    loginUser: {},
    studentID: 0,
    studentName: '',
    sex: '',
    studentPhotoUrl: '',
    learningTechnologyCount: 0,
    collectionCount: 0,
    universityCode: 0,
    universityName: '',
    schoolID: 0,
    schoolName: '',
    majorName: '',
    cellphone: '',
    email: '',
    enrollmentYear: '',
    onlineQuestionCount: 0,
    onlineAnswerCount: 0,
    joinProjectCount: 0,
    learningTechnologyList: [],
    learningAnalysisDetail: {},
    isShowCourseAnalysisDetail: false,
    learnedKnowledgeAnalysisList: [],
    learningKnowledgeAnalysisList: [],
    pendingKnowledgeAnalysisList: [],
    codeStandardAnalysisList: [],
    comprehensiveExercisesAnalysis: [],
    comprehensiveExercisesSubmit: {
      dateArray: [],
      submitData: []
    },
    tabHref: '#course_learning_analysis',
    isShowComprehensiveSubmitTrend: false
  },
  methods: {
    initPage: function () {
      let result = this.setParameters();
      if (!result) {
        return false;
      }
      this.setMenuActive();
      this.loadStudentInfo();
      this.loadTechnologyLearningList();
      this.loadComprehensiveAnalysis();
      this.loadProjectAnalysis();
    },
    setParameters: function () {
      this.source = commonUtility.getUriParameter('s');
      this.loginUser = commonUtility.getLoginUser();
      if (commonUtility.isEmpty(this.source)) {
        $('.kt-parameter-alert').removeClass('kt-hidden');
        return false;
      }
      if (this.source !== 'm' && this.source !== 'o') {
        $('.kt-parameter-alert').removeClass('kt-hidden');
        return false;
      }
      if (this.source === 'm' && commonUtility.isEmpty(this.loginUser)) {
        $('.kt-login-alert').removeClass('kt-hidden');
        return false;
      }
      if (this.source === 'm') {
        tracking.view(trackingSetting.view.myGrade);
        this.universityCode = this.loginUser.universityCode;
        this.schoolID = this.loginUser.schoolID;
        this.studentID = this.loginUser.studentID;
        $('.kt-app').removeClass('kt-hidden');
        return true;
      }
      if (this.source === 'o') {
        tracking.view(trackingSetting.view.gradeInfo);
        this.universityCode = commonUtility.getUriParameter('universityCode');
        this.schoolID = commonUtility.getUriParameter('schoolID');
        this.studentID = commonUtility.getUriParameter('studentID');
        if (commonUtility.isEmpty(this.universityCode) ||
            commonUtility.isEmpty(this.schoolID) ||
            commonUtility.isEmpty(this.studentID)) {
          $('.kt-parameter-alert').removeClass('kt-hidden');
          return false;
        }
      }
      $('.kt-app').removeClass('kt-hidden');
      return true;
    },
    setMenuActive: function () {
      switch (this.source) {
        case 'm':
          commonUtility.setNavActive(3);
          break;
        case 'o':
          commonUtility.setNavActive(4);
          break;
      }
    },
    loadStudentInfo: function () {
      let that = this;
      axios.get('/ability/analysis/detail/studentInfo'
          .concat(`?studentID=${that.studentID}`))
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        if (commonUtility.isEmpty(res.data.studentInfo) && commonUtility.isEmpty(that.loginUser)) {
          return false;
        }
        if (commonUtility.isEmpty(res.data.studentInfo)) {
          that.studentName = that.loginUser.fullName;
          that.universityName = that.loginUser.universityName;
          that.schoolName = that.loginUser.schoolName;
          that.majorName = that.loginUser.majorName;
          that.enrollmentYear = that.loginUser.enrollmentYear.substr(0, 4) + '年';
          that.email = that.loginUser.email;
          that.sex = commonUtility.isEmpty(that.loginUser.sex) ? 'M' : that.loginUser.sex;
        } else {
          that.studentName = res.data.studentInfo.fullName;
          that.universityName = res.data.studentInfo.universityName;
          that.schoolName = res.data.studentInfo.schoolName;
          that.majorName = res.data.studentInfo.majorName;
          that.enrollmentYear = commonUtility.isEmpty(res.data.studentInfo.enrollmentYear) ? '' : res.data.studentInfo.enrollmentYear.substr(0, 4) + '年';
          that.cellphone = res.data.studentInfo.cellphone;
          that.email = res.data.studentInfo.email;
          that.sex = commonUtility.isEmpty(res.data.studentInfo.sex) ? 'M' : res.data.studentInfo.sex;
          that.studentPhotoUrl = commonUtility.isEmpty(res.data.studentInfo.photo) ? '/media/users/user_default.png' : res.data.studentInfo.photo;
          that.onlineQuestionCount = res.data.studentInfo.onlineQuestionCount
          that.onlineAnswerCount = res.data.studentInfo.onlineAnswerCount
          that.joinProjectCount = res.data.studentInfo.joinProjectCount
        }
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadTechnologyLearningList: function () {
      let that = this;
      axios.get('/ability/analysis/detail/learningTechnology'
          .concat(`?studentID=${that.studentID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (commonUtility.isEmptyList(res.data.list)) {
              that.learningTechnologyCount = 0;
              that.learningTechnologyList = [];
              return false;
            }
            that.learningTechnologyCount = res.data.list.length;
            that.learningTechnologyList = res.data.list;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadTechnologyLearningDetail: function () {
      this.drawKnowledgeAnalysis();
      this.drawCodeStandardAnalysis();
    },
    drawKnowledgeAnalysis: function () {
      axios.get('/ability/analysis/detail/knowledgeAnalysis'
          .concat(`?studentID=${this.studentID}`)
          .concat(`&technologyID=${this.learningAnalysisDetail.technologyID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            let data = [
              {label: "未练习", data: res.data.detail.noLearnKnowledgeCount, color: KTApp.getStateColor("brand")},
              {label: "已掌握", data: res.data.detail.finishedKnowledgePercent, color: KTApp.getStateColor("success")},
              {label: "练习中", data: res.data.detail.weaknessKnowledgeCount, color: KTApp.getStateColor("danger")}
            ];
            let knowledgeAnalysisObject =  $(`#knowledgeAnalysis`);
            knowledgeAnalysisObject.empty();
            $.plot(knowledgeAnalysisObject, data, {
              series: {
                pie: {
                  show: true,
                  radius: 1,
                  label: {
                    show: true,
                    radius: 1,
                    formatter: function (label, series) {
                      return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                    },
                    background: {
                      opacity: 0.8
                    }
                  }
                }
              },
              legend: {
                show: false
              }
            });
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    drawCodeStandardAnalysis: function () {
      axios.get('/ability/analysis/detail/codeStandardAnalysis'
          .concat(`?studentID=${this.studentID}`)
          .concat(`&languageID=${this.learningAnalysisDetail.languageID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            let codeStandardAnalysisList = [];
            if (res.data.list === null) {
              return false;
            }
            let stateColorIndex = 0;
            let colorStateKeyArray = [
              "brand",
              "light",
              "dark",
              "primary",
              "success",
              "info",
              "warning",
              "danger",
              "colors9",
              "colors10",
              "colors11",
              "colors12",
              "colors13",
              "colors14",
              "colors15",
              "colors16",
              "colors17",
              "colors18",
              "colors19",
              "colors20"
            ];
            res.data.list.forEach(function (codeStandard, index) {
              if (stateColorIndex > colorStateKeyArray.length - 1) {
                stateColorIndex = 0;
              }
              $('#table_code_standard tbody').append(
                  `<tr>
                <th style="width: 15%">${index + 1}</th>
                <td style="width: 65%">${codeStandard.codeStandardName}</td>
                <td style="width: 20%">${codeStandard.totalCount}</td>
              </tr>`
              );
              codeStandardAnalysisList.push({
                label: codeStandard.codeStandardName,
                data: codeStandard.totalCount,
                color: KTApp.getStateColor(colorStateKeyArray[stateColorIndex])
              });
              stateColorIndex++;
            });
            let codeStandardAnalysisObject = $('#codeStandardAnalysis');
            codeStandardAnalysisObject.empty();
            $.plot(codeStandardAnalysisObject, codeStandardAnalysisList, {
              series: {
                pie: {
                  show: true,
                  radius: 1,
                  label: {
                    show: true,
                    radius: 1,
                    formatter: function (label, series) {
                      return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                    },
                    background: {
                      opacity: 0.8
                    }
                  }
                }
              },
              legend: {
                show: false
              }
            });
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadComprehensiveAnalysis: function () {
      this.loadComprehensiveExercisesAnalysis();
      this.loadComprehensiveSubmitTrendAnalysis();
    },
    loadComprehensiveExercisesAnalysis: function () {
      let that = this;
      axios.get('/ability/analysis/detail/comprehensiveExercisesAnalysis'
          .concat(`?studentID=${that.studentID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (commonUtility.isEmptyList(res.data.list)) {
              that.comprehensiveExercisesAnalysis = [];
              return false;
            }
            that.comprehensiveExercisesAnalysis = res.data.list;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadComprehensiveSubmitTrendAnalysis: function () {
      axios.get('/ability/analysis/detail/comprehensiveExercisesSubmitList'
          .concat(`?studentID=${this.studentID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (commonUtility.isEmptyList(res.data.list)) {

              return false;
            }
            let dateArray = [];
            let submitData = [];
            res.data.list.forEach(function(data,i){
              dateArray.push(data.key);
              submitData.push(data.value);
            })

            let myChart1 = echarts.init(document.getElementById('kt_morris_1'));
            let option = {
              title: {
                text: '就业测评提交趋势分析'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: []
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dateArray
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '提交数量',
                  type: 'line',
                  stack: '总量',
                  data: submitData
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart1.setOption(option);
            $('#kt_morris_1').hide();
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },

    loadProjectAnalysis: function () {

    },
    loadLearnedKnowledgeAnalysisList: function () {
      let that = this;
      axios.get('/ability/analysis/detail/knowledge/finish'
          .concat(`?pageNumber=1`)
          .concat(`&studentID=${that.studentID}`)
          .concat(`&technologyID=${that.learningAnalysisDetail.technologyID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (commonUtility.isEmptyList(res.data.list)) {
              that.learnedKnowledgeAnalysisList = [];
              return false;
            }
            that.learnedKnowledgeAnalysisList = res.data.list;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadLearningKnowledgeAnalysisList: function () {
      let that = this;
      axios.get('/ability/analysis/detail/knowledge/weak'
          .concat(`?pageNumber=1`)
          .concat(`&studentID=${that.studentID}`)
          .concat(`&technologyID=${that.learningAnalysisDetail.technologyID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (commonUtility.isEmptyList(res.data.list)) {
              that.learningKnowledgeAnalysisList = [];
              return false;
            }
            that.learningKnowledgeAnalysisList = res.data.list;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    loadPendingKnowledgeAnalysisList: function () {
      let that = this;
      axios.get('/ability/analysis/detail/knowledge/noLearning'
          .concat(`?pageNumber=1`)
          .concat(`&studentID=${that.studentID}`)
          .concat(`&technologyID=${that.learningAnalysisDetail.technologyID}`))
          .then(res => {
            if (res.data.err) {
              message.error(localMessage.exception(res.data.code, res.data.msg));
              return false;
            }
            if (commonUtility.isEmptyList(res.data.list)) {
              that.pendingKnowledgeAnalysisList = [];
              return false;
            }
            that.pendingKnowledgeAnalysisList = res.data.list;
          })
          .catch(err => {
            message.error(localMessage.NETWORK_ERROR);
          });
    },
    onShowTab: function(index) {
      switch (index) {
        case 1:
          this.tabHref = '#course_learning_analysis';
          $('#kt_morris_1').hide();
          break;
        case 2:
          this.tabHref = '#comprehensive_analysis';
          $('#kt_morris_1').show();
          break;
        case 3:
          this.tabHref = '#project_analysis';
          $('#kt_morris_1').hide();
          break;
      }
    },
    onShowCourseAnalysisDetail: function (data) {
      this.learningAnalysisDetail = data;
      this.loadTechnologyLearningDetail();
      this.isShowCourseAnalysisDetail = true;
    },
    onHideCourseAnalysisDetail: function () {
      this.isShowCourseAnalysisDetail = false;
    },
    onShowKnowledgeAnalysisList: function () {
      this.loadLearnedKnowledgeAnalysisList();
      this.loadLearningKnowledgeAnalysisList();
      this.loadPendingKnowledgeAnalysisList();
      $('#kt_modal_knowledge .modal-body .kt-scroll').addClass('ps--active-y');
      $('#kt_modal_knowledge').modal('show');
    },
    onShowCodeStandardAnalysisList: function () {

    }
  },
  mounted() {
    this.initPage();
  }
});