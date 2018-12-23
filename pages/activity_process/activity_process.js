// pages/activity_process/activity_process.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    logoImage:null,  //头像
    node3:null,  //厂家id
    customer_id: null, //客户 id
    activity_id: null, //活动id
    sellerId: null,//登录用户的 userId
    shop_id:null, // 店铺id
    activityData: null,  //获取当前流程的数据
    propertyData:[],   //签到理
    activityState: ['未签到', '已签到'], //0 未签到 1 是已经签到
    egggiftData:[], //砸金蛋
    getEgggif: {},  //砸金蛋
    gifData:[],  //礼物
    getGifNum: {},//礼物
    sureBuy:false , //确认购买的显示与隐藏

    currentItems:null,  //类别
    currentstatus:null,  //核销状态
    currentIndexs:null,  //当前是第几个
    currentId:null,  //点击要销毁的id
    gift:null,  //
    giftId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    thisPage.setData({
      customer_id: options.customerId,
      activity_id:options.activityId,
      sellerId:app.globalData.user_Info.user_id,
      shop_id:app.globalData.user_Info.shop_id,
      node3:app.globalData.user_Info.factoryId,  // options.node3
      logoImage: app.globalData.logoImage
    })

    thisPage.getActivityInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
//获取当前流程的数据
  getActivityInfo:function(e){
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectHelperActivityUser',
      data: {           //请求参数      
        customer_id: thisPage.data.customer_id,
        activity_id: thisPage.data.activity_id,
        sellerId: thisPage.data.sellerId,// app.globalData.user_Info.user_id,   thisPage.data.sellerId
        shop_id: thisPage.data.shop_id//app.globalData.user_Info.shop_id,thisPage.data.shop_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          var sigogift = resData.result.sigogift ? resData.result.sigogift:[];   //签到
          var egggift = resData.result.egggift ? resData.result.egggift:[];  //金蛋
          var ticketgift = resData.result.ticketgift ? resData.result.ticketgift:[];  //礼品
          var obj = {};
          obj.name = '请选择';
          if (egggift){
            egggift.unshift(obj);  //金蛋
          }

          if (ticketgift){
            ticketgift.unshift(obj);  //礼品
          }
          if (sigogift.length<=0){  //签到
            var objects = {};
            objects.name='暂无';
            sigogift.push(objects);   //签到
            console.log('暂无···' + sigogift);
          }
          if (resData.result.Itmes.length>290){
            var Itmes = resData.result.Itmes;
            resData.result.Itmes = Itmes.slice(0,290);
          }

          thisPage.setData({
            activityData: resData.result,
            propertyData: sigogift ,
            egggiftData: egggift,
            gifData: ticketgift 
          })
        } else {
          console.log('活动详情接口请求失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
//签到
  sign:function(e){
    var thisPage = this;
    var name = e.currentTarget.dataset.name;
    wx.request({
      url: urls + '/app/uptdateSign',
      data:{
        sign_state:'1',
        sign_gift: name,
        customer_id: thisPage.data.customer_id,
        activity_id: thisPage.data.activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        app.showSuccessMessage('签到成功！');
        thisPage.getActivityInfo();
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
//挑选对应的礼物或者金蛋
  bindPickerChange:function(e){
    var value = parseInt(e.detail.value);
      var current = e.currentTarget.dataset;
      var types = current.type; //类型（金蛋、礼物）
      var indexs = current.indexs;  //当前是第几个
      var thisPage = this;
      if (types =='egg'){
        var keys = 'getEgggif[' + indexs+']';
        thisPage.setData({
          [keys]: thisPage.data.egggiftData[value]
        })
      }else{
        var keys = 'getGifNum[' + indexs + ']';
        thisPage.setData({
          [keys]: thisPage.data.gifData[value]
        })
      }
      console.log(thisPage.data.getGifNum,'---左边是礼物右边是蛋---', thisPage.data.getEgggif);
  },
//确认购买
sureBuy:function(e){
  var thisPage = this;
  wx.request({
    url: urls + '/app/uptdateCard',
    data:{
      card:'1',
      customer_id: thisPage.data.customer_id,
      activity_id: thisPage.data.activity_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      if (resData.code == 0) {
        thisPage.setData({
          sureBuy:true
        })

        app.showSuccessMessage('购买成功!');
        thisPage.getActivityInfo();
      } else {
        console.log('请求失败！');
      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//点击询问是否
  clickMake2:function(e){
    var thisPage = this;
    var current = e.currentTarget.dataset;
    if (current.status==3){
      var titles='是否确定使用?'
    } else if (current.status ==1 ){
      var titles = '是否确定核销?'
    }
    thisPage.setData({
      currentItems: current.items,  //类别
      currentstatus: current.status,  //核销状态
      currentIndexs: current.indexs,  //当前是第几个
      currentId: current.id  //点击要销毁的id
    })
    if (thisPage.clickMake()){

      wx.showModal({
        title: '提示',
        content: titles,
        success: function (res) {
          if (res.confirm) {

            wx.request({
              url: urls + '/app/ uptdateHelperActivityOrder',
              data: {
                status: thisPage.data.currentstatus,
                id: thisPage.data.currentId,
                gift: thisPage.data.gift,
                giftId: thisPage.data.giftId,
                activityId: thisPage.data.activity_id
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              method: 'POST',
              success: function (res) {
                var resData = res.data;
                if (resData.code == 0) {
                  app.showSuccessMessage('操作成功!');
                  thisPage.getActivityInfo();
                } else {
                  console.log('请求失败！');
                }

              },
              fail: function (res) {
                console.log(res + '失败！');
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }

  },
//点击使用或者核销 0 是未使用 1 是已销毁  3是已使用
  clickMake:function(e){
    var thisPage = this;
    var id = thisPage.data.currentId;  //id
    var status = thisPage.data.currentstatus; //核销状态
    var indexs = thisPage.data.currentIndexs;  //当前第几个
    var items = thisPage.data.currentItems;  //类别


    if (items == 4 && status == 1){
      if (thisPage.data.getEgggif[indexs]){
        thisPage.setData({
          gift: thisPage.data.getEgggif[indexs].name,
          giftId: thisPage.data.getEgggif[indexs].id
        })
        return true;
      }else{
        app.showWarnMessage('请选择礼品！');
        return false;
      }
    } else if (items == 5&& status == 1){
      if (thisPage.data.getGifNum[indexs]){
        thisPage.setData({
          gift: thisPage.data.getGifNum[indexs].name,
          giftId: thisPage.data.getGifNum[indexs].id
        })
        return true;
      }else{
        app.showWarnMessage('请选择礼品！');
        return false;
      }
    }
    if (status == 1 && !gift && !giftId) {
      app.showWarnMessage('请选择礼品！');
      return false;
    }
    if (status == 3){
      return true;
    }

  },
 
//生成订单
  makeOrder:function(e){
    var thisPage = this;
    var skipUrls = '/pages/work/customer_manager/make_order/make_order/make_order';  //跳转的地址
    var skipUrl = skipUrls + '?activityId=' + thisPage.data.activity_id + '&customerId=' + thisPage.data.customer_id + '&orderType=1' + '&editType=add' + '&pageFrom=scanCode';
    app.skipUpTo(skipUrl, 2);
  }
})