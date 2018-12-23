// pages/work/integral_manager/my_integral_detail/my_integral_detail.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
  sellerId:null, //导购id
  score:null,   //积分总数
  scoreData: [   // 1.分享积分2.订单积分3.推广积分4.邀请积分
    {title:'登录积分',type:'4'},
    { title: '分享积分', type: '1' },
    { title: '客户积分', type: '3' },
    { title: '订单积分', type: '2' },
    { title: '沟通积分', type: '5' },
    { title: '异业积分', type: '6' },
  ]
  },

  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.setData({
      sellerId: app.globalData.user_Info.user_id
    })
    this.getAllCode();
  },
 //获取积分总数量
 getAllCode:function(){
   var thisPage = this;
   wx.request({
     url: urls + '/app/selectUserManagerIntegral/' + this.data.sellerId,  // app.globalData.user_Info.user_id 
     header: {
       'content-type': 'application/json' // 默认值
     },
     method: 'get',
     success: function (res) {
       var resData = res.data;
       console.log(resData);
       if (resData.code == 0) {
         thisPage.setData({
           score: resData.result
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
 //页面跳转
 skinpTo:function(e){
   var current = e.currentTarget.dataset;
   var types = current.types;
   var skipUrl = '/pages/work/integral_manager/integral_detail/integral_detail?types=' + types;
   app.skipUpTo(skipUrl, 1);
 },
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
  
  },

})