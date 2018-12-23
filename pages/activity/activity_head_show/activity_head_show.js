// pages/activity/activity_head_show/activity_head_show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImgNum:null,  //头像的数据
    img_show_hide:false   //头像显示与隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('activity_head'); //获取请求的

    if (value.pictures.length>0){
      this.setData({
        headImgNum: value.pictures,  //数据
        img_show_hide:true
      })
    }else{
      this.setData({
        img_show_hide: false
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})