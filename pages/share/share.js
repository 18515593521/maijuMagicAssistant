// pages/share/share/share.js
const app = getApp()
var url = app.globalData.domainName;        //请求域名 
// 引入腾讯地图SDK核心类
var QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
var QQmapsdk;
console.log('url的值' + url);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: null,
    options: null,  //传过来的数据
    appId: null,
    positionInfo: null,  //定位信息
    type: null,
    value: null,
    customerInfoId: null,  //用户id
    filialeId: null,  //厂家id
    skinpUrl: null,  //跳转的地址
    shopId:null,  //店铺id
    isOpen:null,  //价格是不是显示
    payState:null,  //是否可以購買
    nick_name:null,   //名字
    clickNum:0 ,  //第几次点击
    gifts:false,  //等待的菊花
    positionInfo2:null,  //定位信息
    location:null,
    address:null,
    regionCode:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    var type = null;//导购邀请 1  消费者邀请是2
    var value = null;
    if (options.P3) {
      type = 1;  //
      value = options.P3;
    }

    thisPage.setData({
      options: options,
      appId: options.appId,
      type: type,
      value: value
    })
    thisPage.getCurrentCity();  //获取当前城市
  },

  //获取当前城市
  getCurrentCity: function () {
    var thisPage = this;

    QQmapsdk = new QQMapWX({    // 实例化API核心类
      key: 'G75BZ-Q7RRF-HHHJ2-JGF5S-3XNU3-73BUZ'  //秘钥
    });
    QQmapsdk.reverseGeocoder({
      success: function (res) {
        thisPage.setData({
          positionInfo: res.result.location,
          location: res.result.location,
          address: res.result.address,
          regionCode: res.result.ad_info.adcode,
          gifts:true
        })
      
      },
      fail: function (res) {
        console.log("【位置信息】fail", res);
        app.skipUpTo("/pages/authorize_fail/authorize_fail?failType=1", 2);
      }
    });
  },
  //跳转
  goTo: function () {
    var thisPage = this;
    var skinpUrl = null;
    var options = thisPage.data.options;
    var isShare = 1;  //是分享过去得
    var positionInfo2 =  '&address=' + thisPage.data.address + '&regionCode=' + thisPage.data.regionCode;

    if (options.P1 == 'A') {   //首页
      skinpUrl = 'pages/index/index';

    } else if (options.P1 == 'B') {  //产品列表  shareFrom 1 是来自助手端 2是个人转发 

      skinpUrl = '/pages/product/product_list/product_list?lat=' + thisPage.data.positionInfo.lat + '&lng=' + thisPage.data.positionInfo.lng + '&isShare=1&seriesIdList=' + options.seriesIdList + "&searchText=" + options.searchText + '&P3=' + options.P3 + '&type=1' + positionInfo2;

    } else if (options.P1 == 'J') {  //全景
      skinpUrl = '/pages/index/index?P1=j' + '&P3=' + options.P3 + '&type=1';

    } else if (options.P1 == 'C') {  //产品详情
     // var param = 'P1=C&P2=' + options.P2 + '&P3=' + options.P3;
      skinpUrl = '/pages/product/product_details/product_details?lat=' + thisPage.data.positionInfo.lat + '&lng=' + thisPage.data.positionInfo.lng + '&isShare=1&productId=' + options.P2 + '&type=1' + '&P3=' + options.P3  + positionInfo2;
    } else if (options.P1 == 'D') { //新闻详情页
      skinpUrl = 'pages/index/index?P1=D&P2=' + options.P2 + '&type=1';

    } else if (options.P1 == 'G') {   //活动详情

      skinpUrl = '/pages/activity/activity_details/activity_details?lat=' + thisPage.data.positionInfo.lat + '&lng=' + thisPage.data.positionInfo.lng + '&activity_id=' + options.activity_id + '&isShare=1' + '&P3=' + options.P3 + '&type=1'  + positionInfo2;


    } else if (options.P1 == 'H') {   //导购邀请
      skinpUrl = 'pages/index/index?P3=' + options.P3 + '&P1=H' +'&type=1';

    }
    
    wx.navigateToMiniProgram({
      appId: thisPage.data.appId,
      path: skinpUrl ,
      envVersion: 'trial',//trial体验  release 正式
      success(res) {
        thisPage.setData({
          clickNum:1  
        })
      },
      fail: function (res) {

        console.log(JSON.stringify(res) + '失败');
      }
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
})