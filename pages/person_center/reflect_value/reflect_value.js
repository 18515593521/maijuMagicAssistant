// pages/person_center/reflect_value/reflect_value.js

var app = getApp();   //获取应用实例 
var urlPage = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
      money: 0.00,
    getMoney : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    if (parseFloat(options.money) > 0){
      thisPage.setData({
        money: options.money
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

  toReflect : function (){
    var thisPage  = this;
    thisPage.setData({
      getMoney : thisPage.data.money
    })
  },
setMoney : function(e){
  var thisPage = this;
  console.log(e.detail.value)
  if (parseFloat(e.detail.value) > parseFloat(thisPage.data.money)){
    app.showWarnMessage("超出可提现范围，请重新输入!");
    thisPage.setData({
      getMoney:0
    })
    return;
  } 
  

  thisPage.setData({
    getMoney: e.detail.value
  })
},
  getMoney: function () {
    var thisPage = this;
    if (parseFloat(thisPage.data.getMoney) > parseFloat(thisPage.data.money)) {
      app.showWarnMessage("超出可提现范围，请重新输入!");
      thisPage.setData({
        getMoney: 0
      })
      return;
    }

    wx.request({
      url: urlPage + '/app/addSellerCashWithdrawal',  //接口地址 
      data: {           //请求参数 
        appid: app.globalData.user_Info.app_id,
        appid1: app.globalData.appId,
        inviter: app.globalData.user_Info.user_id,
        type: 1,
        money: thisPage.data.getMoney
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功 
        var returnData = res.data;

        if (returnData.code == 0) { //成功 
          app.showSuccessMessage('提现成功')
          setTimeout(function () {
            app.skipUpTo('/pages/myself/myself_commission/myself', 3);
          }, 2000)

        }else {  //失败 
          app.showWarnMessage(returnData.message);
        }
      },
      fail: function (res) {     //失败 
        console.log('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成 
        console.log('请求完成：', res.errMsg);
        wx.stopPullDownRefresh();
      }
    })

  },
  totalMomeny: function () {
    var thisPage = this;
    thisPage.setData({
      getMoney: thisPage.data.money
    })
  }

 
  
})