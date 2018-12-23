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
    isCommercial: false,   // 扫一扫的显示与隐藏
    num : 0,
    canCarryMoney: 0,
    waitAuditMoney : 0,
    payState: 2,
is_horizontal_alliances : false,
    imageShow : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var phones = app.globalData.user_Info.userInfo.phone;
    var phone = phones.substr(0, 3) + '****' + phones.substr(7);
    var flage = true ; 
    this.getModels();
    if (app.globalData.is_horizontal_alliances && app.globalData.seller_commission_status == 1){
      this.setData({
        is_horizontal_alliances: true
      }) 
    }
    this.setData({
      mySeleftData: app.globalData.user_Info.userInfo,
      phone: phone,
      payState: app.globalData.user_Info.pay_status,
    }) 
    if (app.globalData.user_Info.user_limits_role !== 'seller') { //导购 
      this.setData({
        isCommercial:true
      })
    }

    this.getCommissionInfo();
  },
  //页面显示
  onShow: function () {
    this.getCommissionInfo();
    this.lookCommission();
    this.loginToUp();
    this.getModels()
  },
//跳转
  skinUp:function(e){
  var current = e.currentTarget.dataset;
  var urls = current.url;
  app.skipUpTo(urls,1);
  },
  onPullDownRefresh: function () {
    var thisPage = this;
    thisPage.getCommissionInfo();
    thisPage.lookCommission();
    thisPage.loginToUp();
    this.getModels()
    wx.stopPullDownRefresh();  //页面自己回去！！
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
  //页面跳转2
  pageSkipTo(e) {
    let thisPage = this;
    let dataSet = e.currentTarget.dataset;
    let urls = dataSet.urls;
    let skipType = dataSet.types;
    app.skipUpTo(urls, skipType);
  },
  //佣金模块信息 
  getCommissionInfo: function () {
    var thisPage = this;

    var data = {};

    data.inviter = app.globalData.user_Info.user_id;
    data.appid = app.globalData.appId;
    data.node3 = app.globalData.user_Info.factoryId;
    data.type = 1;
   

    wx.request({
      url: urls + '/app/selectCommissionInfo',  //接口地址 
      data: data,
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功 
        var returnData = res.data;

        if (returnData.code == 0 && returnData.result) { //成功

          if (returnData.result.canCarryMoney){
            thisPage.setData({
              canCarryMoney: returnData.result.canCarryMoney,

            })
          }else{
            thisPage.setData({
              canCarryMoney: 0.00,

            })
          }
          if (returnData.result.waitAuditMoney) {
            thisPage.setData({
              waitAuditMoney: returnData.result.waitAuditMoney,
            })
          }else{
            thisPage.setData({
              waitAuditMoney: 0.00,
            })
          } 

          if (returnData.result.status) {
            thisPage.setData({
              status: returnData.result.status,

            })
          } 
          if (returnData.result.num) {
            thisPage.setData({
              num: returnData.result.num,

            })
          } 
        
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
  //查询佣金模块
  lookCommission: function (e) {
    var thisPage = this;

    var data = {};
    data.shopId = app.globalData.user_Info.shop_id;


    wx.request({
      url: urls + '/app/selectCommissionImage',  //接口地址
      method: 'POST',
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;
        // console.log('【接口返回数据】',returnData);

        if (returnData.code == 0) { //成功
          var dataList = returnData.result;
         
          var imageUrl1;
          if (returnData.result.spreadImage && returnData.result.spreadImage.image) {
            thisPage.setData({
              imageShow : true
            })
          }else{
            thisPage.setData({
              imageShow: false
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
  //点击登录
  loginToUp: function (e) {
    var thisPage = this;
    var objectData = {};
    wx.login({  //微信登录
      success: function (result) {
        // console.log("【微信登录信息】：", result);
        if (result.code) {
          objectData.js_code = result.code;
          
          objectData.user_name = wx.getStorageSync('userInfoName');
          objectData.user_pwd = wx.getStorageSync('userInfoPhone');
          objectData.appid = app.globalData.appId;
          objectData.binding = 1;
          
          if (objectData.user_name && objectData.user_pwd) {
      
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
                  app.globalData.user_Info.pay_status = resData.result.pay_status;  //顶级支付状态
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
                  
                    
                  thisPage.setData({
                    payState: resData.result.pay_status
                  })
                }  else {
                  app.showWarnMessage(resData.message);  //失败
                }

              },
              fail: function (res) {
                console.log(res + '失败！');
              }
            })
          } 

        };
      }
    });
  },
  //请求模块
  getModels: function () {
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectShopColumn1/' + app.globalData.user_Info.shop_id,
      method: 'get',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resturnData = res.data;
        if (resturnData.code == 0) {
          
          var is_horizontal_alliances = false;
          for (var das = 0; das < resturnData.result.shopColumn.length; das++) {
            if (resturnData.result.shopColumn[das] == '/pages/person_center/center/commission_center/commission_center') {
              app.globalData.is_horizontal_alliances = true
              is_horizontal_alliances = true;
            
            }
          }

          var aaa = false;
          if (resturnData.result.userCommissionSet) {

            if (resturnData.result.userCommissionSet.seller_commission_status == 1) {
              app.globalData.seller_commission_status = 1
              aaa = true
            }
          }
          if (aaa && is_horizontal_alliances){
            thisPage.setData({
              is_horizontal_alliances: true
            })
          }else{
            thisPage.setData({
              is_horizontal_alliances: false
            })
          }
          
        }
      }
    })
  },

})