let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let forgetPasswordRouter = require('./routes/forgetPassword');
let courseCenterRouter = require('./routes/courseCenter');
let technologyInfoRouter = require('./routes/technologyInfo');
let courseDetailRouter = require('./routes/courseDetail');
let abilityAnalysisDetailRouter = require('./routes/abilityAnalysisDetail');
let abilityAnalysisListRouter = require('./routes/abilityAnalysisList');
let growingMapRouter = require('./routes/growingMap');
let recruitStandardRouter = require('./routes/recruitStandard');
let collectionRouter = require('./routes/collection');
let comprehensiveExercisesRouter = require('./routes/comprehensiveExercises');
let courseExercisesRouter = require('./routes/courseExercises');
let comprehensiveCenterRouter = require('./routes/comprehensiveCenter');
let projectCenterRouter = require('./routes/projectCenter');
let qaCenterRouter = require('./routes/qaCenter');
let myFollowRouter = require('./routes/myFollow');
let followMeRouter = require('./routes/followMe');
let myInterviewRouter = require('./routes/myInterview');
let userInfoRouter = require('./routes/userInfo');
let changePasswordRouter = require('./routes/changePassword');
let abilityLevelRouter = require('./routes/abilityLevel');
let suggestRouter = require('./routes/suggest');


let commonRouter = require('./routes/common');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/forgetPassword', forgetPasswordRouter);
app.use('/course/center', courseCenterRouter);
app.use('/technology/info', technologyInfoRouter);
app.use('/course/detail', courseDetailRouter);
app.use('/ability/analysis/detail', abilityAnalysisDetailRouter);
app.use('/ability/analysis/list', abilityAnalysisListRouter);
app.use('/growing_map', growingMapRouter);
app.use('/recruit_standard', recruitStandardRouter);
app.use('/collection', collectionRouter);
app.use('/exercises/comprehensive', comprehensiveExercisesRouter);
app.use('/course/exercises', courseExercisesRouter);
app.use('/center/comprehensive', comprehensiveCenterRouter);
app.use('/center/project', projectCenterRouter);
app.use('/center/qa', qaCenterRouter);
app.use('/center/my/follow', myFollowRouter);
app.use('/center/follow/me', followMeRouter);
app.use('/center/my/interview', myInterviewRouter);
app.use('/center/my/info', userInfoRouter);
app.use('/center/changePassword', changePasswordRouter);
app.use('/ability/level', abilityLevelRouter);
app.use('/suggest', suggestRouter);
app.use('/common', commonRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    collectionRouter
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;