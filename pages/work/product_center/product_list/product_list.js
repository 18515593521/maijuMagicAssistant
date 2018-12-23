// pages/work/product_center/product_list/product_list.js
var app = getApp();   //获取应用实例
var url = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_list_data: null,  //产品数据

    shopId:null,//店铺id
    product_title:null,  //搜索字段
    seriesIdList: [], //搜索条件 按都好隔开

    page: 1,//当前页
    pageSize: 6, //一页展示几个
    total:0,  //总页数
    isTureFalsePage: true,  // 是否分页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  thisPage = this;
    if (options.details){
      thisPage.setData({
        shopId: options.details  //店铺id
      })
    
    }else{
      thisPage.setData({
        shopId: app.globalData.user_Info.shop_id  //店铺id
      })
    }
    if (options.seriesId){
      thisPage.setData({
        seriesIdList: JSON.parse(options.seriesId)  //店铺id
      })
    }
    thisPage.get_product_list(1);
  },
  //点击页面跳转
  skipUpTo: function (e) {
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    app.skipUpTo(skipUrl, skipType);
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
 //获取产品列表
  get_product_list: function (num){
    var thisPage = this;
    console.log('搜索的产品名称---' + thisPage.data.product_title);
   
    wx.request({
      url: url + '/app/queryshopallproducts', //
      data: {           //请求参数      
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: {
          series_id: thisPage.data.seriesIdList.toString(),  //搜索条件
          shopId: thisPage.data.shopId,    //店铺id
          product_title: thisPage.data.product_title   //搜索标题
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
         console.log(res +"----活动内容详情");
        if (resData.code == 0) {
          var resDataList = null;
          resDataList = resData.result.data;

          var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isTureFalsePage = false;
          }
          if (num > 1) {
            resDataList = thisPage.data.product_list_data.concat(resDataList);
          }
          thisPage.setData({
            product_list_data: resDataList,   //数据
            page: resData.result.page,  //当前页面
            total: resData.result.total,  //总条数
            isTureFalsePage: isTureFalsePage  //下次是否分页
          })

        } else if (resData.code == 1) {
          console.log("请求失败！");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //失去焦点获取存放搜索数据
  blurGetData:function(e){
    var searchData = e.detail.value;
    this.setData({
      product_title:searchData   //搜索条件
    })
  },
  //搜索
  search:function(e){
    var searchType = e.currentTarget.dataset;
    var thisPage = this;
   
    if (searchType=='2'){
      var searchData = e.detail.value;
      thisPage.setData({
        product_title: searchData   //搜索条件
      })
    }
    console.log('搜索的产品9999' + thisPage.data.product_title);
    setTimeout(function(){
      thisPage.get_product_list(1);
    }, 500);
  },
  /* 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    this.get_product_list(1);
    wx.stopPullDownRefresh();  //页面自己回去！！
  },

  /* 页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.get_product_list(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },
  //转发
  onShareAppMessage: function (res) {
    var thisPage = this;
    return {
      title: '产品列表',
      path: '/pages/share/share?P1=B' + '&appId=' + app.globalData.user_Info.app_id + "&seriesIdList=" + JSON.stringify(thisPage.data.seriesIdList) + "&searchText=" + thisPage.data.product_title + '&P3=' + app.globalData.user_Info.user_id,
      imageUrl: '/pages/images/bg.jpg',
      success: function (res) {
        app.addPageSharePoint('产品列表-分享');
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
})