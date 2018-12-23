// pages/work/vr/vr.js
const app = getApp()
var url = app.globalData.domainName;        //请求域名 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vrUrls:null //路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var urls = options.url;
    this.setData({
      vrUrls: options.urls
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  //转发
  onShareAppMessage: function (res) {
    var thisPage = this;
    return {
      title: app.globalData.user_Info.userInfo.filiale,
      path: '/pages/share/share?P1=J' + '&appId=' + app.globalData.user_Info.app_id + '&P3=' + app.globalData.user_Info.user_id,
      imageUrl: '/pages/images/bg.jpg',
      success: function (res) {
        app.addPageSharePoint('全景-分享');
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
})