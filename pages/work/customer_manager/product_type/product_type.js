//获取应用实例
const app = getApp()
var url = app.globalData.domainName;        //请求域名  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData:'',  //要搜索的数据
    searchAllData:[],   //搜索的所有数据
    pullNum: 1,    //当前页面的
    pageSize: 4,    //一页的产品
    total: 0, //总条数
    isSearchNextPage: true,   //是否查询
    addProduct:true   //添加产品的按钮显示与隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      var thisPage = this;
      if (thisPage.data.isSearchNextPage){
        var pullNum = thisPage.data.pullNum++;
        thisPage.getListData(pullNum);
      }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
//失去焦点
  searchContent:function(e){
   
    var value = e.detail.value;
    console.log("失去焦点'" + value);
    var thisPage = this;
    thisPage.setData({
      searchData: value
    })

  },
//点击搜索完成
  searchText:function(e){
    var thisPage = this;
    var currentType = e.currentTarget.dataset.type;
    if (currentType ==2){
      var value = e.detail.value;
      thisPage.setData({
        searchData: value
      })
   }
    this.getListData(1);
  },
//请求页面信息
  getListData: function (pullNum){
  var thisPage = this;
  wx.request({
    url: url + '/app/selectAppProductModule',
    data: {           //请求参数      
      isPage:true,
      page: this.data.pullNum,  //当前页
      pageSize:this.data.pageSize,//一页几个
      param: {
        shop_id: app.globalData.user_Info.shop_id, //店铺id
        model: thisPage.data.searchData //搜索字段, 如没有则传空字符串
      }
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      var total = res.data.result.total;
      if (resData.code == 0) {
        var resSelectData = resData.result.data;
        if (pullNum>1){
          resSelectData = thisPage.data.searchAllData.concat(resSelectData);
        }
        if (resSelectData.length<=0){
          var addProduct = false;
       }else{
          var addProduct = true;
       }
        if (total = resSelectData.length){
          var isSearchNextPage = false;
        }else{
          var isSearchNextPage = true;
        }
          thisPage.setData({
            pullNum: pullNum,
            searchAllData: resSelectData,
            total: total,
            isSearchNextPage: isSearchNextPage,
            addProduct: addProduct
          })
      } else if (resData.code == 1) {

      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
  //点击页面跳转
  skipUpTo: function (e) {
    var thisPage  = this;
    setTimeout(function () {
      var skipUpContent = e.currentTarget.dataset;
      var modelType = skipUpContent.type;  //类型（1 是列表 2是新增）
      if (modelType == 1) {
        var price = skipUpContent.price;   //价格
        var id = skipUpContent.id;  //id
        var model = skipUpContent.model;  //产品型号
      } else if (modelType == 2) {
        var price = 0;   //价格
        var id = '';  //id
        var model = thisPage.data.searchData;  //产品型号
      }
      console.log(model + '这是要带过去的 型号！！')
      var skipUrl = '/pages/work/customer_manager/make_order/make_order/make_order?price=' + price + '&productId=' + id + '&model=' + model + '&modelType=' + modelType + '&pageType=1';
      app.skipUpTo(skipUrl, 2);
    }, 100)

  },
})