// pages/work/integral_manager/integral_detail/integral_detail.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
var until = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:null ,  //积分类型
    scoreData: ['','分享积分详情', '订单积分详情', '客户积分详情', '登录积分详情', '沟通积分详情','异业积分详情'],//登录4    分享1     客户3     订单2    沟通5
    page: 1,//当前页
    pageSize: 11, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    scoreDataList:[] //积分数据信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    thisPage.setData({
      types: options.types,   
    })
    var titles = thisPage.data.scoreData[options.types];
    wx.setNavigationBarTitle({
      title: titles
    })
    thisPage.getScoreData(1);
  },
//获得具体积分的信息
getScoreData:function(num){
  var thisPage = this;
  wx.request({
    url: urls + '/app/selectUserManagerIntegralManagement',  
    header: {
      'content-type': 'application/json' // 默认值
    },
    data:{
      page: num,
      pageSize: thisPage.data.pageSize,
      ispage:true,
      param:{
        userManagerId: app.globalData.user_Info.user_id,
        integralType: thisPage.data.types
      }
    },
    method: 'post',
    success: function (res) {
      var resData = res.data;
    //  console.log(resData+'--請求成功！！');
      if (resData.code == 0) {
        var resultData = resData.result.data;

        var isTureFalsePage = true;
        if (resultData.length < thisPage.data.pageSize) {
          var isTureFalsePage = false;
        }
        if (num > 1) {
          resultData = thisPage.data.scoreDataList.concat(resultData);
        }
        for (var i = 0; i < resultData.length;i++){
          var cases = resultData[i];
          if (cases.create_time || !isNaN(cases.create_time)){
            cases.create_time = (until.switchTime(cases.create_time, 'dateTime').replace(/-/g, '/'));
            console.log('--订单积分' + cases.create_time);
         }
        }
       
        thisPage.setData({
          scoreDataList: resultData,
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
/* 页面上拉触底事件的处理函数*/
onReachBottom: function () {
  if (this.data.isTureFalsePage) {
    var pages = this.data.page + 1;
    this.getScoreData(pages);
  } else {
    app.showWarnMessage('没有更多数据了！');
  }
},
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
  
  },

})