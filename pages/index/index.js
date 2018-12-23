
//获取应用实例
const app = getApp()
var url = app.globalData.domainName;        //请求域名   
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,  
    activityList:null,   //活动列表信息
    activityPage:null,   //当前活动
    pullNum: 1,    //当前页面的
    pageSize:4,    //一页的产品
    total:0, //总条数
    isSearchNextPage:true ,  //是否查询
    isCommercial: false,  //扫一扫显示与隐藏
    noActivity:true
  },
  //列表请求活动数据
  getListData:function(num){
    var thisPage = this;
    wx.request({
      url: url + '/app/selectHelperActivityPage', //
      data: {           //请求参数
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: {
          user_id: app.globalData.user_Info.shop_id
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        var resDataList = null;
        if (resData.code==0){
           resDataList = resData.result.data;
           if (resDataList.length>0){
             var isSearchNextPage = true;
             if (resDataList.length < thisPage.data.pageSize) {
               var isSearchNextPage = false;
             }
             if (num > 1) {
               resDataList = thisPage.data.activityList.concat(resDataList);
             }
             thisPage.setData({
               'activityList': resDataList,   //总数据
               'pullNum': resData.result.page, //当前页
               'total': resData.result.total,   //总条数
               'isSearchNextPage': isSearchNextPage  //是否允许下拉
             })
             console.log(thisPage.data.activityList);
           } else if (resDataList.length == 0){
              thisPage.setData({
                noActivity:false
              })
           }

        
        } else if (resData.code == 1){

        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
//后台账号请求数据
getDataList:function(num){
  var thisPage = this;
  wx.request({
    url: url + '/app/selectShopActivityPage', //
    data: {           //请求参数
      page: num,
      pageSize: thisPage.data.pageSize,
      ispage: true,    //是否分页
      param: {
        level: app.globalData.user_Info.user_limits,
        shopId:app.globalData.user_Info.shop_id
      }
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      var resDataList = null;
      if (resData.code == 0) {
        resDataList = resData.result.data;
        if (resDataList.length>0){
          var isSearchNextPage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isSearchNextPage = false;
          }
          if (num > 1) {
            resDataList = thisPage.data.activityList.concat(resDataList);
          }
          thisPage.setData({
            'activityList': resDataList,   //总数据
            'pullNum': resData.result.page, //当前页
            'total': resData.result.total,   //总条数
            'isSearchNextPage': isSearchNextPage  //是否允许下拉
          })
          console.log(thisPage.data.activityList);
        } else if (resDataList.length == 0){
          thisPage.setData({
            noActivity: false
          })
        }


      } else if (resData.code == 1) {

      }
    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //点击页面跳转
  skipUpTo:function(e){
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    app.skipUpTo(skipUrl, skipType);
  },
  //下拉拉加载
  onReachBottom: function () {
    var thisPage  = this;
    if (thisPage.data.isSearchNextPage){
      var pullNum = thisPage.data.pullNum + 1;
      thisPage.setData({
        pullNum: pullNum
      })
      this.aboutlimits();
    }else{
      app.showWarnMessage('没有更多数据了！'); 
    }
  },  
  //上拉刷新
  onPullDownRefresh:function(){
    app.showWarnMessage("刷新中！");
    this.aboutlimits();
    wx.stopPullDownRefresh();  //页面自己回去！！
  },
  onLoad: function () {
    this.aboutlimits();
  },
  //根据权限来请求数据
  aboutlimits:function(e){
    var thisPage = this;
    var pullNum = thisPage.data.pullNum;
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
     
      thisPage.getListData(pullNum);    //列表请求活动数据(导购)
    }else{
      thisPage.getDataList(pullNum); //列表请求活动数据(后台)
      thisPage.setData({
        isCommercial:true
      })
    }
  },
  /*生命周期函数--监听页面显示*/
  onShow: function () {
    this.aboutlimits();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  //转发
  // onShareAppMessage: function (res) {
  //   return {
  //     title: '魔方云助手',
  //     path: '/pages/share/share?P1=G&P3=' + app.globalData.user_Info.user_id + '&appId=' + app.globalData.user_Info.app_id,
  //     imageUrl: '/pages/images/bg.jpg',
  //     success: function (res) {
  //       app.addPageSharePoint('活动列表');
        
  //     },
  //     fail: function (res) {

    
  //     }
  //   }
  // },
//扫码
  scanCode:function(e){
    app.scanCode('activity');
  }
})
