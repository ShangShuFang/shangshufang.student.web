const app = new Vue({
    el: '#app',
    data: {
        loginUser: commonUtility.getLoginUser(),
    },
    methods: {
        initPage: function() {
            commonUtility.setUserCenterActive();
        }
    },
    mounted() {
        this.initPage();
    },
});