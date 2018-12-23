// pages/work/index/work.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域名
Page({

  /* 页面的初始数据*/
  data: {
    page: 1,//当前页
    pageSize: 6, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    taskListData:[],  //销售任务列表
    activityListData:[],//活动任务列表
    taskList:true,  //导购下显示
    adminList: true, //昨日概况（后台账号显示）
    _name:null,  //客户姓名
    _phone:null, //客户电话
    _popUp:true,  //客户宝贝弹框的显示与隐藏
    todayDatas:null, //今日数据
    typeModels:null,  //当前的权限
    isCommercial:false,  //扫一扫显示与隐藏
    product_center_guide:'/pages/work/product_center/product_list/product_list',  //导购状态下产品中心进入
    product_center_admin: '/pages/work/product_center/shop_list/shop_list',  //后台状态下产品中心进入
    paramObj:null,  //转发带的参数
    icon_all_data:[   //icon的展示
      {
        url: 'client.jpg',
        title: '客户管理',
        go_to_url: '/pages/work/customer_manager/user_file/user_file?types=1',
        indexPage: '1',
        types: 'product',

      },

      {
        url: 'float2.jpg',
        title: '线索跟进',
        go_to_url: '/pages/work/customer_manager/user_task/user_task',
        indexPage: '1',
        types: 'product',

      },
      {
        url: 'task2.jpg',
        title: '任务提醒',
        go_to_url: '/pages/work/customer_manager/thread_follow_remind/set_task',
        indexPage: '1',
        types: 'product',

      },
      {
        url: 'center.jpg',
        title: '产品中心',
        go_to_url: '',
        indexPage: '1',
        types: 'center',

      },
      {
        url: 'guitInfo.png',
        title: '导购管理',
        go_to_url: '/pages/work/guide_management/guide_management',
        indexPage: '1',
        types: 'guide',
      },        

      {
        url: 'repository.png',
        title: '知识库',
        go_to_url: '/pages/work/knowledge/new_list/new_list',
        indexPage: '1',
        types: 'new',
      }, 
      {
        url: '720.png',
        title: '品牌全景',
        go_to_url: '',
        indexPage: '1',
        types:'vr',
      },
      {
        url: 'integral.jpg',
        title: '积分管理',
        go_to_url: '/pages/work/integral_manager/my_integral_detail/my_integral_detail',
        indexPage: '1',
        types: 'code',
      },
      {
        url: 'daily.png',
        title: '我的日报',
        go_to_url: '/pages/work/customer_manager/user_file/user_file?types=2',
        indexPage: '1',
        types: 'daily',
      }, 
                         
    ],
  },
  //获取今日数据
  getTodayData:function(){
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectStatistics',
      data: {           //请求参数      
        sellerId: app.globalData.user_Info.user_id  //用户id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        console.log(resData + "获取今日数据");
        if (resData.code == 0) {
          thisPage.setData({
            todayDatas: resData.result   //数据
          })

        } else if (resData.code == 1) {
          console.log("获取今日数据失败");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //点击icon 跳转
  skipUpTo:function(e){
    var thisPage = this;
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    var types = skipUpContent.types;  //类型
    if (types == 'vr' || types == 'daily'){
      var level = null;
      if (app.globalData.user_Info.user_limits_role == 'seller') {  //如果是导购
        level = 1;
      }else{
        level = app.globalData.user_Info.user_limits;
      }
      wx.request({
        url: urls + '/app/selectPermission',
        data: {           //请求参数 
          user_id: app.globalData.user_Info.shop_id, //用户id
          level: level  // // 如导购身份, 固定传 1, 如其他身份.  传登录时返回的grade

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: function (res) {
          var resData = res.data;
          if (resData.code == 0) {
            if (resData.result.length==0){
              if (types == 'vr'){
                app.showWarnMessage("暂无全景资源!");  //失败
                return;
              } else if (types == 'daily'){
                app.showWarnMessage("暂未开通日报!");  //失败
                return;
              }
              
            }else{
              for (var i = 0; i < resData.result.length;i++){
                var caseId = resData.result[i];
                if (caseId.permission_id == 999 && types == 'vr'){   //37 日报  38 新闻资讯 999 全景
                  var urls = caseId.name.replace('http','https');
                  var skipUrl = '/pages/work/vr/vr?urls=' + urls;
                  app.skipUpTo(skipUrl, skipType);
                } else if (caseId.permission_id == 37 && types == 'daily'){
                  app.showWarnMessage("暂未开通日报!");  //失败
                  return;
                }
              }            
            }
          } else if (resData.code == 1) {
            app.showWarnMessage("失败！");  //失败
          }
        },
        fail: function (res) {
          app.showWarnMessage("失败！");  //失败
        }
      })
      
    }else{
      app.skipUpTo(skipUrl, skipType);
    }
   
  
  },
  //弹框
  user_phone_pop:function(){
    var thisPage = this;
    thisPage.setData({
      _popUp: false   //数据
    })
  },
  //输入客户姓名
  user_infos:function(e){
    var current = e.currentTarget;
    var key = current.dataset.param;
    var value = e.detail.value;
    var obj = {};
    obj[key] = value;
    this.setData(obj);
  },

  //取消客户报备
  cancel_operation: function () {
    var thisPage = this;
    thisPage.setData({
      _popUp: true,  //数据
      _name: null,
      _phone: null
    })
  },
  //确定客户报备
  sure_operation: function () {
    var thisPage = this;
    if (!thisPage.data._name){
      app.showWarnMessage("请输入客户姓名！");  //失败
      return;
    }
    if (!thisPage.data._phone) {
      app.showWarnMessage("请输入联系方式！");  //失败
      return;
    }

    wx.request({
      url: urls + '/app/related/addCustomerReport',
      data: {           //请求参数 
        usermanager_id: app.globalData.user_Info.user_id, //用户id
        customer_name: thisPage.data._name,  //用户姓名
        phone:thisPage.data._phone//电话
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        console.log(resData.code+'返回来的参数');
        console.log(resData.message + '返回来的值');
        if (resData.code == 0) {

          app.showSuccessMessage(resData.message);  //成功
          thisPage.setData({
            _popUp: true,   //数据
            _name:null,
            _phone:null
          })

        } else if (resData.code == 1) {
          console.log('请求失败！！');
          app.showWarnMessage("提交失败！");  //失败
        }else{
          app.showWarnMessage(resData.message);  //失败
        }
      },
      fail: function (res) {
        app.showWarnMessage("提交失败！");  //失败
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    thisPage.getAuthorize();
    thisPage.getData();
    thisPage.getTaskData(1);
     thisPage.getActivityData(1);
    thisPage.getModels();

  },
  //授权
  getAuthorize:function(e){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功！');
            }
          })
        }
      }
    })
  },
  //获取工作台数据
  getData:function(e){
    var thisPage = this;
    //if (app.globalData.user_Info.user_limits_role == 'seller' || app.globalData.user_Info.user_limits_role == 'server') { //导购
    if (app.globalData.user_Info.user_limits_role == 'seller' ) { //导购
      var icon_all_data = thisPage.data.icon_all_data;
      icon_all_data[3]['go_to_url'] = thisPage.data.product_center_guide;    //产品中心的跳转
      thisPage.setData({
        taskList: false,   //导购
        icon_all_data: icon_all_data,
        typeModels: "seller"
      })
      app.globalData.user_Info.typeModel = 2;   //1是pc 2 是导购 0 是都有
      thisPage.getTodayData(); //获取今日数据 
    }
    else if (app.globalData.user_Info.user_limits_role == 'server' && app.globalData.user_Info.user_limits == 1) { //店铺
      var icon_all_data = thisPage.data.icon_all_data;
      icon_all_data[3]['go_to_url'] = thisPage.data.product_center_guide;    //产品中心的跳转
      thisPage.setData({
        adminList: false,    //昨日概况（后台账号显示）
        icon_all_data: icon_all_data,
        typeModels: "pc",
        isCommercial: true

      })
      app.globalData.user_Info.typeModel = 1;   //1是pc 2 是导购 0 是都有
      //thisPage.getTodayData(); //获取今日数据 
    }
    else {  //集团
      var icon_all_data = thisPage.data.icon_all_data;
      icon_all_data[3]['go_to_url'] = thisPage.data.product_center_admin;    //产品中心的跳转
      thisPage.setData({
        adminList: false,    //昨日概况（后台账号显示）
        icon_all_data: icon_all_data,
        typeModels: "pc",
        isCommercial:true

      })
      app.globalData.user_Info.typeModel = 0;   //1是pc 2 是导购 0 是都有

      if (app.globalData.user_Info.user_limits == 3) {  //集团

      } else if (app.globalData.user_Info.user_limits == 2) {  //分公司

      } else if (app.globalData.user_Info.user_limits == 1) {  //专卖店

      }
    }
  },

  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    var  thisPage = this;
    // app.showWarnMessage("刷新中！");
    thisPage.getTodayData(); //获取今日数据
    thisPage.getTaskData(1);    
    thisPage.getActivityData(1);
    wx.stopPullDownRefresh();  //页面自己回去！！
  },

  /*页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.getTaskData(pages);
      thisPage.getActivityData(pages);
    } else {
      //app.showWarnMessage('没有更多数据了！');
    }
   
  },
//获取销售任务列表
  getTaskData: function (num){
  var thisPage = this;
  wx.request({
    url: urls + '/app/selectAppUserManagerSellTaskList',
    data: {           //请求参数 
      page: num,
      pageSize: thisPage.data.pageSize,
      ispage: true,    //是否分页
      param: {
        seller_id: app.globalData.user_Info.user_id 
      }
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      console.log('请求完毕-获取销售任务列表');
      if (resData.code == 0) {
        var resDataList = resData.result.data;
        if (num > 1) {
          resDataList = thisPage.data.taskListData.concat(resDataList);
        }
        var isTureFalsePage = true;
        if (resDataList.length < thisPage.data.pageSize) {
          var isTureFalsePage = false;
        }
        thisPage.setData({
          taskListData: resDataList,
          isTureFalsePage: isTureFalsePage,
          page: resData.result.page,  //当前页面
          total: resData.result.total,  //总条数

        })
      } else if (resData.code == 1) {
        app.showWarnMessage("提交失败！");  //失败
      }
    },
    fail: function (res) {
      app.showWarnMessage("提交失败！");  //失败
    }
  })
},
  //获取活动任务列表
  getActivityData: function (num) {
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectPresentUerManagerTask',
      data: {           //请求参数 
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: {
          user_manager_id: app.globalData.user_Info.user_id
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
          console.log('获取活动任务列表-请求完毕！！');
          if (num > 1) {
            resDataList = thisPage.data.activityListData.concat(resDataList);
          }
          var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isTureFalsePage = false;
          }
          thisPage.setData({
            activityListData: resDataList,
            isTureFalsePage: isTureFalsePage,
            page: resData.result.page,  //当前页面
            total: resData.result.total,  //总条数

          })
        } else if (resData.code == 1) {
          app.showWarnMessage("提交失败！");  //失败
        }
      },
      fail: function (res) {
        app.showWarnMessage("提交失败！");  //失败
      }
    })
  },
 //移动扫码
  changeDistance:function(e){
    console.log(e.detail);
  },
  scaleImg:function(e){
    console.log('拖动成功了~~');
  },
  //扫码
  scanCode: function (e) {

    app.scanCode('work');
  },
  //转发
  onShareAppMessage: function (res) {
    return {
      title: '魔方云助手',
      path: '/pages/login/login',
      imageUrl:'/pages/images/bg.jpg',
      success: function (res) {
        console.log(res);
        app.addPageSharePoint('工作台-分享');
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
  //请求模块
  getModels: function () {
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectShopColumn1/' + app.globalData.user_Info.shop_id,
      method: 'get',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resturnData = res.data;
        if (resturnData.code == 0) {
          if (resturnData.result.userCommissionSet) {
          
            if (resturnData.result.userCommissionSet.seller_commission_status == 1) {
              app.globalData.seller_commission_status = 1
            }
          }
          for (var das = 0; das < resturnData.result.shopColumn.length; das++) {
            if (resturnData.result.shopColumn[das] == '/pages/person_center/center/commission_center/commission_center') {
              app.globalData.is_horizontal_alliances = true

              thisPage.lookCommission();

              var icon_all_data = thisPage.data.icon_all_data;
              var yiye = {
                url: 'yiye.png',
                title: '异业导购',
                go_to_url: '/pages/work/customer_manager/user_commission/user_file',
                indexPage: '1',
                types: 'yiye',
              }

              icon_all_data.push(yiye) 
              thisPage.setData({
                icon_all_data: icon_all_data
              })

            }
          }
        }
      }
    })
  },

  hideCodeImage: function () {
    var thisPage = this;
    thisPage.setData({
      lookCommission: false
    })
  },
  skipTocenter: function () {
    var thisPage = this;
    wx.setStorageSync('orderImage' + thisPage.data.orderImage.id, true)
    thisPage.setData({
      lookCommission: false
    })
    wx.switchTab({
      url: "/pages/myself/myself_commission/myself"
    })
   
  },
  //查询佣金模块
  lookCommission: function (e) {
    var thisPage = this;

    var data = {};
    data.shopId = app.globalData.user_Info.shop_id;
  

    wx.request({
      url: urls + '/app/selectCommissionImage',  //接口地址
      method: 'POST',
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;
        // console.log('【接口返回数据】',returnData);

        if (returnData.code == 0) { //成功
          var dataList = returnData.result;
          var lookCommission = false;
          if (returnData.result.orderImage && returnData.result.orderImage.image) {
            lookCommission = wx.getStorageSync('orderImage' + returnData.result.orderImage.id);
            var imageUrl = returnData.result.orderImage.image

            imageUrl = 'https' + imageUrl.substring(4)
            returnData.result.orderImage.image = imageUrl

            app.globalData.orderImage = returnData.result.orderImage
          }
          var imageUrl1;
          if (returnData.result.spreadImage && returnData.result.spreadImage.image) {
            imageUrl1 = returnData.result.spreadImage.image

            imageUrl1 = 'https' + imageUrl1.substring(4)
            returnData.result.spreadImage.image = imageUrl1
            app.globalData.spreadImage = returnData.result.spreadImage
          }


          if (!lookCommission && app.globalData.is_horizontal_alliances && app.globalData.seller_commission_status == '1' && returnData.result.orderImage && returnData.result.orderImage.id  ) {


            thisPage.setData({
              orderImage: returnData.result.orderImage,
              lookCommission: true
            })
            thisPage.creatAnimationOpen(); //动画开
          }


        } else {  //失败
          app.showWarnMessage(returnData.message);
        }
      },
      fail: function (res) {     //失败
        console.log('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成
        console.log('请求完成：', res.errMsg);
      }
    })
  },

  //动画展开
  creatAnimationOpen: function () {
    var thisPage = this;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: 'linear',
    })
    thisPage.animation = animation
    animation.scale(1, 1).step();
    thisPage.setData({
      animationData: animation.export()
    })
  },
  //动画关闭
  creatAnimationClose: function (indexs) {
    var thisPage = this;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: 'linear',

    })
    thisPage.animation = animation
    animation.scale(0, 0).step();
    thisPage.setData({
      animationData: animation.export()
    })
    thisPage.rendererImage(indexs);
  },
 
})