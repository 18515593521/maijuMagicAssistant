// pages/work/order_manager/order_manager.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({
  data: {
    page: 1,//当前页
    pageSize: 6, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    closeOrderBox:true,  //关闭订单
    sellerId:null,  //销售id
    shopId:null,    //店铺id
    orderState:'',  //订单状态（全部、待支付）
    search:'',  //搜索的内容
    orderType:'',  //那个订单
    propertyData: ['全部', '活动订单', '销售订单'],// 1活动订单 2销售订单 3在线订单
    orderList:['active','','','',''],  //全部、待支付、的active
    listState: ['', 'true', 'true', 'true','true'] , //列表对应的显示与隐藏
    orderStateData: ["", "待支付", "待安装", "已完成", "关闭"],
    orderListData:[],  //订单数据

    orderId:null, // 订单id
    customerId:null  //用户id

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      sellerId: app.globalData.user_Info.user_id, //  app.globalData.user_Info.user_id  options.userId
      shopId: app.globalData.user_Info.shop_id //app.globalData.user_Info.shop_id   options.shopid
    })
    this.getLIstData(1);
  },
  //获得数据列表数据
  getLIstData:function(num){
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectSellerOrderPage',
      data: {           //请求参数  
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param:{
          sellerId: thisPage.data.sellerId,
          shopId: thisPage.data.shopId,
          orderState: thisPage.data.orderState,
          search: thisPage.data.search,
          orderType: thisPage.data.orderType
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          var resDataList = resData.result.data;
          var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isTureFalsePage = false;
          }
          if (num > 1) {
            resDataList = thisPage.data.orderListData.concat(resDataList);
          }
          thisPage.setData({
            orderListData: resDataList,
            isTureFalsePage: isTureFalsePage,
            page: resData.result.page,  //当前页面
            total: resData.result.total,  //总条数

          })

        } else if (resData.code == 1) {

        } else {
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //点击列表标题
  click_request_data:function(e){
     var current = e.currentTarget.dataset;
     var item = parseInt(current.item);
     var orderList = [];
     var listState = [];
     var thisPage = this; 
     for (var i = 0; i <=thisPage.data.orderList.length;i++){
       if (item==i){
         orderList.push('active');
         listState.push('');
       }else{
         orderList.push('');
         listState.push('true');
       }
     }
     if (item==0){
       item ='';
     }
     thisPage.setData({
       orderList: orderList,
       listState: listState,
       orderState: item
     })
     this.getLIstData(1);

  },

  //失去焦点获取存放搜索数据
  blurGetData: function (e) {
    var searchData = e.detail.value;
    this.setData({
      search: searchData   //搜索条件
    })
  },
  //搜索
  search: function (e) {
    var searchType = e.currentTarget.dataset.type;
    if (searchType == '2') {
      var searchData = e.detail.value;
      this.setData({
        search: searchData   //搜索条件
      })
    }
    this.getLIstData(1);
  },
  //上拉选择增加
  onReachBottom: function () {
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.getLIstData(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },
  //下拉刷新
  onPullDownRefresh:function(){
    // app.showWarnMessage('刷新中！');
    this.getLIstData(1);
    wx.stopPullDownRefresh();  //页面自己回去！！
  },
  //订单类型
  bindPickerChange: function (e) {
    var value = e.detail.value;
    if (value==0){
      value = '';
    }
    this.setData({
      orderType: value //当前
    })
    this.getLIstData(1);
  },
  //关闭订单 - （取消-打开）
  cause_box: function (e) {
    var current = e.currentTarget.dataset;
    var types = current.type;
    var orderId = current.id;
    var customerId = current.customerid;
    var cause = true;
    if (types == 'close') {
      cause = true;
    } else {
      cause = false;
    }
    this.setData({
      closeOrderBox: cause,
      orderId: orderId,
      customerId: customerId
    })
  },
  //写关闭订单的原因
  editCause: function (e) {
    var values = e.detail.value;

    var thisPage = this;
    thisPage.setData({
      closeOrderCause: values
    })
  },
  //确定提交关闭订单的原因
  sure_cause_box: function (e) {
    var thisPage = this;
    if (!thisPage.data.closeOrderCause) {
      app.showWarnMessage("请填写关闭订单的原因！");
      return;
    }
    wx.request({
      url: urls + '/app/closeOrder',
      data: {           //请求参数      
        orderId: thisPage.data.orderId,
        closeCause: thisPage.data.closeOrderCause
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          thisPage.setData({
            closeOrderBox: true
          })
          var skinp = "/pages/work/customer_manager/customer_detail/customer_detail";
          app.skipUpTo(skinp, 2);
        } else {
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //编辑订单
  editOrderDetail: function (e) {
    var current = e.currentTarget.dataset;
    var customerId = current.id;
    var orderType = current.ordertype;
    var activityId = current.activityid;
    var orderId = current.orderid;
    var editType = current.edittype;
    var skipUrl = '/pages/work/customer_manager/make_order/make_order/make_order?activityId=' + activityId + '&customerId=' + customerId + '&orderType=' + orderType + '&editType=' + editType + '&orderId=' + orderId + '&pageFrom=orderList';  //跳转的地址
    if (current.detail =='detail'){
      app.skipUpTo(skipUrl, 1);
    }else{
      app.skipUpTo(skipUrl, 2);
    }
   
  },
})