// pages/myself/aboutUs/aboutUs.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
//跳转
  skinUp:function(e){
    var current = e.currentTarget.dataset;
    var skinUp = current.url;
    app.skipUpTo(skinUp, 1);

  },
//拨打电话
  calling:function(e){
    wx.makePhoneCall({
      phoneNumber:'400-770-8866',
      success: function () {
        console.log("成功拨打电话")
      }
    })
  }
})