const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
      logoImage:null,
      activityId:null, //活动id
      customerId:null, //客户id
      activityData:[],  //活动信息
      orderData:[],  //参加活动的订单数据
      activityState: ['未签到', '已签到'], //0 未签到 1 是已经签到
      orderState: ["", "待支付", "待安装", "已完成", "关闭"]
  },

  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.setData({
      activityId: options.activityId,
      customerId: options.customerId,
      logoImage: app.globalData.logoImage
    })
    this.getActivityData();//获取活动详情的信息
  },
  //获取活动详情的信息
  getActivityData:function(e){
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectHelperActivityDetails',
      data: {           //请求参数      
        id: thisPage.data.activityId,
        customer_id: thisPage.data.customerId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          if (resData.result.item.length>290){
            var items = resData.result.item;
            resData.result.item = items.slice(0,290);
            console.log(resData.result.item);
          }
          thisPage.setData({
            activityData: resData.result,
            orderData: resData.result.order
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
  //查看详情
  editOrderDetail:function(e){
    var current = e.currentTarget.dataset;
    var customerId = current.id;
    var orderType = current.ordertype;
    var activityId = current.activityid;
    var orderId = current.orderid;
    var editType = current.edittype;
    var skipUrl = '/pages/work/customer_manager/make_order/make_order/make_order?activityId=' + activityId + '&customerId=' + customerId + '&orderType=' + orderType + '&editType=' + editType + '&orderId=' + orderId +'&pageFrom=activity';  //跳转的地址
    app.skipUpTo(skipUrl, 1);
  },
  
  /* 生命周期函数--监听页面显示 */
  onShow: function () {
  
  },

  

})