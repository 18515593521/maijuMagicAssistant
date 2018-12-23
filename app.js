//app.js
App({
  globalData: {
    //【域名】
    //domainName: 'http://192.168.1.6:8080/shop-web',   //域名
     domainName: 'https://www.kaolaj.com/magicCloud',   //域名（线上）
    //  domainName: 'https://www.kaolaj.com/magic_cloud2.0_test',   //域名（测试）
    //  domainName: 'https://www.kaolaj.com/magic_cloud2.0_shenhe',
    user_Info: {
      userInfo:null,  //登陆者的信息
      user_id: null,  //用户id
      user_limits_role:null, //用户角色
      user_limits: null, //用户等级    grade
      shop_id: null,  //店铺id
      factoryId:null,   //集团
      filialeId:null,  //分公司id
      typeModel: null,    //1是pc 2 是导购 0 是都有
      app_id:null   //appid
    },
    name: '魔方云助手端',
    appId: 'wx5a971c67166aa88b',
    appSecret: '8d035e4f9c8359c9935de167007d6487',
    appKey: '',
    logoImage:null,  //获取头像
    type:300,
    version: '1.0.0',
    is_horizontal_alliances: false
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  //显示警告信息
  showWarnMessage: function (message) {
    if (message) {
      wx.showToast({
        title: message,
        icon: 'loading',
        image: "/pages/images/warn.png",
        duration: 2000,
        mask: true
      })
    }
  },
  //显示成功信息
  showSuccessMessage: function (message) {
    if (message) {
      wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000,
        mask: true
      })
    }
  },
  //跳转  
  skipUpTo: function (skipUrl,type){ 
    if (type == 1){      //保留当前页面，跳转
      wx.navigateTo({
        url: skipUrl  
      })
    }else if (type == 2){ //关闭当前页，（重定向）
      wx.redirectTo({
        url: skipUrl
      })
    }else if (type == 3) {  //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      wx.switchTab({
        url: skipUrl
      })
    } else if (type == 4){  //关闭所有的页面，跳转
      wx.reLaunch({
        url: skipUrl
      })
    } else if (type == 5) {   //关闭当前页面，返回上一页面或多级页面
      wx.reLaunch({
        url: skipUrl
      })
    }
  },
  //返回上层
  backGo: function (backCount){
    wx.navigateBack({
      delta: backCount
    })
  },
  //模态框
  modealTap: function (title, content){
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //增加页面分享积分
  addPageSharePoint: function (title) {
    var thisApp = this;
    console.log(title);
    wx.request({
      url: thisApp.globalData.domainName + '/app/addIntegral',  //接口地址
      data: {           //请求参数
        seller_id: thisApp.globalData.user_Info.user_id,  //导购id
        type_index: 1,  // 积分类型    1.分享积分2.订单积分3.推广积分4.邀请积分
        type_name:'分享',
        point:'1',
        title: title ? title : thisApp.globalData.name
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;

        if (returnData.code == 0) { //成功
          console.log("分享success");
        } else {  //失败
          console.log("分享fail");
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
  //扫码
  scanCode: function (detail) {
    var thisPage = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res.result);
        var result = JSON.parse(res.result) ;
        
        var activityId = result.activityId;
        var node3 = result.node3;
        var customerId = result.customerId;
        console.log(activityId, node3, customerId);
        if (node3 == thisPage.globalData.user_Info.factoryId){
          if (activityId && node3 && customerId){
            var skinUp = "/pages/activity_process/activity_process?activityId=" + activityId + "&customerId=" + customerId + "&detail=" + detail + "&node3=" + node3;
            thisPage.skipUpTo(skinUp, 1);
          } else if (result.P1){
            if (result.P1 =='M'){
              var skinUp = "/pages/member/member?customerId=" + result.P2;
              thisPage.skipUpTo(skinUp, 1);
            }
          }

        }else{
          thisPage.showWarnMessage('品牌不符！');
          return;
        }


      }
    })
  },
//兼容性
  compatibility:function(cases){
    if (!wx.canIUse(cases)){
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})