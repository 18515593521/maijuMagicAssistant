// pages/member/member.js
var app = getApp();   //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId:null,
    radioList: [{ "value": 1, "checked": false, "name": "卡内扣款" }, { "value": 2, "checked": true, "name": "线下支付" }],
    payType:2,
    vipInfo:null,
    remark:null,
    hidden :true,
    titleText:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    var customerId = options.customerId
    thisPage.selectCustomerInfo(customerId);
 
    thisPage.setData({
      customerId: customerId
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
    
    console.log(app.globalData.userInfo)

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
//点击
  skinUp:function(e){
    var dataSet = e.currentTarget.dataset;
    var url = dataSet.url;
    var type = dataSet.types;
    app.pageSkip(url, type);
  },
  radioChange :function(e){
    var thisPage = this;
    var value = e.detail.value
    thisPage.setData({
        payType : value,
    })
  },
  selectCustomerInfo: function (customerId){
    var thisPage = this;
    wx.request({
      url: app.globalData.domainName + '/app/selectCustomerVipInfo1/' + customerId,  //接口地址
      method: 'get',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;

        if (returnData.code == 0){ //成功
          console.log(returnData)
          if (returnData.result) {
            console.log(returnData.result)
            var titleText = '';
            if (returnData.result.use_type == 1 && returnData.result.use_type == 3){
              titleText ='请输入本次扣除次数';
            }else{
              titleText = '请输入本次扣款金额';
            }
            thisPage.setData({
              "vipInfo": returnData.result,
              titleText: titleText
            })
          } else {
            thisPage.setData({
              vipType: 0
            })
          }
        } else {  //失败
          app.showWarnMessage(returnData.message);
        }
      },
      fail: function (res) {     //失败
        console.log('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成
        console.log('请求完成：', res.errMsg);
      }
    })
  },
  onbindblur:function(event){
    var thisPage = this;
    var payMoney = event.detail.value
    if (!isNaN(payMoney)){
      var dot = payMoney.indexOf(".");
      if (dot != -1){
        var dotCnt = payMoney.substring(dot + 1, payMoney.length);
        if (dotCnt.length > 2) {
          app.showWarnMessage("最多只能有两位小数！")
          return;
        }
      }


      var payMoney1 = 0;
      if (thisPage.data.vipInfo.type == 2) {
        payMoney1 = payMoney * thisPage.data.vipInfo.balance /10;
      } else if (thisPage.data.vipInfo.type == 3){
        payMoney1 = payMoney;
      }
      
      thisPage.setData({
        payMoney : payMoney,
        payMoney1: payMoney1
      })
      
    }else{
      app.showWarnMessage("请输入正确的数字！")
    }
  }, 
  submit:function(){
    var thisPage = this;
    var payMoney = thisPage.data.payMoney;
    if (!payMoney){
      app.showWarnMessage("请输入扣款金额！")
      return;
    }
    var remaining_money = thisPage.data.vipInfo.remaining_money
    if (thisPage.data.vipInfo.type == 2 && thisPage.data.vipInfo.use_type == 2   ){
      if (thisPage.data.payType == 1){
        if (remaining_money < parseFloat(thisPage.data.payMoney1)) {
          app.showWarnMessage("余额不足!")
          return;
        }
      }
    }
    if (thisPage.data.vipInfo.type == 3 ){
      
      if (thisPage.data.vipInfo.remaining_balance < parseFloat(payMoney)) {
          app.showWarnMessage("剩余次数不足!")
          return;
        
      }else{
        if (thisPage.data.payType == 1) {
          if (thisPage.data.vipInfo.remaining_money < parseFloat(payMoney)) {
            app.showWarnMessage("余额不足!")
            return;
          }
        }
      }
    }

    var data ={
      "payMoney": payMoney,
      "remark": thisPage.data.remark ,
      "customerId": thisPage.data.customerId,
      "sellerId": app.globalData.user_Info.user_id,
      "payType": thisPage.data.payType
    }

    // if (thisPage.data.vipInfo.use_type == 2 && thisPage.data.vipInfo.type == 1){
    //   data.payType = 1;
    // } else if (thisPage.data.vipInfo.use_type == 1 && thisPage.data.vipInfo.type == 3){
    //   data.payType = 1;
    // }

    wx.showModal({
      title: '核销',
      content: "请确认是否核销本次消费,确认后不可修改.",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domainName + '/app/addCUstomerBuyInfo',  //接口地址
            method: 'post',
            dataType: 'json',
            data: data,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {  //成功
              var returnData = res.data;
              if (returnData.code == 0) { //成功
                app.showSuccessMessage("扣款成功!")
                var work = "/pages/work/index/work";
                //app.skipUpTo(work, 2);
                app.backGo(1);
              } else if (returnData.code == 2) {  //失败
                thisPage.setData({
                  hidden : false
                })
                return;
              } else {  //失败
                app.showWarnMessage(returnData.message);
              }
            },
            fail: function (res) {     //失败
              console.log('请求失败：', res.errMsg);
            },
            complete: function (res) { //完成
              console.log('请求完成：', res.errMsg);
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })



    

  },
  remarkChange: function (event){
    var thisPage = this;
    var remark = event.detail.value;
    thisPage.setData({
      remark :remark
    })
  },
  confirm: function () {
    var thisPage = this;
    thisPage.setData({
      hidden: true
    })
  }

})