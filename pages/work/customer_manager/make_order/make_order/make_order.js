// pages/work/customer_manager/make_order/make_order/make_order.js
const app = getApp()
var urlPage = app.globalData.domainName;        //请求域名
var util = require('../../../../../utils/util.js');
Page({

  data: {
    shopId:null,  //店铺id
    activityId:null,  //活动di
    customerId:null,  //客户id
    sellerId:null,  //销售id
    ActivityOrderInfo:[],  //活动的信息
    _name:null,   //收件人姓名
    _phone:null,  //收件人电电话
    _address:null,  //收货地址
    region_code:null,  //省市区
    location: '请选择',  //所在地区
    addressPicker_hidden: true,  //选择地址面板
    provinceArr: null,    //省级
    cityArr: null,       //市级
    areaArr: null,       //区级
    addressArr: [0, 0, 0],  //地址下标信息
    province: null,    //省
    city: null,       //市
    area: null,       //区
    region_codeTrue:true,  //是否需要进行
    totalPriceInfo: [{ productModel: '', modelType: 2, price: '', num: '', totalPrice:0,id:''}],  //存储价格和数量
    totalPrice:0.00,   //总价格
    showPrice: 0.00,  //展示金额(订单总额)
    prepayPrice:null,  //预付定金

    productPrice: null,  //产品价格
    productId: null, //产品id
    textareHidea:false,  //textarea 弹框的显示与隐藏

    index: 0,
    paymentMoney:['银行卡','微信','支付宝','现金'],  //付款方式
    payWay:'银行卡',   ///付款方式
    showHidePop:true,  //显示与隐藏选择优惠
    showHideActivity:true,  //活动订单的时候显示(名字、联系方式)
    showHideActivity2:true,   //显示砸蛋、抽奖
    orderType: null,   //活动的类型    1活动订单 2销售订单 3在线订单

    realityPeice:0.00, //实收金额

    saleValues: 0.00, //优惠的价格
    showValues: 0.00, //优惠的价格-展示
    lottery:false,  //可抽奖
    egg:false,   //可砸金蛋
    gift:false,  //满赠礼物
    gifts:true,  //奖品内容（砸完金蛋以后显示）

    lotteryNum:null,  //可抽奖值
    lotteryNumData:[] ,  //抽奖的次数
    eggNum: null,   //可砸金蛋值
    giftNum: null, //满赠礼物值
    gifNumsData:[], //满赠礼品的数值
    giftsNum: false,  //奖品内容（砸完金蛋以后显示）

    selectTitle:null, //选择优惠的标题
    selectType:null,  //选择的类型
    selectData:{
     1: {'title': '选择红包', 'key':'hb'},
     2: {'title': '选择优惠券', 'key': 'yhq' },
     3: {'title': '选择折扣券', 'key': 'zkq' },
    },  //选择的优惠券的数据
    selectToData: {
      1: null,
      2: null,
      3: null
    },  //选择数据

    remarkText:null,  //备注的内容
    orderId:null, //订单的id
    editType: null,  //订单的类型（编辑、新增、查看）
    isCanedit:false,  //是否可以编辑（显示与隐藏）
    isCanedit2: true,  //是否可以编辑
    selectAddress:{}, //存储地址名字
    selectAddressData: [],  //存储地址名字2
    pageFrom:null,  //订单从哪里进来（活动详情、订单列表）
    isSurAddress:false ,//保存地址
    typistName:null,  //打单员名字
    typistPhone:null,   //打单员电话
    typistId:null
  },

  /**options
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    var orderType = null;
    var values = null;
    var pageTitles = "";
    console.log(JSON.stringify(options)+'打印数据');
     this.getProvinceData();    //获取省级数据
    var totalPrice = wx.getStorageSync('totalPrice');  //总价格
    var region_codeTrue = true;  //是否进行地点赋值
    if (options.pageType){  //pageType 为1 说明不是首次进入
    //关于产品和优惠
      var totalPriceInfo = wx.getStorageSync('totalPriceInfo');  //所有产品的数据
      console.log('!!!!!!' + JSON.stringify(options.model));
      options.activityId = wx.getStorageSync('activityId');  //从本地缓存中读取
      options.customerId = wx.getStorageSync('customerId');  //从本地缓存中读取
      
      options.orderId = wx.getStorageSync('orderId'); //存储在本地( 销售订单、活动订单)
      options.editType = wx.getStorageSync('editType'); //订单的类型（编辑、新增、查看）
      options.pageFrom = wx.getStorageSync('pageFrom');  //订单是从哪里进来的（活动详情activity 、订单列表list）

      var orderType  = wx.getStorageSync('orderType');  //从本地缓存中读取
      var currentVlue = wx.getStorageSync('currentVlue');  //当前编辑的下标
      var allPrices = 0 ;  //计算总的价格
      if (currentVlue>=0){
        var obj = {};
        obj.productModel  = options.model; //模型
        obj.modelType = options.modelType; //类型（1 是列表 2是新增）
        obj.price = options.price;//产品价格 
        obj.id = options.productId;//产品价id 
        obj.num = '';//产品数量
        obj.totalPrice = 0;//总价格
        totalPriceInfo[currentVlue] = obj;
      }
      //判断存储的价格和现实价格是否一样
      for (var m = 0; m < totalPriceInfo.length;m++){
        allPrices = allPrices + parseInt(totalPriceInfo[m].totalPrice);
      }
      if (totalPrice !== allPrices){  // 如果不相等则优惠取消
        thisPage.setData({
          selectToData: {
            1: null,
            2: null,
            3: null
          }
        });
        thisPage.selectToValue2('', 0, 1);   //对应的红包优惠券的改变
        totalPrice = allPrices;
      }       
      //关于预付定金和实收金额
      var realityPeice=  wx.getStorageSync('realityPeice');   //实收金额
      var prepayPrice = wx.getStorageSync('prepayPrice');  //预付定金
      var indexPay = wx.getStorageSync('payWay');  //预付定金
      if (indexPay){
        if (indexPay >= 0) {
          var payWay = thisPage.data.paymentMoney[indexPay]  //预付定金
        }
      }else{
        indexPay = thisPage.data.index;
        var payWay = thisPage.data.payWay;
      }
     
    //关于地址
      var selectAddress = wx.getStorageSync('choose');  //选择的地址
      if (selectAddress){
        thisPage.data.selectAddress = selectAddress;
        region_codeTrue = false;
       var region_code = selectAddress.region_code;
       if (region_code){
         var region_code2 = region_code.split(',');
         var province = { 'code': region_code2[0], 'name': selectAddress.province };
         thisPage.data.province = province;
         thisPage.getCityData(region_code2[0], region_code2[1], region_code2[2]);  //省市区
       }
      
      
       var _address = selectAddress.address_details ; //地址
       var _name = selectAddress.receiver_name ; //收件人姓名
       var _phone = selectAddress.phone_num ;  //联系电话
      thisPage.setData({
        isSurAddress:false
      })
      }
     //备注
      var remarkText = wx.getStorageSync('remarkText');  //备注

    }else{
      wx.clearStorageSync();  //清除本地缓存
      var totalPriceInfo = thisPage.data.totalPriceInfo;
      totalPrice = thisPage.data.totalPrice;
      wx.setStorageSync('activityId', options.activityId);  //存储在本地
      wx.setStorageSync('customerId', options.customerId);  //存储在本地
      wx.setStorageSync('orderType', options.orderType);  //存储在本地( 销售订单2、活动订单1)
      wx.setStorageSync('editType', options.editType);  //订单的类型（编辑、新增、查看）
      wx.setStorageSync('pageFrom', options.pageFrom);  //订单是从哪里进来的（活动详情activity 、订单列表list）
      if (options.orderId){
        wx.setStorageSync('orderId', options.orderId);  //订单id
      }
      
      orderType = options.orderType; 
    }

    if (orderType ==2){  //销售订单
      values = true;
      pageTitles = "销售订单";
    } else if (orderType == 1){   //活动订单
      values = false;
      pageTitles = "活动订单";
    } else if (orderType == 3){
      values = true;
    }
    wx.setNavigationBarTitle({
      title: pageTitles//页面标题为路由参数
    })
    console.log('所有的产品数据！！！！' + JSON.stringify(totalPriceInfo));
    this.setData({
      activityId: options.activityId,
      customerId: options.customerId,
      showHideActivity: values, 
      orderType: orderType,  //订单的类型（销售订单、活动订单）
      totalPriceInfo: totalPriceInfo,   //产品数据
      totalPrice:totalPrice,  //订单总额
      showPrice: totalPrice,  //显示的金额
      _address: _address ? _address:'',  //地址
      _name: _name ? _name:'',  //姓名
      _phone: _phone ? _phone:'', //电话
      realityPeice: realityPeice ? realityPeice:'',//实付金额
      prepayPrice: prepayPrice?prepayPrice:'', //预付定金
      payWay: payWay ? payWay:'银行卡', //付款方式
      index: indexPay ? indexPay:0,  //第几个付款方式
      remarkText: remarkText ? remarkText:'暂无', //备注
      orderId: options.orderId ? options.orderId:'',  //订单id
      editType: options.editType,  // 订单的类型（编辑edit、新增add、查看look）
      region_codeTrue: region_codeTrue,
      pageFrom: options.pageFrom,  //订单是从哪里进来的（活动详情activity 、订单列表list），
      typistName: thisPage.data.typistName,  //打单员名字
      typistPhone: thisPage.data.typistPhone,  //打单员电话
      typistId: thisPage.data.typistId,
      //showHideActivity: showHideActivity  //活动订单显示隐藏
    })
    if (options.editType == 'add') {   //订单的类型（编辑edit、新增add、查看look）
      this.getActivityOrderInfo(); //获取订单信息
    } else {
      this.getPageData();  //获取订单详情
    }
    if (realityPeice) {  //实际收金额
      setTimeout(function(){
        thisPage.realityTotal(realityPeice)
      },500)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

//回显活动订单信息
getActivityOrderInfo:function(){
  var thisPage = this;
  wx.request({
    url: urlPage + '/app/createOrder',
    data: {           //请求参数      
      activityId: thisPage.data.activityId,  //活动id
      filialeId: app.globalData.user_Info.filialeId ,  //分公司id app.globalData.user_Info.filialeId 
      customerId: thisPage.data.customerId  //客户di
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      console.log('打单createOrder');
      var resData = res.data;
      if (resData.code == 0) {
        var obj = {};
        var resDataObj = resData.result;  
        var _name = resDataObj.consignee;  //姓名
        var _phone = resDataObj.consigneePhone;  //电话
        var _address = resDataObj.address;  //地址

        if (thisPage.data._name){
          _name = thisPage.data._name;
        }
        if (thisPage.data._phone){
          _phone = thisPage.data._phone;
        }
        if (thisPage.data._address){
          _address = thisPage.data._address;
        }

        if (thisPage.data.region_codeTrue && resDataObj.provinceCode){
          var province = { 'code': resDataObj.provinceCode, 'name': resDataObj.province };
          thisPage.data.province = province;
          thisPage.getCityData(resDataObj.provinceCode, resDataObj.cityCode, resDataObj.districtCode);  //省市区
        }

       
        thisPage.setData({
          ActivityOrderInfo: resDataObj,
          typistName: app.globalData.user_Info.userInfo.name,  //打单员名字
          typistPhone: app.globalData.user_Info.userInfo.phone,  //打单员电话
          typistId: app.globalData.user_Info.user_id,
          sellerId: resDataObj.sellerId,  //销售id
          shopId: resDataObj.shopId ? resDataObj.shopId : app.globalData.user_Info.shop_id,   //店铺id
          _name: _name ? _name:'' ,   //收件人姓名
          _phone: _phone ? _phone:'' ,  //收件人电电话
          _address: _address ? _address:'',  //收货地址
        })
        
        var cansOne1 = wx.getStorageSync('cansOne1');  //满减红包的使用
        var cansOne2 = wx.getStorageSync('cansOne2');  //优惠券的使用
        var cansOne3 = wx.getStorageSync('cansOne3');  //折扣券的使用
        if (cansOne1) {
          thisPage.selectToValue2(cansOne1.id, 0, 1);  //选择优惠券(点击具体优惠券-红包)
        }
        if (cansOne2) {
          thisPage.selectToValue2(cansOne2.id, 0, 2);  //选择优惠券(点击具体优惠券-优惠券)
        }
        if (cansOne3) {
          thisPage.selectToValue2(cansOne3.id, 0, 3);  //选择优惠券(点击具体优惠券-折扣券)
        } 
      } else if (resData.code == 1){
       
      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//请求页面详情的数据(编辑和查看)
getPageData:function(e){
  var thisPage = this;
  wx.request({
    url: urlPage + '/app/selectOrderDetail',
    data: {           //请求参数      
      orderId: thisPage.data.orderId
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      var payCode = null;
      var isCanedit = true;
      var isCanedit2 = true;
      if (resData.code == 0) {
        console.log('打单selectOrderDetail');
        var obj = {};
        var resDataObj = resData.result;
        //付款方式
        for (var i = 0; i <thisPage.data.paymentMoney.length; i++) {
          var values = thisPage.data.paymentMoney[i];
          if (values == resDataObj.payStatus) {
            payCode = i;
          }
        }
        
        //产品列表
        if (thisPage.data.totalPriceInfo.length>1){
          resDataObj.productInfoList = thisPage.data.totalPriceInfo;
        }else{
          for (var m = 0; m < resDataObj.productInfoList.length; m++) {
            resDataObj.productInfoList[m].modelType = 1;
          }
        }

        //红包优惠券
        //-红包
        if (resDataObj.hbUse){
          var hbUse = resDataObj.hbUse.split('-')[1];
          isCanedit = false;
          isCanedit2 = false;
        }
        //-优惠券
        if (resDataObj.yhqUse) {
          var yhqUse = resDataObj.yhqUse;
          isCanedit = false;
          isCanedit2 = false;
        }
        //-折扣券
        if (resDataObj.zkqUse) {
          var zkqUse =(resDataObj.zkqUse.split('：')[1]).split('折');
          isCanedit = false;
          isCanedit2 = false;
        }
        var resDataObj = resData.result;
        var _name = resData.result.consignee;  //姓名
        var _phone = resData.result.consigneePhone;  //电话
        var _address = resData.result.consigneeAddress;  //地址

        if (thisPage.data._name) {
          _name = thisPage.data._name;
        }
        if (thisPage.data._phone) {
          _phone = thisPage.data._phone;
        }
        if (thisPage.data._address) {
          _address = thisPage.data._address;
        }
        // //省市区
        // var location = resDataObj.province + '-' + resDataObj.city + '-' + resDataObj.district;
        // var region_code = provinceCode + ',' + cityCode + ',' + districtCode;
        if (thisPage.data.region_codeTrue && resDataObj.provinceCode) {
          var province = { 'code': resDataObj.provinceCode, 'name': resDataObj.province };
          thisPage.data.province = province;
          thisPage.getCityData(resDataObj.provinceCode, resDataObj.cityCode, resDataObj.districtCode);  //省市区
        }


        thisPage.setData({
          ActivityOrderInfo: resDataObj,
          sellerId: resDataObj.sellerId,  //销售id
          shopId: resDataObj.shopId,   //店铺id
          _name: _name,   //收件人姓名
          _phone: _phone,  //收件人电电话
          _address: _address,  //收货地址
          remarkText: resData.result.remarks , //备注
          prepayPrice: resDataObj.depositPrice,  //预付定金
          payWay: resDataObj.payStatus,   //付款方式
          index: payCode,  //付款方式
          realityPeice: resDataObj.realPayPrice,  //实际付款
          totalPrice: resDataObj.orderPrice,   //订单价格
          showPrice:resDataObj.orderPrice,  //订单价格(展示)
          totalPriceInfo: resDataObj.productInfoList,  //产品列表
          isCanedit:isCanedit,  //是否可编辑
          isCanedit2: isCanedit2,//是否可编辑
          selectToData:{
            1: { denomination: hbUse},
            2: { denomination: yhqUse },
            3: { denomination: zkqUse }
          },
          typistId: resDataObj.typistId,
          typistName: resDataObj.typistName,
          typistPhone: resDataObj.typistPhone,
          showValues:resDataObj.youHui // 优惠了
        })
        //实际收款
        if (resDataObj.realPayPrice) {  //实际收金额
          setTimeout(function () {
            thisPage.realityTotal(resDataObj.realPayPrice)
          }, 500)
        }

      } else if (resData.code == 1) {

      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//编辑姓名
  editNmae:function(e){
    var current = e.currentTarget;
    var key = current.dataset.name;  //键
    var value = e.detail.value;  //值
    var thisPage = this;
    var obj = {};
    obj[key] = value;
    thisPage.setData(obj);
   var objects = {};
   if (key =='_name'){
     var keys = 'receiver_name';
   }
   if (key =='_address'){
     var keys = 'address_details';
   }
   if (key == '_phone'){
     var keys = 'phone_num';
   }
   thisPage.data.selectAddress[keys] = value;
   thisPage.setData({
     selectAddressData: thisPage.data.selectAddress,
     isSurAddress:true
   })
   wx.setStorageSync('choose', thisPage.data.selectAddressData);
      
  },
  //编辑价格、数量、产品总额
  eidtPriceNum:function(e){
    var thisPage = this;
    if (thisPage.data.editType !== 'look' && thisPage.data.isCanedit2){
      thisPage.setData({
        selectToData: {
          1: null,
          2: null,
          3: null
        }
      });
      var current = e.currentTarget;
      var types = current.dataset.type;    //类型
      var index = current.dataset.index;  //当前第几个
      var value = e.detail.value;  //值
      thisPage.data.totalPriceInfo[index][types] = value;
      thisPage.data.totalPriceInfo[index].totalPrice = ((thisPage.data.totalPriceInfo[index].price * thisPage.data.totalPriceInfo[index].num).toFixed()).toString();
      //求总价格
      var totalPrice = 0;
      for (var i = 0; i < thisPage.data.totalPriceInfo.length; i++) {
        totalPrice = totalPrice + Number(thisPage.data.totalPriceInfo[i].totalPrice);
      }

      wx.setStorageSync('totalPrice', totalPrice);  //将总价格存储到本地
      thisPage.setData({
        totalPriceInfo: thisPage.data.totalPriceInfo,
        totalPrice: totalPrice.toString(),
        showPrice: totalPrice.toString()
      })
      thisPage.selectToValue2('', 0, 1);   //对应的红包优惠券的改变
    }

  },
  //新增
  addProduct:function(e){
    var thisPage = this;
    if (thisPage.data.editType !== 'look' && thisPage.data.isCanedit2){
      var obj = {};
      obj.productModel = '';
      obj.price = '';
      obj.modelType = 2;
      obj.num = '';
      obj.totalPrice = 0;
      obj.id = '';
      var arr = thisPage.data.totalPriceInfo;
      arr.push(obj);
      thisPage.setData({
        totalPriceInfo: arr
      })
      console.log(thisPage.data.totalPriceInfo);
    }
  },
  //减少
  subtractProduct:function(e){
    var thisPage = this;
    if (thisPage.data.editType !== 'look' && thisPage.data.isCanedit2){
      thisPage.setData({
        selectToData: {
          1: null,
          2: null,
          3: null
        }
      });
      var current = e.currentTarget;
      var totalPrice = 0;
      var thisPage = thisPage;
      var num = current.dataset.index; //获取记录的第几个
      var total = parseInt(thisPage.data.totalPriceInfo[num].totalPrice);
      totalPrice = thisPage.data.totalPrice - total;
      thisPage.data.totalPriceInfo.splice(num, 1); //删除
      var arr = thisPage.data.totalPriceInfo; //获取剩余的数组
      thisPage.selectToValue2('', 0, 1);   //对应的红包优惠券的改变
      thisPage.aboutMoneyReduce();
      thisPage.setData({
        totalPriceInfo: arr,
        totalPrice: totalPrice,
        showPrice: totalPrice
      })
    }
  },
  //关于满减
  aboutMoneyReduce:function(e){
    var thisPage = this;
    var cansOne1 = wx.getStorageSync('cansOne1');  //满减红包的使用
    var cansOne2 = wx.getStorageSync('cansOne2');  //优惠券的使用
    var cansOne3 = wx.getStorageSync('cansOne3');  //折扣券
    thisPage.selectToValue2('', 1, 1);   //对应的红包优惠券的改变
    if (cansOne1) {
      wx.removeStorageSync('cansOne1');
    }
    if (cansOne2) {
      wx.removeStorageSync('cansOne2');
    }
    if (cansOne3) {
      wx.removeStorageSync('cansOne3');
    }
  },
  //付款的形式
  bindChange1:function(e){
    console.log(e.detail.value);
    this.setData({
      payWay: this.data.paymentMoney[e.detail.value],
      index: e.detail.value
    })
    wx.setStorageSync('payWay', e.detail.value);  //存储在本地
  },
  //预付款
  prepayValue:function(e){
    var value = e.detail.value;
    this.setData({
      prepayPrice: value
    })
    wx.setStorageSync('prepayPrice', value);  //存储在本地
  },
  //本次实收金额
  realityTotal:function(e){
    var thisPage = this;
    var objects = typeof (e);
    if (objects=='object'){
      var prices = e.detail.value;
    }else{
      var prices = e;
    }
    var showHideActivity2=true;

    var lottery = true;  //可抽奖
    var egg = true;  //可砸金蛋
    var gift = true;   //满赠礼物

    var lotteryNumData = [];  //可抽奖值
    var lotteryNum = null;  //可抽奖值
    var eggNum = null;   //可砸金蛋值
    var giftNum = null ; //满赠礼物值
    var gifNumsData = [] ; //满赠礼物的数值

    var giftData = [];  //礼物
    var OrderInfo = thisPage.data.ActivityOrderInfo;

    if (prices){
      if (OrderInfo.activityNumRule && OrderInfo.activityNumRule.length > 0) {
        for (var i = 0; i < OrderInfo.activityNumRule.length; i++) {
          var value = OrderInfo.activityNumRule[i];
          if (value.itemId == 4) {   //金蛋
            if (prices >= parseInt(value.useMoney)) {
              eggNum = Math.floor(prices / parseInt(value.useMoney));
              value.num = eggNum;
              lotteryNumData.push(value);
              egg = false;
            } else {
              eggNum = 0;
            }
          } else if (value.itemId == 5) {  //抽奖
            if (prices >= parseInt(value.useMoney)) {
              lotteryNum = Math.floor(prices / parseInt(value.useMoney));
              value.num = lotteryNum;
               lotteryNumData.push(value);
              lottery = false;
            } else {
              lotteryNum = 0;
            }
          }
        }
        showHideActivity2 = false;
      }
      if (OrderInfo.activityPresentRule && OrderInfo.activityPresentRule.length > 0) {
       
        for (var order = 0; order < OrderInfo.activityPresentRule.length; order++) {
          var orderPrice = OrderInfo.activityPresentRule[order];
          if (prices >= orderPrice.useMoney) {
            gift = false;  //让礼品显示
            giftData.push(orderPrice.giftName);
            var objs = {};
            objs.activityId = OrderInfo.activityId;
            objs.giftId = orderPrice.gift;
            objs.gift = orderPrice.giftName; 
            gifNumsData.push(objs);

          }
        }
       
        showHideActivity2 = false;
      } else {
        giftData = ['暂无'];
      }
      giftNum = giftData.join('/');
    }

    thisPage.setData({
      realityPeice: prices,  //实收金额
      showHideActivity2: showHideActivity2,  //显示整个
      lottery: lottery,
      egg: egg ,  //可砸金蛋
      gift: gift, //满赠礼物
      lotteryNum: lotteryNum, //可抽奖值
      eggNum: eggNum ,   //可砸金蛋值
      giftNum: giftNum,  //满赠礼物值
      gifNumsData: gifNumsData,  //满赠礼物的数值
      lotteryNumData: lotteryNumData
    })
    wx.setStorageSync('realityPeice', prices);  //存储在本地
  },
  //选择优惠券（弹框）
  selectToTicket:function(e){
    var current = e.currentTarget;
    var selectType = current.dataset.type; 
    this.setData({
      selectType: selectType,
      showHidePop: false,
      textareHidea:true
    })
  },
//取消弹框
  cancelPop:function(e){
    this.setData({
      showHidePop:true,
      textareHidea: false
    })
  },
 //选择优惠券(点击具体优惠券-调用)
selectToValue: function (e) {
  var thisPage = this;
  var current = e.currentTarget;
  var selectId = current.dataset.id;
  var opaction = current.dataset.opaction;
  var selectType = thisPage.data.selectType;  //类型

  thisPage.selectToValue2(selectId, opaction, selectType);  //选择优惠券(点击具体优惠券-执行)

},
  //选择优惠券(点击具体优惠券)
  selectToValue2: function (selectId, opaction, selectType){
  var thisPage = this;
  var totalPrice = Number(thisPage.data.totalPrice);
  var selectToData = thisPage.data.selectToData;  
  var ActivityOrderInfo = thisPage.data.ActivityOrderInfo; //总数据
  var saleValues = thisPage.data.saleValues;//优惠的价格
//数据
  var dataSlect_1 = ActivityOrderInfo.hb ?ActivityOrderInfo.hb:[] ;  //红包
  var dataSlect_2 = ActivityOrderInfo.yhq ? ActivityOrderInfo.yhq : [];  //优惠券
  var dataSlect_3 = ActivityOrderInfo.zkq ? ActivityOrderInfo.zkq : [];  //折扣券

  for (var select = 0; select < dataSlect_1.length;select++){
    var cansOne = dataSlect_1[select];
    if (selectType==1){
      if (cansOne.id == selectId){
        if (opaction=='1'){  //选中要变成未选中
          cansOne.choose = false;
          selectToData[1] =null;
          wx.removeStorageSync('cansOne1');
        }else if (opaction == '0'){  //未选中变为选中
          if (cansOne.denomination <= totalPrice){
            cansOne.choose = true;
            selectToData[1] = cansOne;
            totalPrice -= cansOne.denomination;
            wx.setStorageSync('cansOne1', cansOne);
            }else{
            app.showWarnMessage('不符使用条件！');
            return;
            }
        }
        }else{
        cansOne.choose = false;
        }
      }else{
      if (cansOne.choose){
        totalPrice -= cansOne.denomination;
        }
      }
  }
  for (var select = 0; select < dataSlect_2.length; select++) {
    var cansOne2 = dataSlect_2[select];
    if (selectType == 1){
      cansOne2.choose =false;
      selectToData[2] = null;
    } else if (selectType == 2){
      if (cansOne2.id == selectId){
        if (opaction == '1') { //选中要变成未选中
          cansOne2.choose = false;
          selectToData[2] = null;
          wx.removeStorageSync('cansOne2');
        } else if (opaction == '0') { //未选中变为选中
          if (cansOne2.use_condition <= totalPrice){
            cansOne2.choose = true;
            selectToData[2] = cansOne2;
            totalPrice -= cansOne2.denomination;
            wx.setStorageSync('cansOne2', cansOne2);
          }else{
            app.showWarnMessage('不符使用条件！');
            return;
          }
 
        }
      }else{
        cansOne2.choose = false;
      }
    }else{
      if (selectType == 3){
        if (cansOne2.choose){
          totalPrice -= cansOne2.denomination;
        }
      }
    }
  }

  for (var select = 0; select < dataSlect_3.length; select++) {
    var cansOne3 = dataSlect_3[select];
    if (selectType == 1 || selectType == 2){
      cansOne3.choose = false;
      selectToData[3] = null;
    } else if (selectType == 3){
      if (cansOne3.id == selectId) {
        if (opaction == '1') { //选中要变成未选中
          cansOne3.choose = false;
          selectToData[3] = null;
          wx.removeStorageSync('cansOne3');
        } else if (opaction == '0') { //未选中变为选中
          if (cansOne3.use_condition <= totalPrice) {
            cansOne3.choose = true;
            selectToData[3] = cansOne3;
            totalPrice *= (cansOne3.denomination / 10);
            wx.setStorageSync('cansOne3', cansOne3);
          } else {
            app.showWarnMessage('不符使用条件！');
            return;
          }

        }
      } else {
        cansOne3.choose = false;
      }
    }
  }
  thisPage.setData({
    showPrice: totalPrice.toFixed(2),
    selectToData: selectToData,
    ActivityOrderInfo: ActivityOrderInfo,
    showValues: (Number(this.data.totalPrice) - totalPrice).toFixed(2)
  })
},
  //点击跳转
  skipUpTo: function (e) {
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    var currentVlue = skipUpContent.index;  //类型
    var totalPriceInfo = this.data.totalPriceInfo;
    wx.setStorageSync('currentVlue', currentVlue);  
    wx.setStorageSync('totalPriceInfo', totalPriceInfo); 
    app.skipUpTo(skipUrl, skipType);
  },
  //选择地址
  skinToOther:function(e){
    var skipUpContent = e.currentTarget.dataset;
    var skipUrls = skipUpContent.url + this.data.customerId;   //路径
    var skipTypes = skipUpContent.type;  //类型
    wx.removeStorageSync('currentVlue');

    wx.setStorageSync('totalPriceInfo', this.data.totalPriceInfo); 
    app.skipUpTo(skipUrls, skipTypes);
  },
  //选择地址（省市区）
  bindRegionChange:function(e){
    console.log(e);
  },
//写备注
  writeText:function(e){
    var value = e.detail.value;
    this.setData({
      remarkText: value
    })
    wx.setStorageSync('remarkText', value); 
  },
  //选择地区
  chooseAddress: function (e) {
    this.setData({
      addressPicker_hidden: false,
      textareHidea: true
    })
  },
  //【地区选择器】---取消
  pickerViewCancel: function (e) {
    this.setData({
      addressPicker_hidden: true,
      textareHidea: false
    })
  },
  //【地区选择器】---确定
  pickerViewSubmit: function (e) {
    var thisPage = this;
    var isSurAddress = false;
    var location = thisPage.data.province.name + '-' + thisPage.data.city.name + '-' + thisPage.data.area.name;
    var region_code = thisPage.data.province.code + ',' + thisPage.data.city.code + ',' + thisPage.data.area.code;
    if (region_code !== thisPage.data.selectAddress.region_code && thisPage.data.selectAddress.region_code){
      isSurAddress = true;
    }
    thisPage.data.selectAddress.region_code = region_code;
    thisPage.data.selectAddress.province = thisPage.data.province.name;
    thisPage.data.selectAddress.city = thisPage.data.city.name;
    thisPage.data.selectAddress.area = thisPage.data.area.name;
    thisPage.setData({
      addressPicker_hidden: true,
      location: location,
      region_code: region_code,
      selectAddressData: thisPage.data.selectAddress,
      isSurAddress: isSurAddress,
      textareHidea: false
    })
    wx.setStorageSync('choose', thisPage.data.selectAddressData);
  },
  //地址改变
  addressChange: function (e) {
    var valueArr = e.detail.value;

    var provinceCode = this.data.provinceArr[valueArr[0]].code;
    if (provinceCode != this.data.province.code) {
      this.setData({
        province: this.data.provinceArr[valueArr[0]],
        addressArr: [valueArr[0], 0, 0]
      })
      this.getCityData(provinceCode);   //获取市级数据
      return;
    }

    var cityCode = this.data.cityArr[valueArr[1]].code;
    if (cityCode != this.data.city.code) {
      this.setData({
        city: this.data.cityArr[valueArr[1]],
        addressArr: [valueArr[0], valueArr[1], 0]
      })
      this.getAreaData(cityCode);   //获取区级数据
      return;
    }

    var areaCode = this.data.areaArr[valueArr[2]].code;
    if (areaCode != this.data.area.code) {
      this.setData({
        area: this.data.areaArr[valueArr[2]]
      })
    }
  },
  //获取省级数据
  getProvinceData: function () {
    var thisPage = this;

    wx.request({
      url: urlPage + '/app/getprovince',  //接口地址
      data: {},   //请求参数
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;

        if (returnData.code == 0) { //成功
          thisPage.setData({
            provinceArr: returnData.result,
            province: returnData.result[0]    //省
          })
        }

        var provinceCode = returnData.result[0].code;
        thisPage.getCityData(provinceCode);   //获取市级数据
      },
      fail: function (res) {     //失败
        console.log('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成
        console.log('请求完成：', res.errMsg);
      }
    })
  },
  //获取市级数据
  getCityData: function (code1, code2, code3) {
    var thisPage = this;

    wx.request({
      url: urlPage + '/app/getcity',  //接口地址
      data: {   //请求参数
        code: code1
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;

        if (returnData.code == 0) { //成功
          if (code2) {
            var index = util.getIndexFromArray(returnData.result, "code", code2);
            thisPage.setData({
              cityArr: returnData.result,
              city: returnData.result[index],       //市
              "addressArr[1]": index
            })
            thisPage.getAreaData(code2, code3);   //获取区级数据
          } else {
            thisPage.setData({
              cityArr: returnData.result,
              city: returnData.result[0],       //市
            })
            var cityCode = returnData.result[0].code;
            thisPage.getAreaData(cityCode);   //获取区级数据
          }
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
  //获取区级数据
  getAreaData: function (code2, code3) {
    var thisPage = this;

    wx.request({
      url: urlPage + '/app/getcountry',  //接口地址
      data: {   //请求参数
        code: code2
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功
        var returnData = res.data;

        if (returnData.code == 0) { //成功
          if (code3) {
            var index = util.getIndexFromArray(returnData.result, "code", code3);
            thisPage.setData({
              areaArr: returnData.result,
              area: returnData.result[index],      //区
              "addressArr[2]": index
            })
            thisPage.pickerViewSubmit();
          } else {
            thisPage.setData({
              areaArr: returnData.result,
              area: returnData.result[0]      //区
            })
          }
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

//提交订单
submitData:function(e){
  var thisPage = this;
  var totalPriceInfo = thisPage.data.totalPriceInfo;
  var temporaryArr = [];  //临时放产品的数组

  //地址和预付定金的判断
  if (!thisPage.data.region_code || !thisPage.data._address){
    app.showWarnMessage('请将地址填写完整');
    return;
  }
  if (!thisPage.data.prepayPrice){
    app.showWarnMessage('请填写预付定金');
    return;
  }

  //产品信息的判断
  if (totalPriceInfo.length>0){
    for (var i = 0; i < totalPriceInfo.length; i++) {
      var caseOne = totalPriceInfo[i];
      var objs = {};
      if (caseOne.productModel && caseOne.num && caseOne.price) {
        objs.productModel = caseOne.productModel;
        objs.num = caseOne.num;
        objs.price = caseOne.price;
        objs.totalPrice = caseOne.totalPrice;
        temporaryArr.push(objs);
      }
    }
    if (totalPriceInfo.length !== temporaryArr.length) {
      if (temporaryArr.length > 0){
        wx.showModal({
          title: '提示',
          content: '产品信息尚未完善，是否确认提交？',
          success: function (res) {
            if (res.confirm) {
              totalPriceInfo = temporaryArr;
              thisPage.submitsData2(totalPriceInfo);

            } else if (res.cancel) {
              console.log('用户点击取消');
              return;
            }
          }
        })
      }else{
        app.showWarnMessage('请填写产品！');
        return;
      }

    } else {
      totalPriceInfo = temporaryArr;
      thisPage.submitsData2(totalPriceInfo);
    }
  }else{
    app.showWarnMessage('请填写产品！');
    return;
  }



},
//提交数据
  submitsData2: function (totalPriceInfo){
    var thisPage =  this;
    //红包优惠券
    var productIds = [];  //优惠券的选择的数组
    var saleLength = Object.keys(thisPage.data.selectToData).length+1;
    for (var j = 1; j < saleLength; j++) {
      if (thisPage.data.selectToData[j]) {
        var id = thisPage.data.selectToData[j].id;
        productIds.push(id);
      }
    }
    var urls= "";
    var dataList = { 
      shopId: thisPage.data.shopId,  //店铺id
      sellerId: thisPage.data.sellerId,  //销售id
      orderType: thisPage.data.orderType,  //活动类型   （1、活动订单、2 是销售订单）
      customerId: thisPage.data.customerId, //客户id
      consignee: thisPage.data._name,  //收件人
      consigneePhone: thisPage.data._phone,  //收件人电话
      consigneeAddress: thisPage.data._address,//收件人详细地址
      ids: productIds, //红包、优惠券的组合
      realPayPrice: thisPage.data.realityPeice,//实收金额
      thisTimePrice: thisPage.data.realityPeice,
      remarks: thisPage.data.remarkText,  //备注
      depositPrice: thisPage.data.prepayPrice,//定金
      payStatus: thisPage.data.payWay,  //支付方式
      provinceCode: thisPage.data.province.code, //省编码
      cityCode: thisPage.data.city.code,  //市编码
      districtCode: thisPage.data.area.code, //区编码
      activityId: thisPage.data.activityId, //活动id
      typistName: thisPage.data.typistName,  //打单员名字
      typistPhone: thisPage.data.typistPhone,  //打单员电话
      typistId: thisPage.data.typistId,
      orderGiving: thisPage.data.gifNumsData, //订单礼品数组
      num: thisPage.data.lotteryNumData,//抽奖次数
      orderPrice: thisPage.data.showPrice, //订单金额
      productInfoList: totalPriceInfo, //产品数组
      commissionStatus: app.globalData.is_horizontal_alliances ? 1 : 2,
      node3: app.globalData.user_Info.factoryId
    };
    if (thisPage.data.editType == 'add') {
      urls = '/app/addOrder';
    } else {
      urls = '/app/updateOrder';
      dataList.orderId = thisPage.data.orderId;  //订单id 
    }
  wx.request({
    url: urlPage + urls ,
    data: dataList,         //请求参数,
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      if (resData.code == 0) {
        //保存地址
        if (thisPage.data.isSurAddress){
          thisPage.saveAddress();
        }
        var obj = {};
        var resDataObj = resData.result;
        if (thisPage.data.pageFrom =='list'){  //订单是从哪里进来的（活动详情activity 、订单列表list）
          var skipUrl = "/pages/work/customer_manager/activity_detail/activity_detail?customerId=" + thisPage.data.customerId + '&activityId=' +thisPage.data.activityId;
        } else if (thisPage.data.pageFrom == 'activity'){
          var skipUrl = "/pages/work/customer_manager/customer_detail/customer_detail?detail=" + thisPage.data.customerId;
        } else if (thisPage.data.pageFrom == 'scanCode'){
          var skipUrl = "/pages/activity_process/activity_process" + '?activityId=' + thisPage.data.activityId + '&customerId=' + thisPage.data.customerId;
        }else{
          var skipUrl = "/pages/work/order_manager/order_manager";
        }

        app.skipUpTo(skipUrl, 2);
      } else if (resData.code == 1) {

      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//保存地址
saveAddress:function(e){
  var thisPage = this;
  var codeStr = (thisPage.data.province.code + ',' + thisPage.data.city.code + "," + thisPage.data.area.code).toString() ;
  wx.request({
    url: urlPage +'/app/addCustomerAddress',
    data:{
      customer_id: thisPage.data.customerId,
      receiver_name: thisPage.data._name,
      phone_num: thisPage.data._phone,
      region_code: codeStr,
      address_details:thisPage.data._address

    },         //请求参数,
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      if (resData.code == 0) {
        console.log('保存成功！');
      } else if (resData.code == 1) {

      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })

}
})