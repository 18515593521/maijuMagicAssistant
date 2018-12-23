const app = getApp()
var urls = app.globalData.domainName;        //请求域名
var WxParse = require('../../../pages/plugs/wxParse/wxParse.js');
const ctx = wx.createCanvasContext('myCanvas');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId:null,   //活动id
    activityDetailData:null,  //活动详情的数据
    pastActivityDataGuide:null,  //往期活动 数据
    codeImage:null,   //二维码
    erweima: null,   //二维码(转换以后de)
    activity_url: null, //活动模板的路径
    gift:true,  //等待的现实与隐藏
    makeCard:true,  //生成卡片的现实与隐藏
    activityName:null,   //活动名称
    shareName:null,   //分享的标题
    isShare:true,       //分享框的显示与隐层
    threeBtn : true,    //底部按钮点击以后的弹出框显隐
    btnHidden : false   //按钮的显隐
  
  },
  //授权
  getAccredit: function (e) {
    var thisPage = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: thisPage.data.jointUrl,
                success(mess) {
                  app.showSuccessMessage('成功保存到相册');
                }
              })
            }
          })
        }
      }
    })
  },
  //请求二维码的接口
  getErWeiMa:function(e){
    var thisPage = this;

    wx.request({
      url: urls + '/app/makeQRCode ', //
      data: {           //请求参数  
        P1: 'G',
        P2: thisPage.data.activityId,
        p3: app.globalData.user_Info.user_id,
        ishyaline: false,
        node3_id: app.globalData.user_Info.factoryId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          thisPage.setData({
            codeImage: resData.result, //二维码
            makeCard: false 
          })
          wx.getImageInfo({
            src: resData.result ? resData.result.replace('http', 'https') : resData.result,
            success: function (ress) {
              thisPage.setData({
                erweima: ress.path
              })
              console.log(ress.path+'二维码');
            },
            fail: function (ress) {
              console.log(ress);
            }
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
//活动内容详情
  activityDeatils:function(){
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectHelperActivityAll', //
      data: {           //请求参数      
        id: thisPage.data.activityId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
      //  console.log(res +"活动内容详情");
        if (resData.code == 0) {
          thisPage.setData({
            activityDetailData: resData.result,   //数据
            activityName: resData.result.name
          })
          wx.setStorageSync('activity_head', thisPage.data.activityDetailData) //存储本地
          WxParse.wxParse('details', 'html', resData.result.details, thisPage, 5); //活动详情
        } else if (resData.code == 1) {
            console.log("请求活动详情失败！");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //参与人的头像
  skip_to_head:function(){
    var thisPage = this;
    var skipUrl = "/pages/activity/activity_head_show/activity_head_show" ;   //路径
    var skipType = 1;  //类型
    app.skipUpTo(skipUrl, skipType);   //跳转 
  },
  //往期活动（导购身份登录）
  come_go_activity:function(){
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectHelperHistoryActivityPage', 
      data: {           //请求参数      
        ispage: false,
        shop_id: app.globalData.user_Info.shop_id // 店铺ID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        console.log(resData +"往期活动（导购身份登录）");
        if (resData.code == 0) {
          thisPage.setData({
            pastActivityDataGuide: resData.result   //数据
          })
        
        } else if (resData.code == 1) {
          console.log("请求往期活动失败！");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //往期活动（后台账号登录）
  comeGoActivityAcess: function () {
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectShopHistoryActivity',
      data: {           //请求参数      
        ispage: false,
        shopId: app.globalData.user_Info.shop_id, // 店铺ID
        param: {}
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        console.log(resData+"往期活动（后台账号登录）");
        if (resData.code == 0) {
          thisPage.setData({
            pastActivityDataGuide: resData.result   //数据
          })

        } else if (resData.code == 1) {
          console.log("请求往期活动失败！");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  // 点击分享显示底部按钮
  maskPopup : function(e){
    var thisPage = this;    //备份this
    var threeBtn = thisPage.data.threeBtn;    //弹出框的显隐
    var btnHidden = thisPage.data.btnHidden;
    thisPage.setData({
      threeBtn : false,
      btnHidden : false
    });
  },
  //点击取消按钮，弹出框隐藏
  maskHidden : function(){
    var thisPage = this;    //备份this
    var threeBtn = thisPage.data.threeBtn;    //弹出框的显隐
    thisPage.setData({
      threeBtn: true
    });
  },
  // 点击分享给朋友，按钮隐藏，输入框显示
  shareFriend : function(){
    var thisPage = this;    //备份this
    var btnHidden = thisPage.data.btnHidden;    //弹出框的显隐
    var isShare = thisPage.data.isShare;    //弹出框的显隐
    thisPage.setData({
      btnHidden: true,
      isShare : false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    
    thisPage.setData({
      activityId: options.details   //活动id
    })
    
    thisPage.activityDeatils(); //活动内容详情
    if (app.globalData.user_Info.user_limits_role =='seller'){ //导购
      thisPage.come_go_activity();  //导购身份登录
    } else {  //后台账号登录
      thisPage.comeGoActivityAcess(); //后台账号登录
    }
    thisPage.getErWeiMa();   //请求二维码
    thisPage.getActivityTemplate();  //请求活动模板
   
  },
  //往期活动跳转活动详情
  skips:function(e){
    var current = e.currentTarget.dataset;
    var id = current.ids;
    var skip = '/pages/activity/activity_details/activity_details?details=' + id;
    app.skipUpTo(skip,2);
  },
  //获得活动模板
  getActivityTemplate: function (e) {
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectActivityInterfaceImg/' + thisPage.data.activityId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          wx.getImageInfo({
            src: resData.result ? resData.result.replace('http', 'https') : resData.result,
            success: function (ress) {
              thisPage.setData({
                activity_url: ress.path,
                makeCard:false
              })
              console.log(ress.path);
            },
            fail: function (ress) {
              console.log(ress);
            }
          })
        } else {
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //生成分享卡片
  makeCard:function(e){
    var thisPage = this;
    thisPage.setData({
      gift: false
    })
    if (thisPage.data.erweima && thisPage.data.activity_url) {
      thisPage.setData({
        gift: true
      })
      var parms = 'urlImage=' + thisPage.data.activity_url + '&erweima=' + thisPage.data.erweima;

      app.skipUpTo('/pages/work/product_center/share_product_img/share_product_img?' + parms, 1);
    } else {
      thisPage.getErWeiMa();   //请求二维码
      thisPage.getActivityTemplate();  //请求活动模板
      app.showWarnMessage('生成出错,点击重试！');
    }
  },
  editShare:function(e){
    var current = e.currentTarget.dataset;
    var values = current.values;
    var thisPage = this;
    var shareValue = null;
    var threeBtn = thisPage.data.threeBtn;
    var btnHidden = thisPage.data.btnHidden;
    if (values=='1'){  //取消
    thisPage.setData({
      shareName: thisPage.data.activityName,
      btnHidden : false
    })

    }else{
     
    }
    thisPage.setData({
      isShare:true,
      threeBtn : true
    })
   
  },
  //写分享的标题
  editShareValues:function(e){
    var thisPage = this;
    var current = e.currentTarget.dataset;
    var innerContent = e.detail.value;    //输入的内容
    var values = current.values;          //输入内容的集合
    values = innerContent;
    thisPage.setData({
      shareName: values
    });
    
  },
  //转发
  onShareAppMessage: function (res) {
    var thisPage = this;
    return {
      title: thisPage.data.shareName ? thisPage.data.shareName : thisPage.data.activityName,
      path: '/pages/share/share?P1=G&P3=' + app.globalData.user_Info.user_id + '&appId=' + app.globalData.user_Info.app_id + '&activity_id=' + thisPage.data.activityId,
      success: function (res) {
        app.addPageSharePoint(thisPage.data.activityDetailData.name);
        // 转发成功
     
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },

})