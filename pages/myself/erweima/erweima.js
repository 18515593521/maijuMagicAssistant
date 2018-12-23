// pages/myself/erweima/erweima.js
const app = getApp()
var urls = app.globalData.domainName;        //请求域
Page({
  /* 页面的初始数据*/
  data: {
    qrCode:null, //二维码
    invitation_url:null, //
    qrCodeNext:null,    // 最终的 二维码路径
    gift:true,  //等待效果的显示与隐藏
    shareName: null,   //分享的标题
    isShare: true,       //分享框的显示与隐层
    threeBtn: true,    //底部按钮点击以后的弹出框显隐
    btnHidden: false,   //按钮的显隐
    makeCard : false
  },
  // 点击分享显示底部按钮
  maskPopup: function (e) {
    var thisPage = this;    //备份this
    var threeBtn = thisPage.data.threeBtn;    //弹出框的显隐
    var btnHidden = thisPage.data.btnHidden;
    var makeCard = thisPage.data.makeCard;
    thisPage.setData({
      threeBtn: false,
      btnHidden: false,
      makeCard : true
    });
  },
  //点击取消按钮，弹出框隐藏
  maskHidden: function () {
    var thisPage = this;    //备份this
    var threeBtn = thisPage.data.threeBtn;    //弹出框的显隐
    var makeCard = thisPage.data.makeCard;
    thisPage.setData({
      threeBtn: true,
      makeCard: false
    });
  },
  // 点击分享给朋友，按钮隐藏，输入框显示
  shareFriend: function () {
    var thisPage = this;    //备份this
    var btnHidden = thisPage.data.btnHidden;    //弹出框的显隐
    var isShare = thisPage.data.isShare;    //弹出框的显隐
    thisPage.setData({
      btnHidden: true,
      isShare: false
    });
  },
  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var thisPage = this;
    thisPage.getqrCode();
    thisPage.getTemplate();
  },
  //获取二维码
  getqrCode:function(e){
    var thisPage = this;
    wx.request({
      url: urls + '/app/makeQRCode',
      data: {           //请求参数      
        P1: 'H',
        P3:  app.globalData.user_Info.user_id,
        // P4: app.globalData.user_Info.user_id,
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
            qrCode: resData.result
          });  
            wx.getImageInfo({
              src: thisPage.data.qrCode.replace('http', 'https'),
              success: function (ress) {
                thisPage.setData({
                  qrCodeNext: ress.path
                })
              },
              fail:function(ress){
                  console.log(ress);
              }
            })

          
        } else {
          console.log('请求失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
  
  },

  //获取产品模板和邀请好友的模板
  getTemplate: function (e) {
    var thisPage = this;
    wx.request({
      url: urls + '/app/selectInterfaceImg/' + app.globalData.user_Info.factoryId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          wx.getImageInfo({
            src: resData.result.invitation_url.replace('http', 'https'),
            success: function (ress) {
              thisPage.setData({
                invitation_url: ress.path
              })
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
  editShare: function (e) {
    var current = e.currentTarget.dataset;
    var values = current.values;
    var thisPage = this;
    var shareValue = null;
    var threeBtn = thisPage.data.threeBtn;  
    var btnHidden = thisPage.data.btnHidden;  //弹出层底部按钮的显隐
    var makeCard = thisPage.data.makeCard;    //分享按钮的显隐
    if (values == '1') {  //取消
      thisPage.setData({
        shareName: thisPage.data.activityName,
        btnHidden: false,
        makeCard: false
      })

    } else {

    }
    thisPage.setData({
      isShare: true,
      threeBtn: true,
      makeCard: false
    })
    thisPage.onShareAppMessage();
  },
  //写分享的标题
  editShareValues: function (e) {
    var thisPage = this;
    var current = e.currentTarget.dataset;
    var innerContent = e.detail.value;    //输入的内容
    var values = current.values;          //输入内容的集合
    values = innerContent;
    thisPage.setData({
      shareName: values
    });

  },
  //生成分享卡片
  makeCard:function(e){
    var thisPage = this;
    thisPage.setData({
      gift:false
    })
    // console.log(thisPage.data.qrCodeNext);
    // console.log(thisPage.data.invitation_url);
    if (thisPage.data.qrCodeNext && thisPage.data.invitation_url){
      thisPage.setData({
        gift: true
      })
      var parms = 'urlImage=' + thisPage.data.invitation_url + '&erweima=' + thisPage.data.qrCodeNext;
      app.skipUpTo('/pages/work/product_center/share_product_img/share_product_img?' + parms, 1);
    }else{
      thisPage.getqrCode();
      thisPage.getTemplate();
      app.showWarnMessage('网络出错！请重试！');
      thisPage.setData({
        gift: false
      })
    }
  },
  //转发
  onShareAppMessage: function (res) {
    var thisPage = this;
    var imageUrl ;
    if (app.globalData.spreadImage){
      imageUrl = app.globalData.spreadImage.image
    }else{
      imageUrl = ''
    }
    return {
      title: thisPage.data.shareName ? thisPage.data.shareName : app.globalData.user_Info.userInfo.filiale,
      path: '/pages/share/share?P1=H' + '&P3=' + app.globalData.user_Info.user_id + '&appId=' + app.globalData.user_Info.app_id,
      imageUrl: imageUrl,
      success: function (res) {
        app.addPageSharePoint('我的专属码分享');
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
})