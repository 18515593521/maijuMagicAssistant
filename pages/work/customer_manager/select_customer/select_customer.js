// pages/work/thread_follow/select_customer/select_customer.js
const app = getApp()
var url = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//当前页
    pageSize: 15, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    customerInfo:null,
    customer_id:null,
    customer_name:null,
    search:null  //搜索的标题
  },
//更改选择
  radioChange: function (e) {
    var thisPage = this;
    var customerInfo = thisPage.data.customerInfo;
    var lenth = Object.keys(customerInfo).length;
    var customer_name = "";
    for (var n = 0; n < lenth; n++) {
      if (customerInfo[n].id == e.detail.value){
        customer_name = customerInfo[n].name;
        customerInfo[n].checked ="checked";
      }else{
        customerInfo[n].checked = "";
      }
    }
    thisPage.setData({
      customer_id: e.detail.value,
      customer_name: customer_name,
      customerInfo: customerInfo
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    thisPage.getData();
  },
  //获取数据
  getData: function (e) {
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      this.applyList(1);   //请求数据（导购）
    }
  },
  //渲染列表(获取客户档案列表-导购)
  applyList: function (num) {
    var thisPage = this;
    thisPage.setData({
      selectArr2: thisPage.data.selectArr
    })
    var params = {
      sellerId: app.globalData.user_Info.user_id, //导购id
    }; 
    if (thisPage.data.search) {
      params.search = thisPage.data.search;
    }
    wx.request({
      url: url + '/app/selectCustomerBySeller',
      data: {           //请求参数      
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: params
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
            resDataList = thisPage.data.customerInfo.concat(resDataList);
          }
          thisPage.setData({
            customerInfo: resDataList,
            isTureFalsePage: isTureFalsePage,
            page: resData.result.page,  //当前页面
            total: resData.result.total,  //总条数
          })
        } else if (resData.code == 1) {
          console.log("获取数据失败");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
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
    this.applyList(1);   //请求数据（导购）
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

  onPullDownRefresh: function () {
    // app.showWarnMessage("刷新中！");
    this.getData();
    wx.stopPullDownRefresh();  //页面自己回去！！
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触发了下拉');
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.applyList(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  skipUpTo: function (e) {
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    app.skipUpTo(skipUrl, skipType);
  },
})