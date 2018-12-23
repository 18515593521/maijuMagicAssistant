// pages/work/product_center/class_product/class_product.js
var app = getApp();   //获取应用实例
var url = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:null,  //店铺id
    series_class_data:null  //系列和分类
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId: options.details ? options.details : app.globalData.user_Info.shop_id
    })
    this.get_series_class(options.details);
  },
/*获得系列和分类*/
  get_series_class:function(){
    var thisPage = this;
    wx.request({
      url: url + '/app/getshopcustomcategory', //获取分类和系列
      data: {           //请求参数      
        shopId: thisPage.data.shopId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        //  console.log(res +"获取分类和系列");
        if (resData.code == 0) {
          thisPage.setData({
            series_class_data: resData.result    
          })
          console.log(resData.result +'分类和系列');
        } else if (resData.code == 1) {
          console.log("获取分类和系列失败！");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  /*选择分类*/
  select_class_series:function(e){
      var thisPage = this; 
    var current = e.currentTarget.dataset;
    var classer = current.classer;   //大主题（一级）
    var series = current.series;   //被选中项
    var seriesClassList=  thisPage.data.series_class_data;
    for (var i = 0; i < seriesClassList[classer].brandSeries.length;i++){
      var indexsClass = seriesClassList[classer].brandSeries[i];
      if (i == series){
        if (indexsClass.choose =='active'){
          indexsClass.choose = '';
        }else{
          indexsClass.choose = 'active';
        }
      }else{
        indexsClass.choose = '';
      }
    }
    thisPage.setData({
      series_class_data: seriesClassList
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
  //点击页面跳转
  skipUpTo: function (e) {
    var thisPages = this;
    var selectSeriesClass = [];
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = '/pages/work/product_center/product_list/product_list?details=' + thisPages.data.shopId;   //路径
    var skipType = skipUpContent.type;  //类型
    if (skipType==1){
      app.skipUpTo(skipUrl, 2);
    } else if (skipType == 2){
      for (var i = 0; i < thisPages.data.series_class_data.length;i++){
        var seriser = thisPages.data.series_class_data[i];
        for (var j = 0; j < seriser.brandSeries.length;j++){
          var bands = seriser.brandSeries[j];
          if (bands.choose=='active'){
            selectSeriesClass.push(bands.id);
          }
        }
      }
      if (selectSeriesClass.length>0){
        skipUrl = '/pages/work/product_center/product_list/product_list?details=' + thisPages.data.shopId+'&seriesId=' + JSON.stringify(selectSeriesClass);
      }
     
      app.skipUpTo(skipUrl, 2);
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})