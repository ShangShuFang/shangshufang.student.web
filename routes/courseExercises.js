const express = require('express');
const axios = require('axios');
const marked = require('marked');
const buildUtils = require('../common/buildUtils');
const customerMessage = require('../config/customerMessage');
const router = express.Router();

router.get('/', function (req, res, next) {
	res.render('courseExercises', { title: '随堂练习' });
});

router.get('/data', function (req, res, next) {
	const apiKey = 'studentCourseExercises';
	const courseExercisesID = req.query.courseExercisesID;
	const parameters = [courseExercisesID];
	const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

	axios.get(requestUri)
		.then(result => {
			if (result.data.responseData !== null) {
				result.data.responseData.singleChoiceExercisesList.forEach((data) => {
					data.noAnswer = false;
					data.exercisesTitleHtml = marked(data.exercisesTitle);
				});
				result.data.responseData.multipleChoiceExercisesList.forEach((data) => {

					data.noAnswer = false;
					data.exercisesTitleHtml = marked(data.exercisesTitle);
				});
				result.data.responseData.blankExercisesList.forEach((data) => {
					data.noAnswer = false;
					data.exercisesTitleHtml = marked(data.exercisesTitle);
				});
				result.data.responseData.programExercisesList.forEach((data) => {
					data.noAnswer = false;
					data.sourceCodeUrl = data.submitSourceCodeUrl
					data.originalSourceCodeUrl = data.submitSourceCodeUrl;
					if (data.exercisesSourceType === 0) {
						data.exercisesDocUri = data.exercisesTitle;
						data.exercisesTitle = data.exercisesTitle.substr(data.exercisesTitle.lastIndexOf('/') + 1);
					} else {
						data.exercisesTitleHtml = marked(data.exercisesTitle);
					}
				});
			}
			res.json({
				err: !result.data.result,
				code: result.data.responseCode,
				msg: result.data.responseMessage,
				courseExercises: result.data.responseData
			});
		})
		.catch(error => {
			res.json({
				err: true,
				code: error.code,
				msg: customerMessage[error.code]
			});
		});
});

router.get('/review/program', function (req, res, next) {
	const apiKey = 'programReviewList';
	const courseExercisesID = req.query.courseExercisesID;
	const courseExercisesDetailID = req.query.courseExercisesDetailID;
	const parameters = [courseExercisesID, courseExercisesDetailID];
	const requestUri = buildUtils.buildRequestApiUri(apiKey, parameters);

	axios.get(requestUri)
			.then(result => {
				res.json({
					err: !result.data.result,
					code: result.data.responseCode,
					msg: result.data.responseMessage,
					dataList: result.data.responseData
				});
			})
			.catch(error => {
				res.json({
					err: true,
					code: error.code,
					msg: customerMessage[error.code]
				});
			});
});

router.post('/mark', (req, res, next) => {
	let apiKey = 'markCourseExercises';
	let requestUri = buildUtils.buildRequestApiUri(apiKey);

	axios.post(requestUri, {
		studentID: req.body.studentID,
		courseID: req.body.courseID,
		courseClass: req.body.courseClass,
		courseExercisesID: req.body.courseExercisesID,
		singleChoiceListJson: req.body.singleChoiceListJson,
		multipleChoiceListJson: req.body.multipleChoiceListJson,
		blankChoiceListJson: req.body.blankChoiceListJson,
		programChoiceListJson: req.body.programChoiceListJson
	})
		.then(response => {
			res.json({
				err: !response.data.result,
				code: response.data.responseCode,
				msg: response.data.responseMessage
			});
		})
		.catch(error => {
			res.json({
				err: true,
				code: error.code,
				msg: customerMessage[error.code]
			});
		});
});

module.exports = router;