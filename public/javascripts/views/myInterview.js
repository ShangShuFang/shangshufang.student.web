const app = new Vue({
    el: '#app',
    data: {
        loginUser: commonUtility.getLoginUser(),
    },
    methods: {
        initPage: function() {
            tracking.view(trackingSetting.view.myInterview);
            commonUtility.setUserCenterActive();
        }
    },
    mounted() {
        this.initPage();
    },
});