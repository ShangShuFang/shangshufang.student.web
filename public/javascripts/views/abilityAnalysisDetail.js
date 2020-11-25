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
    sourceList: ['m', 'o'],

    technologyID: 0,
    languageID: 0
  };

  let finishKnowledgeModel = {
    pageNumber: 1,
    totalCount: 0,
    dataList: []
  };
  let weaknessKnowledgeModel = {
    pageNumber: 1,
    totalCount: 0,
    dataList: []
  };
  let noLearningKnowledgeModel = {
    pageNumber: 1,
    totalCount: 0,
    dataList: []
  };
  let codeStandardModel = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: []
  };
  let weakKnowledgeModel = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: []
  };
  let knowledgeExercisesModel = {
    dataStatus: 'NULL',
    fromIndex: 0,
    toIndex: 0,
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: [],
    prePageNum: -1,
    nextPageNum: -1
  };

  function initPage() {
    if (!checkParameters()) {
      return false;
    }
    setMenuActive();
    loadStudentAbilitySummary();
    loadLearningTechnologyList();
  }

  function setMenuActive() {
    switch (model.source) {
      case SOURCE_MY:
        commonUtility.setNavActive(4);
        break;
      case SOURCE_OTHER:
        commonUtility.setNavActive(5);
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

  function loadStudentAbilitySummary() {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/studentInfo",
      data: {studentID: model.studentID},
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }
        if (result.studentInfo === null) {
          return false;
        }
        $('.student-name').text(result.studentInfo.fullName);
        if (commonUtility.isEmpty(result.studentInfo.sex) || result.studentInfo.sex === 'M') {
          $('.student-sex').addClass('fa-male kt-font-primary');
        } else {
          $('.student-sex').addClass('fa-female kt-font-danger');
        }
        $('.student-university').text(result.studentInfo.universityName);
        $('.student-school').text(result.studentInfo.schoolName);
        $('.student-enrollment-year').text(result.studentInfo.enrollmentYear.substr(0, 4) + '年');
        $('.student-cellphone').text(result.studentInfo.cellphone);
        $('.student-email').text(result.studentInfo.email);
        if (!commonUtility.isEmpty(result.studentInfo.photo)) {
          $('.student-photo').attr('src', result.studentInfo.photo);
        }
        $('.online-question-count').text(result.studentInfo.onlineQuestionCount);
        $('.online-answer-count').text(result.studentInfo.onlineAnswerCount);
        $('.project-count').text(result.studentInfo.joinProjectCount);
      },
      error: function (e) {
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadLearningTechnologyList() {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/learningTechnology",
      data: {
        studentID: model.studentID,
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          bootbox.alert(localMessage.formatMessage(result.code, result.msg));
          return false;
        }
        if (commonUtility.isEmptyList(result.list)) {
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
                                   style="width: ${data.finishedKnowledgePercent}%"></div>
                            </div>
                            <span class="kt-widget12__stat learning-percent-text">${data.finishedKnowledgePercent}%</span>
                          </div>
                        </div>
                      </div>
                      <div class="kt-widget12__item">
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">
                            知识点掌握情况分析 <a href="javascript:" class="kt-link--info btn-detail-knowledge" data-technology-id="${data.technologyID}">(查看数据)</a>
                          </span>
                          <div id="knowledgeAnalysis${data.technologyID}" style="height: 280px;"></div>
                        </div>
                        <div class="kt-widget12__info">
                          <span class="kt-widget12__desc text-center">代码规范问题分析 <a href="javascript:" class="kt-link--info btn-detail-code-standard" data-technology-id="${data.technologyID}">(查看数据)</a></span>
                          <div id="codeStandardAnalysis${data.technologyID}" style="height: 280px;"></div>
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

          $("div.technology-analysis-detail").on("click", ".btn-show-detail", function () {
            let rootElement = $(this).parent().parent().parent().parent();
            if ($(rootElement).hasClass('kt-portlet--collapse')) {
              $(rootElement).removeClass('kt-portlet--collapse');
              $(rootElement).find('.kt-portlet__body').attr('style', '');

              model.technologyID = $(this).attr('data-technology-id');
              model.languageID = $(this).attr('data-language-id');
              if ($(rootElement).find(`#knowledgeAnalysis${model.technologyID}`).children().length === 0) {
                loadKnowledgeAnalysis(model.technologyID);
                loadCodeStandardAnalysis(model.languageID, model.technologyID);
              }
            } else {
              $(rootElement).addClass('kt-portlet--collapse');
              $(rootElement).find('.kt-portlet__body').attr('style', 'display: none; overflow: hidden; padding-top: 0px; padding-bottom: 0px;');
            }
          })

          $("div.technology-analysis-detail").on("click", ".btn-detail-knowledge", function () {
            model.technologyID = $(this).attr('data-technology-id');

            finishKnowledgeModel.pageNumber = 1;
            finishKnowledgeModel.totalCount = 0;
            finishKnowledgeModel.dataList = [];
            $('.finish-knowledge .kt-list-timeline__item').remove();

            weaknessKnowledgeModel.pageNumber = 1;
            weaknessKnowledgeModel.totalCount = 0;
            weaknessKnowledgeModel.dataList = [];
            $('.weakness-knowledge .kt-list-timeline__item').remove();

            noLearningKnowledgeModel.pageNumber = 1;
            noLearningKnowledgeModel.totalCount = 0;
            noLearningKnowledgeModel.dataList = [];
            $('.noLearning-knowledge .kt-list-timeline__item').remove();

              loadFinishKnowledge();
              loadWeaknessKnowledge();
              loadNoLearningKnowledge();
            $('#kt_modal_knowledge').modal('show');
          });

          $("div.technology-analysis-detail").on("click", ".btn-detail-code-standard", function () {
            model.technologyID = $(this).attr('data-technology-id');
            $('#kt_modal_code_standard').modal('show');
          });
        });

        setLevelClass();
      },
      error: function (e) {
        bootbox.alert(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadFinishKnowledge() {
    $.ajax({
      type: 'GET',
      url: '/ability/analysis/detail/knowledge/finish',
      data: {
        pageNumber: finishKnowledgeModel.pageNumber,
        studentID: model.studentID,
        technologyID: model.technologyID
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        $('#finish_knowledge_title').text(commonUtility.isEmptyList(result.list) ? `已掌握的知识点（0）` : `已掌握的知识点（${result.list.length}）`)
        if (commonUtility.isEmptyList(result.list)) {
          if (finishKnowledgeModel.totalCount > 0) {
            $('.finish-knowledge-more').addClass('kt-hidden');
            $('.finish-knowledge-message-complete').removeClass('kt-hidden');
            $('.finish-knowledge-message-none').addClass('kt-hidden');
            return false;
          }
          $('.finish-knowledge-message-complete').addClass('kt-hidden');
          $('.finish-knowledge-message-none').removeClass('kt-hidden');
          return false;
        }
        finishKnowledgeModel.totalCount += result.list.length;
        result.list.forEach((data) => {
          $('.finish-knowledge').append(
              `<div class="kt-list-timeline__item">
                <span class="kt-list-timeline__badge kt-list-timeline__badge--success"></span>
                <span class="kt-list-timeline__text">${data.knowledgeName}</span>
               </div>`);
        });
        if (finishKnowledgeModel.totalCount >= result.totalCount) {
          $('.finish-knowledge-more').removeClass('kt-hidden');
        }
        $('.finish-knowledge-message-complete').addClass('kt-hidden');
        $('.finish-knowledge-message-none').addClass('kt-hidden');
      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadWeaknessKnowledge() {
    $.ajax({
      type: 'GET',
      url: '/ability/analysis/detail/knowledge/weak',
      data: {
        pageNumber: weakKnowledgeModel.pageNumber,
        studentID: model.studentID,
        technologyID: model.technologyID
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        $('#learning_knowledge_title').text(commonUtility.isEmptyList(result.list) ? `正在练习的知识点（0）` : `正在练习的知识点（${result.list.length}）`)
        if (commonUtility.isEmptyList(result.list)) {
          if (weakKnowledgeModel.totalCount > 0) {
            $('.weakness-knowledge-more').addClass('kt-hidden');
            $('.weakness-knowledge-message-complete').removeClass('kt-hidden');
            $('.weakness-knowledge-message-none').addClass('kt-hidden');
            return false;
          }
          $('.weakness-knowledge-message-complete').addClass('kt-hidden');
          $('.weakness-knowledge-message-none').removeClass('kt-hidden');
          return false;
        }
        weakKnowledgeModel.totalCount += result.list.length;
        result.list.forEach((data) => {
          $('.weakness-knowledge').append(
              `<div class="kt-list-timeline__item">
                <span class="kt-list-timeline__badge kt-list-timeline__badge--danger"></span>
                <span class="kt-list-timeline__text">${data.knowledgeName}</span>
               </div>`);
        });
        if (weakKnowledgeModel.totalCount >= result.totalCount) {
          $('.weakness-knowledge-more').addClass('kt-hidden');
        }

        $('.weakness-knowledge-message-complete').addClass('kt-hidden');
        $('.weakness-knowledge-message-none').addClass('kt-hidden');
      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadNoLearningKnowledge() {
    $.ajax({
      type: 'GET',
      url: '/ability/analysis/detail/knowledge/noLearning',
      data: {
        pageNumber: noLearningKnowledgeModel.pageNumber,
        studentUniversityCode: model.universityCode,
        studentSchoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: model.technologyID
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        $('#pending_knowledge_title').text(commonUtility.isEmptyList(result.list) ? `未掌握的知识点（0）` : `未掌握的知识点（${result.list.length}）`)
        if (commonUtility.isEmptyList(result.list)) {
          if (noLearningKnowledgeModel.totalCount > 0) {
            $('.noLearning-knowledge-more').addClass('kt-hidden');
            $('.noLearning-knowledge-message-complete').removeClass('kt-hidden');
            $('.noLearning-knowledge-message-none').addClass('kt-hidden');
            return false;
          }
          $('.noLearning-knowledge-message-complete').addClass('kt-hidden');
          $('.noLearning-knowledge-message-none').removeClass('kt-hidden');
          return false;
        }
        noLearningKnowledgeModel.totalCount += result.list.length;
        result.list.forEach((data) => {
          $('.noLearning-knowledge').append(
              `<div class="kt-list-timeline__item">
                <span class="kt-list-timeline__badge kt-list-timeline__badge--primary"></span>
                <span class="kt-list-timeline__text">${data.knowledgeName}</span>
               </div>`);
        });
        if (noLearningKnowledgeModel.totalCount >= result.totalCount) {
          $('.noLearning-knowledge-more').addClass('kt-hidden');
        } else {
          $('.noLearning-knowledge-more').removeClass('kt-hidden');
        }

        $('.noLearning-knowledge-message-complete').addClass('kt-hidden');
        $('.noLearning-knowledge-message-none').addClass('kt-hidden');

      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadStudentExercise() {
    $.ajax({
      type: 'GET',
      url: '/ability/analysis/detail/exercise/list',
      data: {
        pageNumber: knowledgeExercisesModel.pageNumber,
        universityCode: model.universityCode,
        schoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: model.technologyID,
        dataStatus: knowledgeExercisesModel.dataStatus
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        knowledgeExercisesModel.totalCount = result.dataContent.totalCount;
        knowledgeExercisesModel.dataList = result.dataContent.dataList;
        knowledgeExercisesModel.pageNumber = parseInt(result.dataContent.currentPageNum);
        knowledgeExercisesModel.maxPageNumber = Math.ceil(result.dataContent.totalCount / result.dataContent.pageSize);
        knowledgeExercisesModel.paginationArray = result.dataContent.paginationArray;
        knowledgeExercisesModel.prePageNum = result.dataContent.prePageNum === undefined ? -1 : parseInt(result.dataContent.prePageNum);
        knowledgeExercisesModel.nextPageNum = result.dataContent.nextPageNum === undefined ? -1 : parseInt(result.dataContent.nextPageNum);
        knowledgeExercisesModel.fromIndex = result.dataContent.dataList === null ? 0 : (knowledgeExercisesModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + 1;
        knowledgeExercisesModel.toIndex = result.dataContent.dataList === null ? 0 : (knowledgeExercisesModel.pageNumber - 1) * Constants.PAGE_SIZE.PAGE_SIZE_10 + knowledgeExercisesModel.dataList.length;

        if (commonUtility.isEmptyList(knowledgeExercisesModel.dataList)) {
          $('#table_exercise tbody').empty();
          $('ul.exercise-pagination').empty();
          $('.kt-pagination__toolbar').empty();
          return false;
        }
        $('#table_exercise tbody').empty();
        knowledgeExercisesModel.dataList.forEach((data) => {
          let tr =
              `<tr>
                <td style="width: 25%">${data.knowledgeName}</td>
                <td style="width: 25%"><a href="${data.exercisesDocumentUrl}" class="kt-link--info" target="_blank">${data.exercisesDocumentUrl.substr(data.exercisesDocumentUrl.lastIndexOf('/') + 1)}</a></td>
                <td style="width: 15%">${data.createTime}</td>`
          if (data.dataStatus !== 'P') {
            tr = tr + `<td style="width: 15%">${data.updateTime}</td>`
          } else {
            tr = tr + `<td style="width: 15%">&nbsp;</td>`
          }

          switch (data.dataStatus) {
            case 'P':
              tr = tr + `<td style="width: 10%"><span class="kt-badge kt-badge--brand kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
              break;
            case 'W':
              tr = tr + `<td style="width: 10%"><span class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
              break;
            case 'R':
              tr = tr + `<td style="width: 10%"><span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
              break;
            case 'S':
              tr = tr + `<td style="width: 10%"><span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">${data.dataStatusText}</span></td>`;
              break;
          }
          if (!commonUtility.isEmpty(data.sourceCodeGitUrl)) {
            tr = tr +
                `  <td style="width: 10%"> <a href="${data.sourceCodeGitUrl}" class="kt-link--info" target="_blank">查看</a> </td>
            </tr>`;
          } else {
            tr = tr +
                `  <td style="width: 10%">&nbsp;</td>
            </tr>`;
          }
          $('#table_exercise tbody').append(tr);
        });

        $('ul.exercise-pagination').empty();
        $('ul.exercise-pagination').append(
            `<li class="kt-pagination__link--first">
                  <a href="javascript:"><i class="fa fa-angle-double-left kt-font-warning"></i></a>
                </li>
                <li class="kt-pagination__link--prev">
                  <a href="javascript:"><i class="fa fa-angle-left kt-font-warning"></i></a>
               </li>`);
        if (!commonUtility.isEmptyList(knowledgeExercisesModel.paginationArray)) {
          knowledgeExercisesModel.paginationArray.forEach((pagination) => {
            if (knowledgeExercisesModel.pageNumber === pagination) {
              $('ul.exercise-pagination').append(`<li class="kt-pagination kt-pagination__link--active"><a href="javascript:">${pagination}</a></li>`);
            } else {
              $('ul.exercise-pagination').append(`<li class="kt-pagination"><a href="javascript:">${pagination}</a></li>`);
            }
          });
        }
        $('ul.exercise-pagination').append(
            `<li class="kt-pagination__link--next">
                <a href="javascript:"><i class="fa fa-angle-right kt-font-warning"></i></a>
               </li>
               <li class="kt-pagination__link--last">
                <a href="javascript:"><i class="fa fa-angle-double-right kt-font-warning"></i></a>
               </li>`);

        $('.kt-pagination__toolbar').text(`显示第${knowledgeExercisesModel.fromIndex}到第${knowledgeExercisesModel.toIndex}条数据，共计${knowledgeExercisesModel.totalCount}条数据`);

        $('ul.exercise-pagination .kt-pagination__link--first').off().click(function () {
          if (knowledgeExercisesModel.pageNumber === 1) {
            return false;
          }
          knowledgeExercisesModel.pageNumber = 1;
          setActivePagination();
          loadStudentExercise();
        });

        $('ul.exercise-pagination .kt-pagination__link--prev').off().click(function () {
          if (knowledgeExercisesModel.pageNumber === 1) {
            return false;
          }
          knowledgeExercisesModel.pageNumber--;
          setActivePagination();
          loadStudentExercise();
        });

        $('ul.exercise-pagination .kt-pagination').off().click(function () {
          let pagination = parseInt($(this).text());
          if (knowledgeExercisesModel.pageNumber === pagination) {
            return false;
          }
          knowledgeExercisesModel.pageNumber = pagination;
          setActivePagination();
          loadStudentExercise();
        });

        $('ul.exercise-pagination .kt-pagination__link--next').off().click(function () {
          if (knowledgeExercisesModel.pageNumber === knowledgeExercisesModel.maxPageNumber) {
            return false;
          }
          knowledgeExercisesModel.pageNumber++;
          setActivePagination();
          loadStudentExercise();
        });

        $('ul.exercise-pagination .kt-pagination__link--last').off().click(function () {
          if (knowledgeExercisesModel.pageNumber === knowledgeExercisesModel.maxPageNumber) {
            return false;
          }
          knowledgeExercisesModel.pageNumber = knowledgeExercisesModel.maxPageNumber;
          setActivePagination();
          loadStudentExercise();
        });
      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function setActivePagination() {
    $('ul.exercise-pagination .kt-pagination').removeClass('kt-pagination__link--active');
    $.each($('ul.exercise-pagination .kt-pagination'), function (index, pagination) {
      if (parseInt($(pagination).text()) === knowledgeExercisesModel.pageNumber) {
        $(pagination).addClass('kt-pagination__link--active');
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
        studentID: model.studentID,
        languageID: languageID,
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
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
        result.list.forEach(function (codeStandard, index) {
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


        $.plot($(`#codeStandardAnalysis${model.technologyID}`), codeStandardAnalysisList, {
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

      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadWeakKnowledgeAnalysis(technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/knowledge/weak",
      data: {
        pageNumber: weakKnowledgeModel.pageNumber,
        universityCode: model.universityCode,
        schoolID: model.schoolID,
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        let elementObj = $(`#weakKnowledge${technologyID}`);
        weakKnowledgeModel.totalCount = result.totalCount;
        if (weakKnowledgeModel.totalCount === 0) {
          $(elementObj).append('<div class="text-center">暂时没有薄弱的知识点</div>');
          return false;
        }
        weakKnowledgeModel.maxPageNumber = Math.ceil(result.dataContent.totalCount / result.dataContent.pageSize);
        weakKnowledgeModel.dataList = result.dataContent.dataList;

        let dataListHtml =
            '<table class="table table-striped text-center">\n' +
            '  <thead>\n' +
            '  <tr>\n' +
            '    <th style="width: 15%;">#</th>\n' +
            '    <th style="width: 70%;">知识点名称</th>\n' +
            '    <th style="width: 15%;">修改次数</th>\n' +
            '  </tr>\n' +
            '  </thead>\n' +
            '  <tbody>';

        weakKnowledgeModel.dataList.forEach(function (data, index) {
          dataListHtml +=
              `  <tr>
                  <th scope="row" style="width: 15%;">${index + 1}</th>
                  <td style="width: 70%;">${data.knowledgeName}</td>
                  <td style="width: 15%;">${data.reviewCount}</td>
                </tr>`;
        });

        dataListHtml +=
            '  </tbody>\n' +
            '</table>';

        $(elementObj).append(dataListHtml);
      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  function loadKnowledgeAnalysis(technologyID) {
    $.ajax({
      type: "GET",
      url: "/ability/analysis/detail/knowledgeAnalysis",
      data: {
        studentID: model.studentID,
        technologyID: technologyID,
      },
      dataType: "JSON",
      success: function (result) {
        if (result.err) {
          message.error(localMessage.exception(result.code, result.msg));
          return false;
        }
        let data = [
          {label: "未掌握", data: result.detail.noLearnKnowledgeCount, color: KTApp.getStateColor("brand")},
          {label: "已掌握", data: result.detail.finishedKnowledgePercent, color: KTApp.getStateColor("success")},
          {label: "练习中", data: result.detail.weaknessKnowledgeCount, color: KTApp.getStateColor("danger")}
        ];

        $.plot($(`#knowledgeAnalysis${model.technologyID}`), data, {
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
      },
      error: function (e) {
        message.error(localMessage.NETWORK_ERROR);
      }
    });
  }

  $('.btn-filter').click(function () {
    knowledgeExercisesModel.dataStatus = $(this).attr('data-status');
    knowledgeExercisesModel.pageNumber = 1;
    $('.btn-filter').removeClass('btn-info');
    $('.btn-filter').addClass('btn-outline-hover-info');
    $(this).addClass('btn-info');
    $(this).removeClass('btn-outline-hover-info');
    loadStudentExercise();
  });
  initPage();
});