const app = new Vue({
  el: '#app',
  data: {
    growingList: [],
    selectedGrowing: {},
    selectedGrowingList: []
  },
  methods: {
    initPage: function () {
      tracking.view(trackingSetting.view.growthMap);
      commonUtility.setNavActive(2);
      this.loadGrowingList();
    },
    loadGrowingList: function () {
      axios.get(`/growing_map/list`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        this.growingList = res.data.dataList;
        this.selectedGrowing = res.data.dataList.length > 0 ? res.data.dataList[0] : null;
        this.loadGrowingDetail();
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    loadGrowingDetail: function () {
      if (commonUtility.isEmpty(this.selectedGrowing)) {
        return false;
      }
      axios.get(`/growing_map/list/detail?growingID=${this.selectedGrowing.growingID}`)
      .then(res => {
        if (res.data.err) {
          message.error(localMessage.exception(res.data.code, res.data.msg));
          return false;
        }
        this.selectedGrowingList = res.data.detail.growingMapDetailList;
      })
      .catch(err => {
        message.error(localMessage.NETWORK_ERROR);
      });
    },
    onShowDetail: function (data) {
      this.selectedGrowing = data;
      this.loadGrowingDetail();
    },
  },
  mounted() {
    this.initPage();
  },
});