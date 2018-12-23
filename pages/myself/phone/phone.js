// pages/myself/phone/phone.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:null, //电话
    allPhone:null,  //完整的电话
    verificationCode:null ,  //验证码
    phoneValue:'点击获取验证码',
    countCode:60, //记录
    canCall:true,//如果是true 则可以点击验证 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var phone1 = options.phone.substr(0, 3);
    var phone2 = options.phone.substr(7)
    var phone = phone1 + '****' + phone2;
    this.setData({
      phone:phone,
      allPhone: options.phone
    })
  },
//输入验证码
  importCode:function(e){
  var code = e.detail.value;
  this.setData({
    verificationCode: code
  })
  },
  //获取验证码
  getCode:function(e){
    var thisPage = this;
    var value = null;
    var countCode = parseInt(thisPage.data.countCode);
    if (thisPage.data.canCall) {
      var thisPage = this;
      wx.request({
        url: urls + '/app/sendSMS',
        data: {           //请求参数      
          phone: thisPage.data.allPhone
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: function (res) {
          var resData = res.data;
          if (resData.code == 0) {
            app.showWarnMessage('发送成功！');
            thisPage.setData({
              canCall:false
            })
          } else {
            console.log('请求失败！');
          }

        },
        fail: function (res) {
          console.log(res + '失败！');
        }
      })
    }
    if (countCode == 0) {
      value = '重新发送验证码';
      countCode = 60;
      thisPage.setData({
        canCall:true
      })
    } else {
      value = '剩余' + countCode + 's';
      countCode--;
      setTimeout(function () {
        thisPage.getCode();
      }, 1000)
    }
    thisPage.setData({
      phoneValue: value,
      countCode: countCode
    })

  },
  //点击下一步
  nextStep:function(e){
    var thisPage = this;
    if (!thisPage.data.verificationCode){
      app.showWarnMessage('请输入验证码！');
      return;
    }else{
        wx.request({
          url: urls + '/app/verifyCode',
          data: {           //请求参数      
            phone: thisPage.data.allPhone,
            vcode: thisPage.data.verificationCode

          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success: function (res) {
            var resData = res.data;
            if (resData.result) {
              var skinUp = '/pages/myself/complete_phone/complete_phone？phone';
              app.skipUpTo(skinUp, 1);
            } else {
              app.showWarnMessage('验证码错误！');
              return;
            }

          },
          fail: function (res) {
            console.log(res + '失败！');
          }
        })
    }
  }
})