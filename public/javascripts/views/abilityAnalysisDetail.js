$(document).ready(function () {
  const SOURCE_MY = 'm';
  const SOURCE_OTHER = 'o';
  let model = {
    universityCode: 0,
    schoolID: 0,
    studentID: 0,
    isLogin: false,
    loginUser: null,
    parameterValid: false,
    source: '',
    sourceList: ['m', 'o']
  };

  function initPage() {
    if (!checkParameters()) {
      return false;
    }
    setMenuActive();
    loadStudentAbilityResultSummary();
    loadTechnologyAbilityResultSummary();
  }

  function setMenuActive() {
    switch (model.source) {
      case SOURCE_MY:
        commonUtility.setNavActive(5);
        break;
      case SOURCE_OTHER:
        commonUtility.setNavActive(6);
        break;
    }
  }

  function checkParameters() {
    model.source = commonUtility.getUriParameter('s');
    if (commonUtility.isEmpty(model.source)) {
      $('.kt-parameter-alert').removeClass('kt-hidden');
      return false;
    }
    if (model.sourceList.indexOf(model.source) === -1) {
      $('.kt-parameter-alert').removeClass('kt-hidden');
      return false;
    }
    switch (model.source) {
      case SOURCE_MY:
        model.isLogin = commonUtility.isLogin();
        if (!model.isLogin) {
          $('.kt-login-alert').removeClass('kt-hidden');
          return false;
        }
        model.loginUser = commonUtility.getLoginUser();
        model.universityCode = model.loginUser.universityCode;
        model.schoolID = model.loginUser.schoolID;
        model.studentID = model.loginUser.studentID;
        break;
      case SOURCE_OTHER:
        model.universityCode = commonUtility.getUriParameter('universityCode');
        model.schoolID = commonUtility.getUriParameter('schoolID');
        model.studentID = commonUtility.getUriParameter('studentID');
        if (commonUtility.isEmpty(model.universityCode) ||
            commonUtility.isEmpty(model.schoolID) ||
            commonUtility.isEmpty(model.studentID)) {
          $('.kt-parameter-alert').removeClass('kt-hidden');
          return false;
        }
        break;
    }
    $('.kt-app').removeClass('kt-hidden');
    return true;
  }

  function loadStudentAbilityResultSummary(){
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/studentInfo",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        if (result.detail === null) {
          return false;
        }
        $('.student-name').text(result.detail.fullName);
        if(commonUtility.isEmpty(result.detail.sex) || result.detail.sex === 'M'){
          $('.student-sex').addClass('fa-male kt-font-primary');
        }else{
          $('.student-sex').addClass('fa-female kt-font-danger');
        }
        $('.student-university').text(result.detail.universityName);
        $('.student-school').text(result.detail.schoolName);
        $('.student-enrollment-year').text(result.detail.enrollmentYear + '年');
        $('.student-cellphone').text(result.detail.cellphone);
        $('.student-email').text(result.detail.email);
        if(!commonUtility.isEmpty(result.detail.photo)){
          $('.student-photo').attr('src', result.detail.photo);
        }
        $('.online-question-count').text(result.detail.onlineQuestionCount);
        $('.online-answer-count').text(result.detail.onlineAnswerCount);
        $('.project-count').text(result.detail.joinProjectCount);
      },
      error : function(e){
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadTechnologyAbilityResultSummary() {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/learningTechnology",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        if(commonUtility.isEmptyList(result.list)){
          $('.learning-technology-count').text(0);
          return false;
        }

        $('.learning-technology-count').text(result.list.length);
        result.list.forEach(function (data) {
          $('div.technology-analysis-detail').append(
              `<div class="kt-portlet kt-portlet--collapse" data-technology-id="${data.technologyID}" data-language-id="${data.languageID}" data-ktportlet="true">
                <div class="kt-portlet__head">
                  <div class="kt-portlet__head-label">
                    <h3 class="kt-portlet__head-title">
                      ${data.technologyName}
                    </h3>
                  </div>
                  <div class="kt-portlet__head-toolbar">
                    <div class="kt-portlet__head-group">
                      <a href="javascript:;" data-ktportlet-tool="toggle" data-technology-id="${data.technologyID}" data-language-id="${data.languageID}" class="btn btn-sm btn-icon btn-default btn-pill btn-icon-md btn-show-detail">
                        <i class="la la-angle-down"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="kt-portlet__body" kt-hidden-height="240" style="display: none; overflow: hidden; padding-top: 0px; padding-bottom: 0px;">
                  <div class="kt-widget12">
                    <div class="kt-widget12__content">
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc">专业能力</span>
                          <span class="kt-widget12__value">
                            <span class="ability-level technology${data.technologyID}-level">${data.abilityLevel}</span>
                            <span>超过站内<span class="position-site technology${data.technologyID}-position">${data.positionSite}%</span>的同学</span>
                          </span>
                        </div>
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc">学习完成度</span>
                          <div class="kt-widget12__progress">
                            <div class="progress kt-progress--sm">
                              <div class="progress-bar kt-bg-success learning-percent"
                                   role="progressbar"
                                   aria-valuenow="100"
                                   aria-valuemin="0"
                                   aria-valuemax="100" 
                                   style="width: ${data.finishKnowledgePercent}%"></div>
                            </div>
                            <span class="kt-widget12__stat learning-percent-text">${data.finishKnowledgePercent}%</span>
                          </div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">知识点掌握情况分析</span>
                          <div id="knowledgeAnalysis${data.technologyID}" style="height: 280px;"></div>
                        </div>
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">代码规范出错率分析</span>
                          <div id="codeStandardAnalysis${data.technologyID}" style="height: 280px;"></div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">练习情况数量趋势分析</span>
                          <div id="exerciseAnalysis${data.technologyID}" style="height:300px;"></div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">练习情况百分比趋势分析（%）</span>
                          <div id="exerciseAnalysisPercent${data.technologyID}" style="height:300px;"></div>
                        </div>
                      </div>
  
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">已完成综合练习累计数量</span>
                          <div id="onlineAnswerAnalysis${data.technologyID}" style="max-height:300px;"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`);

          $("div.technology-analysis-detail").on("click",".btn-show-detail",function(){
            let rootElement = $(this).parent().parent().parent().parent();
            if($(rootElement).hasClass('kt-portlet--collapse')){
              $(rootElement).removeClass('kt-portlet--collapse');
              $(rootElement).find('.kt-portlet__body').attr('style', '');

              let technologyID = $(this).attr('data-technology-id');
              let languageID = $(this).attr('data-language-id');
              if($(rootElement).find(`#knowledgeAnalysis${technologyID}`).children().length === 0){
                loadKnowledgeAnalysis(technologyID);
                loadCodeStandardAnalysis(languageID, technologyID);
                loadExerciseAnalysis(technologyID);
                loadExercisePercentAnalysis(technologyID);
              }
            }else{
              $(rootElement).addClass('kt-portlet--collapse');
              $(rootElement).find('.kt-portlet__body').attr('style', 'display: none; overflow: hidden; padding-top: 0px; padding-bottom: 0px;');
            }
          });
        });

        setLevelClass();
      },
      error : function(e){
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function setLevelClass() {
    $('div.technology-analysis-detail').each(function () {
      let levelObject = $(this).find('span.ability-level');

      let level = $(levelObject).text();
      switch (level) {
        case "L1":
          $(levelObject).addClass('ability-level-1');
          break;
        case "L2":
          $(levelObject).addClass('ability-level-2');
          break;
        case "L3":
          $(levelObject).addClass('ability-level-3');
          break;
        case "L4":
          $(levelObject).addClass('ability-level-4');
          break;
        case "L5":
          $(levelObject).addClass('ability-level-5');
          break;
        case "L6":
          $(levelObject).addClass('ability-level-6');
          break;
        case "L7":
          $(levelObject).addClass('ability-level-7');
          break;
        case "L8":
          $(levelObject).addClass('ability-level-8');
          break;
        default:
          break;
      }
    });

  }

  function loadCodeStandardAnalysis(languageID, technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/codeStandardAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        languageID: languageID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        let codeStandardAnalysisList = [];
        if (result.list === null) {
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
        result.list.forEach(function (codeStandard) {
          if(stateColorIndex > colorStateKeyArray.length - 1){
            stateColorIndex = 0;
          }
          codeStandardAnalysisList.push({
            label: codeStandard.codeStandardName,
            data: codeStandard.codeStandardCount,
            color:  KTApp.getStateColor(colorStateKeyArray[stateColorIndex])
          });
          stateColorIndex++;
        });


        $.plot($(`#codeStandardAnalysis${technologyID}`), codeStandardAnalysisList, {
          series: {
            pie: {
              show: true,
              radius: 1,
              label: {
                show: true,
                radius: 1,
                formatter: function(label, series) {
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

      },
      error : function(e){
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }
  function loadKnowledgeAnalysis(technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/knowledgeAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        let data = [
          {label: "未掌握", data: result.detail.noLearningKnowledgeCount, color:  KTApp.getStateColor("brand")},
          {label: "已掌握", data: result.detail.graspKnowledgeCount, color:  KTApp.getStateColor("success")},
          {label: "较薄弱", data: result.detail.weaknessKnowledgeCount, color:  KTApp.getStateColor("danger")}
        ];

        $.plot($(`#knowledgeAnalysis${technologyID}`), data, {
          series: {
            pie: {
              show: true,
              radius: 1,
              label: {
                show: true,
                radius: 1,
                formatter: function(label, series) {
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
      },
      error : function(e){
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }
  function loadExerciseAnalysis(technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/exerciseAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }

        new Morris.Line({
          // ID of the element in which to draw the chart.
          element: `exerciseAnalysis${technologyID}`,
          // Chart data records -- each entry in this array corresponds to a point on
          // the chart.
          data: result.list,
          // The name of the data record attribute that contains x-values.
          xkey: 'months',
          // A list of names of data record attributes that contain y-values.
          ykeys: ['assignTotalCount', 'finishTotalCount', 'onceCompilationSuccessTotalCount', 'onceRunCorrectTotalCount'],
          // Labels for the ykeys -- will be displayed when you hover over the
          // chart.
          labels: ['布置练习数量', '完成练习数量', '一次性编译成功数量', '一次性运行正确数量'],
          lineColors: ['#3d94fb', '#f6aa33', '#2bc9c5', '#1dc94c']
        });

      },
      error : function(e){
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }
  function loadExercisePercentAnalysis (technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/exercisePercentAnalysis",
      data: {
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function(result) {
        if(result.err){
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }

        new Morris.Line({
          // ID of the element in which to draw the chart.
          element: `exerciseAnalysisPercent${technologyID}`,
          // Chart data records -- each entry in this array corresponds to a point on
          // the chart.
          data: result.list,
          // The name of the data record attribute that contains x-values.
          xkey: 'months',
          // A list of names of data record attributes that contain y-values.
          ykeys: ['finishPercent', 'onceCompilationSuccessPercent', 'onceRunCorrectPercent'],
          // Labels for the ykeys -- will be displayed when you hover over the
          // chart.
          labels: ['练习完成率(%)', '一次性编译成功率(%)', '一次性运行正确率(%)'],
          lineColors: ['#f6aa33', '#2bc9c5', '#1dc94c']
        });

      },
      error : function(e){
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  initPage();
});
