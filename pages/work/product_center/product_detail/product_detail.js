// pages/work/product_center/product_detail/product_detail.js
var app = getApp();   //获取应用实例
var urls = app.globalData.domainName;        //请求域名
var WxParse = require('../../../plugs/wxParse/wxParse.js');
const ctx = wx.createCanvasContext('myCanvas');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId:null, //产品id
    productData:null,   //产品详情的数据
    product_title:null,  //产品标题
    codeImage:null,    //二维码
    erweima:null,  //生成二维码的链接
    qrShowHidden:true,  //二维码显示与隐藏
    detailsData:['active',''],//图文详情
    showDetails:['','true'],  //对应的图文详情展示
 
    colorNature:[],  //颜色属性
    specification:[],  //规格
    colorOne:null,  //第一个颜色
    specifcationOne:null,  //第一个规格
    specifcationId:null,  //第一个规格id
    colorData:[],     //样式-颜色选择数组
    specificationData:[],  //样式-规格数组

    productInfo:[],  //产品信息
    hiddenShow:true,  //属性的显示与隐藏
    jointUrl:null,  //cavans 生成的链接
    makeCard:true , //生成卡片的现实与隐藏
    productsharing_url:null,   //生成产品链接
    gift:true,
    shareName: null,   //分享的标题
    isShare: true,       //分享框的显示与隐层
    threeBtn: true,    //底部按钮点击以后的弹出框显隐
    btnHidden: false   //按钮的显隐
  },
  // 点击分享显示底部按钮
  maskPopup: function (e) {
    var thisPage = this;    //备份this
    var threeBtn = thisPage.data.threeBtn;    //弹出框的显隐
    var btnHidden = thisPage.data.btnHidden;  //弹出框的按钮显隐
    thisPage.setData({
      threeBtn: false,
      btnHidden: false
    });
  },
  //点击取消按钮，弹出框隐藏
  maskHidden: function () {
    var thisPage = this;    //备份this
    var threeBtn = thisPage.data.threeBtn;    //弹出框的显隐
    thisPage.setData({
      threeBtn: true
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
  editShare: function (e) {
    var current = e.currentTarget.dataset;
    var values = current.values;
    var thisPage = this;
    var shareValue = null;
    var threeBtn = thisPage.data.threeBtn;
    var btnHidden = thisPage.data.btnHidden;
    if (values == '1') {  //取消
      thisPage.setData({
        shareName: thisPage.data.activityName,
        btnHidden: false
      })

    } else {

    }
    thisPage.setData({
      isShare: true,
      threeBtn: true
    })
    thisPage.onShareAppMessage();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    console.log(JSON.stringify(options),options,options.P1, options.P2, options.node3_id);
    if (options.scene || options.P1) {
      thisPage.setData({
        productId: options.P2,
      });
      app.globalData.user_Info.user_id = options.P3;  // 用户id
      app.globalData.user_Info.factoryId = options.node3_id;  //厂家id
    }else{
      thisPage.setData({
        productId: options.details
      })
    }

    thisPage.getProductDeTetail();  //获取产品信息
    thisPage.getErWeiMaCode();  //获取二维码
    thisPage.getTemplate(); //生成模板
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
 //获取产品详情
 getProductDeTetail:function(e){
   var thisPage = this;
   wx.request({
     url: urls + '/app/productdetails', //
     data: {           //请求参数      
       productId:thisPage.data.productId ,  //产品id
       customerId: app.globalData.user_Info.user_id
     },
     header: {
       'content-type': 'application/json' // 默认值
     },
     method: 'POST',
     success: function (res) {
       var resData = res.data;
       //  console.log(res +"产品详情");
       if (resData.code == 0) {
          thisPage.setData({
            productData: resData.result,
            product_title: resData.result.info.product_title
          })
          WxParse.wxParse('details', 'html', resData.result.info.description, thisPage, 5); //活动详情
       } else if (resData.code == 1) {
         console.log("请求产品详情失败！");
       }
     },
     fail: function (res) {
       console.log(res + '失败！');
     }
   })
 },
 //获取二维码
 getErWeiMaCode:function(){
   var thisPage = this;
   wx.request({
     url: urls + '/app/makeQRCode',  //接口地址
     data: {           //请求参数
       P1: 'C',
       P2: thisPage.data.productId,
       P3: app.globalData.user_Info.user_id,
       ishyaline: false,
       node3_id: app.globalData.user_Info.factoryId
     },
     method: 'POST',
     dataType: 'json',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {  //成功
       var returnData = res.data;

       if (returnData.code == 0) { //成功
         thisPage.setData({
           codeImage: returnData.result.replace("http", "https")
         })
         wx.getImageInfo({
           src: returnData.result.replace('http', 'https'),
           success: function (ress) {
             thisPage.setData({
               erweima: ress.path,
               makeCard:false
             })
           },
           fail: function (ress) {
             console.log(ress);
           }
         })
       } else {  //失败
         console.log("接口异常！");
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
 //切换（详情、案例、参数）
 switchButton:function(e){
   var thisPage = this;
   var current = e.currentTarget.dataset.detail;
   var detailsData = []; //点击按个那个显示
   var showDetails = [];  //展示那个（被显示的）的数据
   
   for (var i = 0; i < thisPage.data.showDetails.length;i++){
        if (i == current){
          detailsData.push('active');
          showDetails.push('');
        }else{
          detailsData.push('');
          showDetails.push('true');         
        }
    }
    thisPage.setData({
      detailsData: detailsData,
      showDetails:showDetails
    })

 },
 //跳转到产品属性
 select_to_go:function(){
   this.getSelectNature();  //获取产品颜色
   this.setData({
     hiddenShow: false
   })
 },
 //获取选择属性（颜色）
 getSelectNature:function(e){
   var thisPage = this;
   wx.request({
     url: urls + '/app/getselectproperties',  //接口地址
     data: {           //请求参数
       productId: thisPage.data.productId
     },
     method: 'POST',
     dataType: 'json',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {  //成功
       var returnData = res.data;

       if (returnData.code == 0) { //成功
         var colorData = [];  //颜色
         for (var i = 0; i < returnData.result.length;i++){
            if(i==0){
              thisPage.setData({
                colorOne: returnData.result[i]
              })
              colorData.push('active');
            }else{
              colorData.push('');
            }
         }
         thisPage.setData({
           colorNature: returnData.result, //颜色数据
           colorData:colorData   //颜色选择样式数组
         })
         thisPage.getSelectSpecification(thisPage.data.colorOne);  //获取选择属性(规格)

       }else {  //失败
         console.log("接口异常！");
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

 //获取选择属性(规格)
 getSelectSpecification: function (color) {
   var thisPage = this;
   wx.request({
     url: urls + '/app/getselectpropertiesbycolor',  //接口地址
     data: {           //请求参数
       color_model: color,//颜色
       productId: thisPage.data.productId
     },
     method: 'POST',
     dataType: 'json',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {  //成功
       var returnData = res.data;

       if (returnData.code == 0) { //成功
         var specificationData = [];  //规格
         for (var num = 0; num < returnData.result.length;num++){
           if (num==0){
              thisPage.setData({
                specifcationOne: returnData.result[num].standard,
                specifcationId: returnData.result[num].id
              })
              specificationData.push('active');
            }else{
              specificationData.push('');
            }
         }
         thisPage.setData({
           specification: returnData.result,
           specificationData: specificationData
         })
         thisPage.getSelectInfo(thisPage.data.specifcationId); //获取选择属性（产品信息）

       } else {  //失败
         console.log("接口异常！");
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
 //获取选择属性（产品信息）
 getSelectInfo: function (id) {
   var thisPage = this;
   wx.request({
     url: urls + '/app/selectproperties',  //接口地址
     data: {           //请求参数
       id: id,//规格id
       productId: thisPage.data.productId
     },
     method: 'POST',
     dataType: 'json',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {  //成功
       var returnData = res.data;

       if (returnData.code == 0) { //成功
         thisPage.setData({
           productInfo: returnData.result
         })
         

       } else {  //失败
         console.log("接口异常！");
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
 //产品属性的显示与隐藏
 detailHiddenShow:function(){ 
   this.setData({
     hiddenShow:true
   })
 },
 //选择颜色
 select_color:function(e){
    var current = e.currentTarget.dataset;
    var color = current.color;
    var indexs = current.indexs; 
    var colorData= [];  //颜色样式
    for(var i = 0;i < this.data.colorNature.length;i++){
      if (i ==indexs){
        colorData.push('active');
      }else{
        colorData.push('');
      } 
    }
    this.setData({
      colorData:colorData
    })
    this.getSelectSpecification(color);
 },
 //选择规格
 select_specification:function(e){
   var current = e.currentTarget.dataset;
   var id = current.id;
   var indexs = current.indexs; 
   var specificationData = [];  //规格样式
   for (var i = 0; i < this.data.specification.length; i++) {
     if (i == indexs) {
       specificationData.push('active');
     } else {
       specificationData.push('');
     }
   }
   this.setData({
     specificationData: specificationData
   })
   this.getSelectInfo(id);  //产品信息
 },
 //显示隐藏二维码
 hiddenShowErWeiMa:function(e){
   var type = e.currentTarget.dataset.type;
   if (type =='open'){
      this.setData({
        qrShowHidden:false
      })
   } else if (type == 'close'){
     this.setData({
       qrShowHidden: true
     })
   }
    console.log(e);

 },
 //下载二维码
 loadErWeiMa:function(){
   var thisPage = this;

   wx.getImageInfo({   //获取图片信息
     src: thisPage.data.codeImage,
     success: function (res1) {
       if (wx.saveImageToPhotosAlbum) {    //保存图片到系统相册
         wx.saveImageToPhotosAlbum({
           filePath: res1.path,
           success: function (res2) {
             app.showSuccessMessage("图片保存成功");
           },
           fail: function (res2) {
             if (res2.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
               wx.openSetting({
                 success(settingdata) {
                   console.log(settingdata)
                   if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                     app.showWarnMessage("请再次点击下载！");
                   } else {
                     console.log("获取权限失败")
                   }
                 }
               })
             }
           }
         })
       } else {
         wx.showModal({
           title: '提示',
           content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
         })
       }
     },
     fail: function (res) {
       wx.showModal({
         title: '提示',
         content: JSON.stringify(res)
       })
      
     }
   })
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
           src: resData.result.productsharing_url.replace('http', 'https'),
           success: function (ress) {
             thisPage.setData({
               productsharing_url: ress.path,
               makeCard: false
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
  onPullDownRefresh: function () {
    this.getProductDeTetail();  //获取产品信息
    this.getErWeiMaCode();  //获取二维码
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
  //生成分享卡片
  makeCard: function (e) {
    var thisPage = this;
    thisPage.setData({
      gift: false
    })
    if (thisPage.data.erweima && thisPage.data.productsharing_url) {
      thisPage.setData({
        gift: true
      })
      var parms = 'urlImage=' + thisPage.data.productsharing_url + '&erweima=' + thisPage.data.erweima;
      app.skipUpTo('/pages/work/product_center/share_product_img/share_product_img?' + parms, 1);
    }else{
      thisPage.getErWeiMaCode();  //获取二维码
      thisPage.getTemplate(); //生成模板
      app.showWarnMessage('生成出错,请点击重试！');
    }
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
  //转发
  onShareAppMessage: function (res) {
    var thisPage = this;
    return {
      title: thisPage.data.shareName ? thisPage.data.shareName : thisPage.data.product_title,
      path: '/pages/share/share?P1=C&P2=' + thisPage.data.productId + '&P3=' + app.globalData.user_Info.user_id + '&appId=' + app.globalData.user_Info.app_id,
      success: function (res) {
        app.addPageSharePoint(thisPage.data.productData.info.product_title);
        // 转发成功
      },
      fail: function (res) {

        // 转发失败
      }
    }
  },
})