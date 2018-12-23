// pages/login/login.js
var app = getApp();   //获取应用实例
var urls = app.globalData.domainName;        //请求域名

Page({
  data: {
    '_name': null,   //账号
    '_password': null,   //密码
    'tipsInfo_Message': {
      tipsInfo: null,    //提示信息
      gifts: true  //等待的菊花效果
    },
    showMes: true,
    binding : 0
  },

  onLoad: function (options) {
    var thisPage = this;
    var userInfoName = wx.getStorageSync('userInfoName');
    var userInfoPhone = wx.getStorageSync('userInfoPhone');

    var userInfo = wx.getStorageSync('userInfo');

    thisPage.setData({
      gifts: true  //等待的菊花效果
    })
    if (userInfoName && userInfoPhone && userInfo) {

      thisPage.setData({
        '_name': userInfoName,   //账号
        '_password': userInfoPhone   //密码
      })
      thisPage.loginToUp();
    }
    this.getVisitDomainUrl();   //获取访问域名路径
  },

  onReady: function () {

  },
  //获取访问域名路径
  getVisitDomainUrl: function () {
    var thisPage = this;
    var domainName_onLine = 'https://www.kaolaj.com/magicCloud';
    //var domainName_onLine = 'https://www.kaolaj.com/magic_cloud2.0_test';
    //var domainName_onLine = 'https://www.kaolaj.com/magic_cloud2.0_shenhe';
    // var domainName_onLine = '192.168.1.8:8080/shop-web';
    // var domainName_outLine = 'https://www.kaolaj.com/magic_cloud2.0_test';
    var domainName_outLine = 'https://www.kaolaj.com/magic_cloud2.0_shenhe';
//     var domainName_onLine = 'http://192.168.1.6:8080/shop-web';
    var domainName_middle = "https://www.kaolaj.com/magic_cloud2.0_shenhe/app/selectVersion/" + app.globalData.type;
    console.info(domainName_middle);

    wx.request({
      url: domainName_middle,  //接口地址
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;
        console.info('【版本信息】', returnData);

        var version = app.globalData.version;
        console.log(version)
        if (returnData.code == 0) {
          if (version == returnData.result) {
            app.globalData.domainName = domainName_onLine;
          } else {
            app.globalData.domainName = domainName_outLine;
          }
        }
      },
      fail: function (res) {     //失败
        console.error('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成
        console.log('请求完成：', res.errMsg);
        console.info("【Request路径】", app.globalData.domainName);
        //thisPage.getCurrentCity();      //获取当前城市
      }
    })
  },

  //账号以及密码
  accent_input: function (e) {
    var current = e.currentTarget;
    var key = current.dataset.param;
    var value = e.detail.value;
    var obj = {};
    obj[key] = value;
    this.setData(obj);
  },
  //点击登录
  loginToUp: function (e) {
    var thisPage = this;
    var objectData = {};
    wx.login({  //微信登录
      success: function (result) {
        // console.log("【微信登录信息】：", result);
        if (result.code) {
          objectData.js_code = result.code;
          objectData.user_name = thisPage.data._name;
          objectData.user_pwd = thisPage.data._password;
          objectData.appid = app.globalData.appId;
          objectData.binding = thisPage.data.binding    ; 
         // objectData.user_name = 'ceshi00'; //'mfy'// mf02  yhj01 GJ-BJFGS  kfzys CWCLM w02 cs02 18500518279  hs-fgs   017 JMJJ_FGS GJ-FGS
         //objectData.user_pwd = '888888';
          if (objectData.user_name && objectData.user_pwd) {
            thisPage.setData({
              gifts: false
            })
            wx.request({
              url: urls + '/app/sellerLogin1',
              data: objectData,
              header: {
                'content-type': 'application/json' // 默认值
              },
              method: 'POST',
              success: function (res) {

                thisPage.setData({
                  gifts: true
                });
                var resData = res.data;
                if (resData.code == 0) {
                  wx.setStorageSync('userInfoName', thisPage.data._name);
                  wx.setStorageSync('userInfoPhone', thisPage.data._password);
                  wx.setStorageSync('userInfo', resData.result);
                  //获取头像
                  app.globalData.user_Info.userInfo = resData.result;  //用户信息
                  app.globalData.user_Info.shop_id = resData.result.shop_id;  //赋值 店铺id
                  app.globalData.user_Info.user_id = resData.result.id;  //赋值
                  app.globalData.user_Info.user_limits_role = resData.result.role;  //用户角色 （seller:导购、group:集团、server：其他商户账号）
                  app.globalData.user_Info.user_limits = resData.result.grade;  //用户等级
                  app.globalData.user_Info.factoryId = resData.result.node3;  //集团id
                  app.globalData.user_Info.filialeId = resData.result.node2;  //分公司id
                  app.globalData.user_Info.app_id = resData.result.app_id;  //appid
                  app.globalData.user_Info.pay_status = resData.result.pay_status;  //顶级支付状态
                  thisPage.getLogoImage();
                  app.showSuccessMessage(resData.message);  //成功

                  wx.switchTab({              //跳转
                    url: '../work/index/work',
                    success: function (res) {
                      console.log(res);
                    },
                    fail: function (res) {
                      console.log(res);
                    }
                  })
                } else if (resData.code == 2){
                  thisPage.showSubmitBtn()
                } else if (resData.code == 1) {
                  app.showWarnMessage(resData.message);  //失败
                } else if (resData.code == 3) {
                  app.showWarnMessage(resData.message);  //失败
                }

              },
              fail: function (res) {
                console.log(res + '失败！');
              }
            })
          } else {
            app.showWarnMessage('请输入账号密码！');  //失败
          }

        } else {
          console.log('获取用户登录态失败！' + result.errMsg);
        };
      }
    });



  },

  //获取Logo图片
  getLogoImage: function () {
    var thisPage = this;

    wx.request({
      url: urls + '/app/selectNode3Image',  //接口地址
      data: {
        node3: app.globalData.user_Info.factoryId
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;

        if (returnData.code == 0 && returnData.result) { //成功
          app.globalData.logoImage = returnData.result;  //赋值 店铺id

        } else {  //失败
          console.log("【获取Logo图片】fail！");
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
  //转发
  onShareAppMessage: function (res) {
    return {
      title: '魔方云助手',
      path: '/pages/login/login',
      imageUrl: '/pages/images/bg.jpg',
      success: function (res) {
        app.addPageSharePoint('登录分享');
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
  showSubmitBtn : function(){
    var thisPage = this;
    wx.showModal({

      title: '',

      content: '点击确认即可绑定当前小程序',

      success: function (res) {

        if (res.confirm) {

          thisPage.setData({
            binding : 1
          })
          thisPage.loginToUp()
          

        } else {//这里是点击了取消以后

          console.log('用户点击取消')

        }

      }

    })


  }

})

