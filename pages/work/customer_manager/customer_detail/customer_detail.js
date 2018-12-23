const app = getApp();
var urls = app.globalData.domainName;        //请求域名

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId:null,  // 客户id
    makeOrder:true, //生成订单的现实与隐藏
    orderId:null,   //订单id
    customerTyle: ['请选择', '40-50%潜在与意向沟通','60-70%需求分析与产品确认', '70-80%上门测量与提交方案', '80-90%多次进店与邀约谈判', '90-100%价格谈判与逼单成交'],  //客户类型
    customerInfo:null,  //客户的信息
    customerActivity:[], //用户参与的活动
    customerCommunication:[],   //导购通讯
    customerEvaluate:[],  //用户的评价
    customerOrder:[],  //用户订单
    propertyData: ['全部渠道', '公司分配', '邀请注册'],  //来源
    titleList: ['', '已联系', '已进店', '已购卡', '已订单', '已活动', '已物流', '已安装', '售后中', '已关闭', '未接通'],//1已联系、2、已进店、3已购卡、4已订单、5已活动、6 已物流、7已安装、8售后中、9 已关闭、10未接通
    orderState:["","待支付","待安装","已完成","关闭"],
    closeOrderBox:true, //关闭订单的(显示与隐藏)
    closeOrderCause:null,  //关闭订单的原因
    closeOrderButton:true,   //关闭订单按钮的显示隐藏
    activeList:['active','',''],//显示标签
    itenList:['',true,true],//显示页面
    sexData: ['请选择', '男', '女'], //性别1.男 2.女
    comeShop: ['请选择', '首次进店', '第二次进店', '第三次进店', '多次进店', '成交'],// 进店次数
    customerTyle: ['请选择', '40-50%潜在与意向沟通', '60-70%需求分析与产品确认', '70-80%上门测量与提交方案', '80-90%多次进店与邀约谈判', '90-100%价格谈判与逼单成交'],  //客户类型
    homeArea: ['请选择', '90方以下', '90-110方', '110-130方', '130-150方', '150-180方', '180方以上'],//房子面积
    fitmentStyle: ['请选择', '现代简约', '北欧时尚', '美式田园', '意式轻奢', '中式古典', '欧式简欧', '其他'],  //装修风格
    fitmentlength: ['请选择', '未装修', '已装修', '水电', '泥工', '木工', '油漆', '其他'],// 装修进度
    isHaveWeiXin: ['请选择', '已加并通过', '已加未通过', '未加'],// 是否添加客户微信
    isorderamount: ['请选择', '已预约', '未预约', '其他'],// 是否预约上门测量
    issendNote: ['请选择', '已发', '未发'],//是否发送离店信息
    uncertainText: '请选择时间',
    communicate_id: null,  //沟通记录的if
    HintInfos: true,  //提示框的显示与隐藏
    fristClick: 1,//第一次点击是谁:1,//第一次点击是谁
    fristCode: null,//第一次点击是谁
    noKnown: false,//未知 和 请选择时间
    noKnown2: false,//未知 和 请选择时间
    noKnown3: true,
    noKnown4: true,
    canTipSelect: true,  //可以选择时间的弹框
    noTipSelect: true,  //不可以选时间的弹框
    canTipSelect1: true,  //可以选择时间的弹框
    noTipSelect1: true,  //不可以选时间的弹框
    isUncertain: 1,  //是否选择了未定 1 是未选择 2是选择

    talkInfo: [], //上次谈话的记录
    last_communicate_time: null,  //上次提交的沟通时间-年月日
    last_communicate_time1: null,  //上次提交的沟通时间 - 时分秒
    communicate_time1: '请选择时间',  //选择沟通时间的时间
    installation_time1: '请选择时间',  //预计安装时间-开始
    installation_time2: '请选择时间',  //预计安装时间-结束
    startTimers1: true,  //预计开始安装时间的现实与隐藏
    startTimers2: true,  //预计结束安装时间的现实与隐藏
    textHidenShow: false,//textare 的显示与隐藏

    info: {
      competitiveBrand: null,// 竞争品牌
      sendMessage: 0,  //是否发送离店短信
      appointment: 0,  //是否预约测量
      addWeixin: 0,  //是否添加微信
      furnishProgress: 0, //装修进度
      furnishStyle: 0,// 装修风格
      houseSpace: 0,  //房屋面积
      intoShopNumber: 0,  //进店次数
      customerType: 0,  //客户类型
      customer_id: null, //消費者id
      userManager_id: null,  //导购id
      gender: 0,  //性别
      age: null, //年龄
      communicate_time_start: '请选择日期',  //沟通开始时间
      erection_space: null, //预计安装面积
      floor_space: null, //预计房屋面积
      installation_time_start: '请选择日期',  //预计安装时间开始
      installation_time_end: '请选择日期',  //预计安装时间开始

      install_style: null, //安装款式
      install_budget: null,  //预计安装预算
      customerUserManagerBasic: {

        communicate_content: null,   //沟通内容
      },
      remark: null,  //备注
      disableds:true,   //让input 不显示
      hiddents:true     //让表单下拉三角不显示
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var thisPage = this;
    thisPage.setData({
      'info.customer_id': options.detail,
      'info.userManager_id': app.globalData.user_Info.user_id,
      customer_Id: options.detail,
      disableds:true,
    })

    if (options.skinTypes && options.skinTypes==1){
      thisPage.setData({
        activeList:['','active',''],
        itenList: ['true', '','true']
      })
    }

    thisPage.getTalkInfo(); //获取沟通信息

    thisPage.setData({
      customerId: options.detail,
      
    })
    
    thisPage.getCustomerInfo();
  },
  onShow:function(){
    var thisPage = this;
    thisPage.getTalkInfo(); //获取沟通信息
    thisPage.getCustomerInfo();
  },
  //获取沟通信息
  getTalkInfo: function (e) {
    var thisPage = this;
    wx.request({
      url: urls + '/app/related/customer/selectCommunicate',
      data: {           //请求参数      
        customer_id: thisPage.data.info.customer_id,
        userManager_id: thisPage.data.info.userManager_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          var resDatas2 = resData.result;
          if (resDatas2.communicate_time_start){
            var communicate_time_start = (until.switchTime(resDatas2.communicate_time_start, 'date')).replace(/-/g, '/');  //沟通开始时间
            var communicate_time_start1 = until.switchTime(resDatas2.communicate_time_start, 'second');  //沟通开始时间-时分
          }else{
            var communicate_time_start = thisPage.data.info.communicate_time_start;
            var communicate_time_start1 = thisPage.data.info.communicate_time_start1;
          }
          if (resDatas2.installation_time_start) {
            var installation_time_start = (until.switchTime(resDatas2.installation_time_start, 'date')).replace(/-/g, '/');  //预计安装时间开始
            var installation_time_start1 = until.switchTime(resDatas2.installation_time_start, 'second');  //预计安装时间开始-时分
          } else {
            var installation_time_start = thisPage.data.info.installation_time_start;
            var installation_time_start1 = thisPage.data.installation_time_start1;
          }

          if (resDatas2.installation_time_end) {
            var installation_time_end = (until.switchTime(resDatas2.installation_time_end, 'date')).replace(/-/g, '/');//预计安装时间开始
            var installation_time_end1 = until.switchTime(resDatas2.installation_time_end, 'second');//预计安装时间开始-时分
          } else {
            var installation_time_end = thisPage.data.info.installation_time_end;
            var installation_time_end1 = thisPage.data.installation_time_end1;
          }
          //安装时间的显示与隐藏
          if (resDatas2.installation_time_start && resDatas2.installation_time_end) {
            thisPage.setData({
              noKnown: true,
              noKnown2: true,
              noKnown4: false,
              noKnown3: false,
              canTipSelect: false,
              noTipSelect: true,
              canTipSelect1: false,
              noTipSelect1: true,
            })
          }


          thisPage.setData({
            talkInfo: resData.result,
            communicate_id: resDatas2.communicate_id,
            installation_time2: installation_time_end1 ? installation_time_end1 : '',  //预计安装时间-结束

            info: {
              competitiveBrand: resDatas2.competitiveBrand,// 竞争品牌
              sendMessage: resDatas2.sendMessage,  //是否发送离店短信
              appointment: resDatas2.appointment,  //是否预约测量
              addWeixin: resDatas2.addWeixin,  //是否添加微信
              furnishProgress: resDatas2.furnishProgress, //装修进度
              furnishStyle: resDatas2.furnishStyle,// 装修风格
              houseSpace: resDatas2.houseSpace,  //房屋面积
              intoShopNumber: resDatas2.intoShopNumber,  //进店次数
              customerType: resDatas2.customerType,  //进店次数
              customer_id: resDatas2.customer_id,    
              userManager_id: resDatas2.userManager_id,
              gender: resDatas2.gender,  //性别
              age: resDatas2.age, //年龄
              // communicate_time_start: communicate_time_start,  //沟通开始时间
              erection_space: resDatas2.erection_space, //预计安装面积
              floor_space: resDatas2.floor_space, //预计房屋面积
              installation_time_start: installation_time_start,  //预计安装时间开始
              installation_time_end: installation_time_end,  //预计安装时间开始
              install_style: resDatas2.install_style, //安装款式
              install_budget: resDatas2.install_budget,  //预计安装预算
              customerUserManagerBasic: {
                communicate_content: resDatas2.customerUserManagerBasic  //沟通内容
              },
              remark: resDatas2.remark //备注
            }



          })

        } else if (resData.code == 2) {

        } else {
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },

  //选择状态
  bindChangeState: function (e) {
    var thisPage = this;
    var values = e.detail.value;
    var current = e.currentTarget.dataset;
    var keys = current.keys;
    var basic = current.basic;
    if (values !== '0') {
      if (basic) {
        var infos = 'info.customerUserManagerBasic.' + keys;
        thisPage.setData({
          [infos]: values
        })
      } else {
        var infos = 'info.' + keys;
        thisPage.setData({
          [infos]: values
        })
      }
    }
    console.log(thisPage.data.info);
  },

  //选择年龄、面积、预算、时间
  editContent: function (e) {
    var thisPage = this;
    var values = e.detail.value;
    var current = e.currentTarget.dataset;
    var keys = current.keys;
    var basic = current.basic;

    if (basic) {
      var infos = 'info.customerUserManagerBasic.' + keys;
      thisPage.setData({
        [infos]: values
      })
    } else {
      if (keys == 'installation_time_end' || keys == 'installation_time_start' || keys == 'communicate_time_start') {
        values = values.replace(/-/g, '/');
      }
      var infos = 'info.' + keys;
      thisPage.setData({
        [infos]: values
      })
      if (keys == 'installation_time_end') {
        thisPage.setData({
          noKnown4: false,
          textHidenShow: false

        })
      } else if (keys == 'installation_time_start') {
        thisPage.setData({
          noKnown3: false,
          textHidenShow: false
        })
      }
    }
  },
  //选择沟通时间-时分
  bindTimeChange1: function (e) {
    this.setData({
      communicate_time1: e.detail.value
    })
  },
  //安装时间-时分(开始)
  installation_time1: function (e) {
    this.setData({
      installation_time1: e.detail.value
    })
  },
  //安装时间-时分（结束）
  installation_time2: function (e) {
    this.setData({
      installation_time2: e.detail.value
    })
  },
  //编辑
  editData:function(){
     var thisPage = this;
     thisPage.setData({
       disableds:false,
       hiddents:true
     }) 
  },
  //提交
  submitData: function () {
    var thisPage = this;
    var timestamp = Date.parse(new Date()); //获取当前时间
    //沟通时间
    var installation_time_end = Date.parse(new Date(thisPage.data.info.installation_time_end + ' ' + thisPage.data.installation_time2));
    var installation_time_start = Date.parse(new Date(thisPage.data.info.installation_time_start + ' ' + thisPage.data.installation_time1));
    //安装时间应该大于当前时间
    var communicate_timer = Date.parse(new Date(thisPage.data.info.communicate_time_start + ' ' + thisPage.data.communicate_time1));

    //进店次数！
    if (!thisPage.data.info.intoShopNumber || thisPage.data.info.intoShopNumber <= 0) {
      app.showWarnMessage('请填进店次数！');
      return;
    }
    //客户类型
    if (!thisPage.data.info.customerType || thisPage.data.info.customerType <= 0) {
      app.showWarnMessage('请填客户类型！');
      return;
    }
    //性别
    if (thisPage.data.info.gender <= 0) {
      app.showWarnMessage('请选择性别！');
      return;
    }

    //年龄
    if (!thisPage.data.info.age || thisPage.data.info.age <= 0) {
      app.showWarnMessage('请填写年龄！');
      return;
    }

    thisPage.setData({
      'info.communicate_time_start': communicate_timer,
      'info.installation_time_start': installation_time_start,
      'info.installation_time_end': installation_time_end,

      'info.sendMessage': thisPage.data.info.sendMessage == 0 ? '' : thisPage.data.info.sendMessage, //是否发送离店短信
      'info.appointment': thisPage.data.info.appointment == 0 ? '' : thisPage.data.info.appointment, //是否预约测量
      'info.addWeixin': thisPage.data.info.addWeixin == 0 ? '' : thisPage.data.info.addWeixin, //是否添加微信
      'info.furnishProgress': thisPage.data.info.furnishProgress == 0 ? '' : thisPage.data.info.furnishProgress, //装修进度
      'info.furnishStyle': thisPage.data.info.furnishStyle == 0 ? '' : thisPage.data.info.furnishStyle,// 装修风格
      'info.houseSpace': thisPage.data.info.houseSpace == 0 ? '' : thisPage.data.info.houseSpace, //房屋面积

    })

    wx.request({
      url: urls + '/app/related/customer/addCommunicate',
      data: thisPage.data.info,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          var skinUp = '/pages/work/customer_manager/customer_detail/customer_detail?detail=' + thisPage.data.info.customer_id;
          app.skipUpTo(skinUp, 2);
        } else {
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //预计开始安装时间-确定 (隐藏)
  clickSure: function (e) {
    var thisPage = this;
    var current = e.currentTarget.dataset;
    var type = current.type;
    if (thisPage.data.fristClick == 1) {
      thisPage.setData({
        fristCode: type
      })
    }

    if (thisPage.data.fristCode == 1) {
      thisPage.setData({
        canTipSelect: false,
        noTipSelect: true,
        noTipSelect1: false,
        canTipSelect1: true,
      })
    } else {
      thisPage.setData({
        noTipSelect: false,
        canTipSelect: true,
        noTipSelect1: true,
        canTipSelect1: false
      })
    }

    if (type == 1) {
      thisPage.setData({
        startTimers1: true,
        textHidenShow: true
      })
    } else {
      thisPage.setData({
        startTimers2: true,
        textHidenShow: true
      })
    }

    thisPage.setData({
      uncertainText: '请选择日期',
      noKnown: true,
      noKnown2: true,
    })
  },
  //键盘收起
  cancel: function (e) {
    console.log('点击了取消！！！！');
    this.setData({
      textHidenShow: false
    })
  },
  //点击让提示的弹框隐藏
  sures: function (e) {
    this.setData({
      HintInfos: true,
      textHidenShow: false
    })
  },
  //点击未知让弹框隐藏
  showSelect: function (e) {
    var current = e.currentTarget.dataset;
    var type = current.type;
    if (type == 1) {
      this.setData({
        startTimers1: false,
        textHidenShow: true
      })
    } else {
      this.setData({
        startTimers2: false,
        textHidenShow: true
      })
    }
  },

  //点击未知的时候（弹框上）
  unknown: function (e) {
    this.setData({
      uncertainText: '未定',
      noKnown: false,
      noKnown2: false,
      noKnown3: true,
      noKnown4: true,
      canTipSelect1: true,
      noTipSelect1: true,
      canTipSelect: true,
      noTipSelect: true,
      startTimers1: true,
      startTimers2: true,
      textHidenShow: false,
      "info.installation_time_start": '请选择日期',  //预计安装时间开始
      "info.installation_time_end": '请选择日期',  //预计安装时间开始"
      isUncertain: 2
    })
  },

  //点击顶部按钮请求
  click_request_data: function (e) {
    var searchType = parseInt(e.currentTarget.dataset.item);
    var activeList = [];
    var itenList = [];
    var thisPage = this;
    var current = e.currentTarget.dataset;
    var item = current.item;
    for (var i = 0; i < thisPage.data.activeList.length; i++) {
      if (i == item) {
        activeList.push('active');
        itenList.push('');
      } else {
        activeList.push('');
        itenList.push('true');
      }
    }
    thisPage.setData({
      activeList: activeList,
      itenList: itenList
    })
    if (wx.showLoading) {
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }
  },
//获取客户信息
getCustomerInfo:function(){
  var thisPage = this;
  wx.request({
    url: urls + '/app/selectSellerCustomerDetail',
    data: {           //请求参数      
      shopId:app.globalData.user_Info.shop_id,  //店铺id
      sellerId: app.globalData.user_Info.user_id,    //导购id
      customerId: thisPage.data.customer_Id   //用户id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      if (resData.code == 0){
        thisPage.setData({
          customerInfo: res.data.result.customerInfo,  //客户的信息
          customerActivity: res.data.result.customerActivity, //用户参与的活动
          customerCommunication: res.data.result.customerCommunication,   //导购通讯
          customerEvaluate: res.data.result.customerEvaluate,  //用户的评价
          customerOrder: res.data.result.customerOrder  //用户订单
        })
      }else{

      }
    
    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//打开或者关闭弹框
  openCreateOrder:function(e){
  var current = e.currentTarget.dataset;
  var state=null;
  if (current.type=='close'){
    state = true;
  } else if (current.type == 'open'){
    state = false;
  }
  this.setData({
    makeOrder: state
  })
},

//确定生成订单(活动订单2、销售订单1)
sureMakeOrder:function(e){
  var current = e.currentTarget.dataset;
  var ordertype = current.ordertype;
  this.setData({
    makeOrder: true
  })
  
  var skipUrl = '/pages/work/customer_manager/make_order/make_order/make_order';  //跳转的地址
  if (ordertype == 1){
    skipUrl = skipUrl + '?activityId=' + '&customerId=' + this.data.customerId + '&orderType=2' + '&editType=add' + '&pageFrom=activity';
    app.skipUpTo(skipUrl, 2);
  }else if (ordertype == 2){
    var activity = this.getActivity(this.data.customerId, skipUrl);//获取当前用户是否有参加活动
  }
},
//获取当前用户是否有参加活动
  getActivity: function (customerId, skipUrls){
  var thisPage = this;
  wx.request({
    url: urls + '/app/selectCustomerActivity',
    data: {           //请求参数      
      shopId:app.globalData.user_Info.shop_id,  //店铺id
      customerId: customerId   //用户id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
        //code : 2 , 未参加活动
      if(resData.code ==2){
        app.showWarnMessage(resData.message);  //失败
      }else{
        if (res.data.result.length==1){    //一个自动取第一个（目前） 多个的话用户自己选择（后期）
          var activityId = res.data.result[0].activity_id;
          var skipUrl = skipUrls + '?activityId=' + activityId + '&customerId=' + thisPage.data.customerId + '&orderType=1' + '&editType=add' + '&pageFrom=activity';
          app.skipUpTo(skipUrl, 1);
        }
      }
    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//关闭订单 - （取消-打开）
cause_box:function(e){
  var current = e.currentTarget.dataset;
  var types = current.type;
  var orderId = current.id;
  var cause = true;
  if (types =='close'){
    cause = true;
  }else{
    cause = false;
  }
  this.setData({
    closeOrderBox: cause,
    orderId: orderId
  })
},
//写关闭订单的原因
editCause:function(e){
var values = e.detail.value;

var thisPage = this;
thisPage.setData({
  closeOrderCause: values
})
},
//确定提交关闭订单的原因
sure_cause_box:function(e){
  var thisPage = this;
  if (!thisPage.data.closeOrderCause){
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
          closeOrderBox:true
        })
        var skinp = "/pages/work/customer_manager/customer_detail/customer_detail?detail=" + thisPage.data.customerId;
        app.skipUpTo(skinp,2);
      } else{
        app.showWarnMessage('提交失败！');
      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//编辑订单
editOrderDetail:function(e){
  var current = e.currentTarget.dataset;
  var customerId = current.id;
  var orderType = current.ordertype;
  var activityId = current.activityid;
  var orderId = current.orderid;
  var editType = current.edittype;
  var skipUrl = '/pages/work/customer_manager/make_order/make_order/make_order?activityId=' + activityId + '&customerId=' + customerId + '&orderType=' + orderType + '&editType=' + editType + '&orderId=' + orderId + '&pageFrom=activity';  //跳转的地址
  app.skipUpTo(skipUrl, 1);

},
//跳转活动详情
activity_detail:function(e){
  var current = e.currentTarget.dataset;
  var activityId = current.id;
  var skipUrl = '/pages/work/customer_manager/activity_detail/activity_detail?activityId=' + activityId + '&customerId=' + this.data.customerId;
  app.skipUpTo(skipUrl, 1);
},
//增加沟通记录
add_talk:function(e){
  var skipUrl = '/pages/work/customer_manager/make_order/add_talk/add_talk?customer_id=' +this.data.customerId;
  app.skipUpTo(skipUrl, 1);
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCustomerInfo();
    wx.stopPullDownRefresh();  //页面自己回去！！
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //转发
  // onShareAppMessage: function (res) {
  //   var thisPage = this;
  //   return {
  //     title: '魔方云助手',
  //     path: '/pages/share/share?P1=A',
  //     imageUrl: '/pages/images/bg.jpg',
  //     success: function (res) {
  //       app.addPageSharePoint('分享');
  //       // 转发成功
  //     },
  //     fail: function (res) {

  //       // 转发失败
  //     }
  //   }
  // },
})