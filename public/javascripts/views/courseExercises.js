const app = new Vue({
	el: '#app',
	data: {
		studentID: 0,
		courseID: 0,
		courseClass: 0,
		courseExercisesID: 0,
		title: '',
		studentName: '',
		dataStatus: '',
		dataStatusText: '',
		createTime: '',
		submitTime: '',
		singleChoiceList: [],
		multipleChoiceList: [],
		blankList: [],
		programList: [],
		loginUser: null,
		isShow: false,
		message: ''
	},
	methods: {
		initPage: function () {
			commonUtility.setNavActive(2);
			this.loadExercises();
		},
		loadExercises: function () {
			let courseExercisesID = commonUtility.getUriParameter('courseExercisesID');
			this.loginUser = commonUtility.getLoginUser();
			if (commonUtility.isEmpty(this.loginUser)) {
				this.isShow = false;
				this.message = '您还没有登录，请先登录才能开始练习！';
				return false;
			}
			//取得练习详细内容 (需要检查当前练习是否是当前学生的练习)
			axios.get('/course/exercises/data'
				.concat(`?courseExercisesID=${courseExercisesID}`))
				.then(response => {
					if (response.data.err) {
						message.error(localMessage.exception(response.data.code, response.data.msg));
						return false;
					}
					if (this.loginUser.studentID !== response.data.courseExercises.studentID) {
						this.isShow = false;
						this.message = '没有查询到您的练习题！';
						return false;
					};

					this.studentID = response.data.courseExercises.studentID;
					this.courseID = response.data.courseExercises.courseID;
					this.courseClass = response.data.courseExercises.courseClass;
					this.courseExercisesID = response.data.courseExercises.courseExercisesID;
					this.title = `${response.data.courseExercises.courseName}（第${response.data.courseExercises.courseClass}节）`;
					this.studentName = response.data.courseExercises.studentName;
					this.createTime = response.data.courseExercises.createTime;
					this.dataStatus = response.data.courseExercises.dataStatus;
					this.dataStatusText = response.data.courseExercises.dataStatusText;
					if (response.data.courseExercises.createTime !== response.data.courseExercises.updateTime) {
						this.submitTime = response.data.courseExercises.updateTime;
					}
					this.singleChoiceList = response.data.courseExercises.singleChoiceExercisesList;
					this.multipleChoiceList = response.data.courseExercises.multipleChoiceExercisesList;
					this.blankList = response.data.courseExercises.blankExercisesList;
					this.programList = response.data.courseExercises.programExercisesList;
					this.isShow = true;
					this.multipleChoiceList.forEach((data) => {
						if (data.selectedOption.length > 0) {
							data.selectedOptionList = data.selectedOption.split(',');
						}
					});
				})
				.catch(err => {
					message.error(localMessage.NETWORK_ERROR);
				})
		},
		checkData: function () {
			let checkResult = true;
			//判断单选题
			if (this.singleChoiceList.length > 0) {
				this.singleChoiceList.forEach((data) => {
					data.noAnswer = false;
					if (data.selectedOptionID === 0) {
						data.noAnswer = true;
						checkResult = false;
					}
				});
			}

			//判断多选题
			if (this.multipleChoiceList.length > 0) {
				this.multipleChoiceList.forEach((data) => {
					data.noAnswer = false;
					if (data.selectedOptionList.length === 0) {
						data.noAnswer = true;
						checkResult = false;
					}
				});
			}

			//判断填空题
			if (this.blankList.length > 0) {
				this.blankList.forEach((data) => {
					data.noAnswer = false;
					if (commonUtility.isEmpty(data.fillInContent)) {
						data.noAnswer = true;
						checkResult = false;
					}
				});
			}

			//判断编程题
			if (this.programList.length > 0) {
				this.programList.forEach((data) => {
					data.noAnswer = false;
					if (commonUtility.isEmpty(data.sourceCodeUrl)) {
						data.noAnswer = true;
						checkResult = false;
					}
				});
			}

			return checkResult;
		},
		getSingleChoiceAnswerJson: function () {
			let singleChoiceAnswerList = [];
			this.singleChoiceList.forEach((data) => {
				singleChoiceAnswerList.push({
					courseExercisesDetailID: data.courseExercisesDetailID,
					selectedOption: data.selectedOptionID,
					correctResult: data.correctResult
				});
			});
			return JSON.stringify(singleChoiceAnswerList);
		},
		getMultipleChoiceAnswerJson: function () {
			let multipleChoiceAnswerList = [];
			this.multipleChoiceList.forEach((data) => {
				multipleChoiceAnswerList.push({
					courseExercisesDetailID: data.courseExercisesDetailID,
					selectedOption: data.selectedOptionList.join(','),
					correctResult: data.correctResult
				});
			});
			return JSON.stringify(multipleChoiceAnswerList);
		},
		getBlankAnswerJson: function () {
			let blankAnswerList = [];
			this.blankList.forEach((data) => {
				blankAnswerList.push({
					courseExercisesDetailID: data.courseExercisesDetailID,
					fillInContent: data.fillInContent,
					correctResult: data.correctResult
				});
			});
			return JSON.stringify(blankAnswerList);
		},
		getProgramAnswerJson: function () {
			let programAnswerList = [];
			this.programList.forEach((data) => {
				if (data.sourceCodeUrl !== data.originalSourceCodeUrl) {
					programAnswerList.push({
						courseExercisesDetailID: data.courseExercisesDetailID,
						sourceCodeUrl: data.sourceCodeUrl,
						correctResult: data.correctResult
					});
				}
			});
			return JSON.stringify(programAnswerList);
		},
		onSubmit: function () {
			if (!this.checkData()) {
				message.info("你还有未完成的习题，请完成所有习题后再提交！");
				return false;
			}
			let btn = $('#btnSubmit');
			$(btn).attr('disabled', true);
			KTApp.progress(btn);

			let singleChoiceAnswerJson = this.getSingleChoiceAnswerJson();
			let multipleChoiceAnswerJson = this.getMultipleChoiceAnswerJson();
			let blankAnswerJson = this.getBlankAnswerJson();
			let programAnswerJson = this.getProgramAnswerJson();
			let that = this;

			axios.post('/course/exercises/mark', {
				studentID: this.studentID,
				courseID: this.courseID,
				courseClass: this.courseClass,
				courseExercisesID: this.courseExercisesID,
				singleChoiceListJson: singleChoiceAnswerJson,
				multipleChoiceListJson: multipleChoiceAnswerJson,
				blankChoiceListJson: blankAnswerJson,
				programChoiceListJson: programAnswerJson
			})
				.then(function (res) {
					if (res.data.err) {
						message.error(localMessage.exception(res.data.code, res.data.msg));
						return false;
					}
					that.loadExercises();
					KTApp.unprogress(btn);
					$(btn).removeAttr('disabled');
					message.info("选择、填空题已批改，编程题大约48小时批改完成");
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