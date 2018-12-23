// pages/myself/myself/myself.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mySeleftData: null , //登陆的数据
    phone:null, //电话
    isCommercial: false   // 扫一扫的显示与隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var phones = app.globalData.user_Info.userInfo.phone;
    var phone = phones.substr(0, 3) + '****' + phones.substr(7);
    this.setData({
      mySeleftData: app.globalData.user_Info.userInfo,
      phone: phone
    }) 
    if (app.globalData.user_Info.user_limits_role !== 'seller') { //导购 
      this.setData({
        isCommercial:true
      })
    }
  },
//跳转
  skinUp:function(e){
  var current = e.currentTarget.dataset;
  var urls = current.url;
  app.skipUpTo(urls,1);
  },
  //扫码
  scanCode: function (e) {
    app.scanCode('mySelf');
  },
  //退出
  exit:function(e){
    wx.clearStorage();
    var skipUp = "/pages/login/login";
    app.skipUpTo(skipUp,4);
  },
  onShareAppMessage: function (res) {
    return {
      title: '魔方云助手',
      path: '/pages/login/login',
      imageUrl: '/pages/images/bg.jpg',
      success: function (res) {
        app.addPageSharePoint('我的-分享');
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
})