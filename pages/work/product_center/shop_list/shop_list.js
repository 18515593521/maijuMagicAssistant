// pages/work/product_center/shop_list/shop_list.js
var app = getApp();   //获取应用实例
var url = app.globalData.domainName;        //请求域名
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shop_list_data:null, //商家列表的数据
    page:1,//当前页
    pageSize:6, //一页展示几个
    total:0,  //总页数
    isTureFalsePage:true,  // 是否分页
  },
  //点击页面跳转
  skipUpTo: function (e) {
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    app.skipUpTo(skipUrl, skipType);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //获取当前页面的商家列表
  getShopListData:function(num){
    var thisPage = this;
    wx.request({
      url: url + '/app/selectUserShopPage', //
      data: {           //请求参数      
        page:num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: {
          level: app.globalData.user_Info.user_limits,  //用户等级
          shopId: app.globalData.user_Info.shop_id,    //店铺id
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        //  console.log(res +"活动内容详情");
        if (resData.code == 0) {
          var resDataList = null;
          resDataList = resData.result.data;
          if (num>1){
            resDataList = thisPage.data.shop_list_data.concat(resDataList);
          }
            var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize){
            var isTureFalsePage =false;
          }
          thisPage.setData({
            shop_list_data: resDataList,   //数据
            page: resData.result.page,  //当前页面
            total: resData.result.total,  //总条数
            isTureFalsePage:isTureFalsePage  //下次是否分页
          })

        } else if (resData.code == 1) {
          console.log("请求活动详情失败！");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  onLoad: function (options) {
    this.getShopListData(1);  //获取商家列表
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
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.getShopListData(pages);
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