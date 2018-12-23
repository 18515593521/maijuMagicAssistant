const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,//当前页
    pageSize: 15, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    guideList: ['active','',''] , //标题的切换
    listState:['','true','true'],  //底下列表的切换
    stateData: ['未登录', '已登录',''],  //登陆状态 1 已登录  0是未登录
    guideData:[],  //导购数据
    search:'', //搜索字段
    orderState:'' ,   //登陆状态
    gift:true  //等待的菊花
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGuideData(1);
  },
  //获取导购数据
  getGuideData:function(num){
    var thisPage = this;
    thisPage.setData({
      gift:false
    })
    wx.request({
      url: urls + '/app/selectAppSellerDataStatistics',

      data: {           //请求参数      
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: {
          shop_id: app.globalData.user_Info.shop_id,
          name: thisPage.data.search ,//搜索字段
          login_state: thisPage.data.orderState    // 1 已登录  0是未登录
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {

        var resData = res.data;
        var resDataList = null;
           resDataList = resData.data;

          var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isTureFalsePage = false;
          }
          if (num > 1) {
            resDataList = thisPage.data.guideData.concat(resDataList);
          }
          thisPage.setData({
            guideData: resDataList,
            isTureFalsePage: isTureFalsePage,
            page: resData.page,  //当前页面
            total: resData.total,  //总条数
            gift:true

          })

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
//点击切换
  click_request_data:function(e){
    var current = e.currentTarget.dataset;
    var item = parseInt(current.item);
    var indexItem = item-1;
    var orderList = [];
    var listState = [];
    var thisPage = this;
    for (var i = 0; i <= thisPage.data.guideList.length; i++) {
      if (item == i) {
        orderList.push('active');
        listState.push('');
      } else {
        orderList.push('');
        listState.push('true');
      }
    }
    if (item == 0) {
      indexItem = '';
    }
    thisPage.setData({
      guideList: orderList,
      listState: listState,
      orderState: thisPage.data.stateData[indexItem] 
    })
    this.getGuideData(1);
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
    this.getGuideData(1);
  },
  //下拉选择增加
  onPullDownRefresh: function () {
    this.getGuideData(1);
    wx.stopPullDownRefresh();  //页面自己回去！！

  },
  //上拉加载
  onReachBottom: function () {
    console.log('触发下拉了');
    var thisPage = this;
    if (thisPage.data.isTureFalsePage) {
      var pages = thisPage.data.page + 1;
      thisPage.getGuideData(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },
  //转发
  onShareAppMessage: function (res) {
    return {
      title: '魔方云助手',
      path: '/pages/login/login',
      imageUrl: '/pages/images/bg.jpg',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  }, 
})