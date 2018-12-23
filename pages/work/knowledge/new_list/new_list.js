// pages/work/knowledge/new_list/new_list.js
var app = getApp();   //获取应用实例
var urls = app.globalData.domainName;        //请求域名
Page({
  data: {
      new_list_data:[], //新闻信息
      page: 1,//当前页
      pageSize: 10, //一页展示几个
      total: 0,  //总页数
      isTureFalsePage: true,  // 是否分页
  },
  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.getData(1);
  },
//获得具体数据
  getData: function (num){
  var thisPage = this;
  wx.request({
    url: urls + '/helper/querynews',  // app.globalData.user_Info.user_id 
    header: {
      'content-type': 'application/json' // 默认值
    },
    data:{
      page: num,//当前页
      pageSize: thisPage.data.pageSize, //一页展示几个
      total: 0,  //总页数
      isTureFalsePage: true,  // 是否分页
      param:{
        sys_user_id: app.globalData.user_Info.factoryId   
      } 
    },
    method: 'post',
    success: function (res) {
      var resData = res.data;
      console.log(resData);
      if (resData.code == 0) {
        var resultData = resData.result.data;

        var isTureFalsePage = true;
        if (resultData.length < thisPage.data.pageSize) {
          var isTureFalsePage = false;
        }
        if (num > 1) {
          resultData = thisPage.data.new_list_data.concat(resultData);
        }
        thisPage.setData({
          new_list_data: resData.result.data,
          isTureFalsePage: isTureFalsePage,
          page: resData.result.page,  //当前页面
          total: resData.result.total,  //总条数
        })

      } else if (resData.code == 1) {
        console.log("获取数据失败");
      }
    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//跳转
  skinpTo:function(e){
    var current = e.currentTarget.dataset;
    var id = current.id;
    var skipUrl = '/pages/work/knowledge/new_detail/new_detail?id=' + id;
    app.skipUpTo(skipUrl, 1);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.getData(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },
  onPullDownRefresh: function () {
    // app.showWarnMessage("刷新中！");
    this.getData(1);    //列表请求活动数据
    wx.stopPullDownRefresh();  //页面自己回去！！
  },
  //转发
  // onShareAppMessage: function (res) {
  //   return {
  //     title: '魔方云助手',
  //     path: '/pages/login/login',
  //     imageUrl: '/pages/images/bg.jpg',
  //     success: function (res) {
  //       app.addPageSharePoint('分享');
  //       // 转发成功
  //     },
  //     fail: function (res) {

  //       // 转发失败
  //     }
  //   }
  // },
})