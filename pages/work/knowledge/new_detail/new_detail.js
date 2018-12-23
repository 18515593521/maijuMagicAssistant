// pages/work/knowledge/new_detail/new_detail.js
var app = getApp();   //获取应用实例
var urls = app.globalData.domainName;        //请求域名
var WxParse = require('../../../plugs/wxParse/wxParse.js');
var until = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null, //详情的id
    detailDatail:null, //详情
    creatTimer:null 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    thisPage.setData({
        id: options.id
      })
    thisPage.getData();
  },
//获得信息
getData:function(){
  var thisPage = this;
  wx.request({
    url: urls + '/app/queryarticledetails ',  // app.globalData.user_Info.user_id 
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      id:thisPage.data.id
    },
    method: 'post',
    success: function (res) {
      var resData = res.data;
      console.log(resData);
      if (resData.code == 0) {
        var timers = until.switchTime(resData.result.create_time, 'dateTime');
        thisPage.setData({
          detailDatail: resData.result,
          creatTimer: timers
        })
        WxParse.wxParse('details', 'html', resData.result.details, thisPage, 5); //活动详情
      } else if (resData.code == 1) {
        console.log("获取数据失败");
      }
    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
  
  },
  //转发
  onShareAppMessage: function (res) {
    var thisPage = this;
    return {
      title: '魔方云助手',
      path: '/pages/share/share?P1=D' + '&P2=' + thisPage.data.id + '&appId=' + app.globalData.user_Info.app_id + '&P3=' + app.globalData.user_Info.user_id,
      imageUrl: '/pages/images/bg.jpg',
      success: function (res) {
        app.addPageSharePoint(thisPage.data.detailDatail.title);
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
})