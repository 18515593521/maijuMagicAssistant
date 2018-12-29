// pages/work/customer_manager/user_file/user_file.js
const app = getApp()
var url = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  selectSearchText:'',
  fromType:null,//1是客户档案 2是异业联盟
  data: {
    page: 1,//当前页
    pageSize:15, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页

    customerInfo:null, //顾客档案信息
    customerShow:true, //导购
    adminShow:true,  //后台
    codeImageHidden: true,
    product_title:null,  //搜索信息
    property: 0,   //来源 (全部渠道'0,'公司分配1','邀请注册2')
    state:'',    //选择哪个状态
    propertyData:['全部渠道','公司分配','导购邀请','客户邀请'],  //来源
    titleList: ['', '新客户', ''],
    activeList:['active','','',''],  //顶部按钮显示 
    itenList:['', 'true', 'true', 'true'],//底部按钮显示
    all_select :['全部'],
    gender: [ '男', '女'], //性别1.男 2.女
    into_Shop_Number: [ '首次进店', '第二次进店', '第三次进店', '多次进店', '成交'],// 进店次数
    customer_Type: [ '60-70%需求分析与产品确认', '70-80%上门测量与提交方案', '80-90%多次进店与邀约谈判', '90-100%价格谈判与逼单成交'],  //客户类型
    house_Space: [ '90方以下', '90-110方', '110-130方', '130-150方', '150-180方', '180方以上'],//房子面积
    furnish_Style: [ '现代简约', '北欧时尚', '美式田园', '意式轻奢', '中式古典', '欧式简欧', '其他'],  //装修风格
    furnish_Progress: [ '未装修', '已装修', '水电', '泥工', '木工', '油漆', '其他'],// 装修进度
    add_Weixin: [ '已加并通过', '已加未通过', '未加'],// 是否添加客户微信
    appointment: [ '已预约', '未预约', '其他'],// 是否预约上门测量
    send_Message: [ '已发', '未发'],//是否发送离店信息
  
    selectList: [  //,'性别','客户类型','进店次数', 
      { 'name': '全部分类', 'value': 'all_select', 'imgUrl': '/pages/images/work/customer_info/quanbu.png' },
      { 'name': '性别', 'value': 'gender', 'imgUrl': '/pages/images/work/customer_info/sex.png'},
      { 'name': '客户类型', 'value': 'customer_Type', 'imgUrl': '/pages/images/work/customer_info/type.png'},
      { 'name': '进店次数', 'value': 'into_Shop_Number', 'imgUrl': '/pages/images/work/customer_info/num.png'},
      { 'name': '房子面积', 'value': 'house_Space', 'imgUrl': '/pages/images/work/customer_info/area.png'},
      { 'name': '装修风格', 'value': 'furnish_Style', 'imgUrl': '/pages/images/work/customer_info/style.png'},
      { 'name': '装修进度', 'value': 'furnish_Progress', 'imgUrl': '/pages/images/work/customer_info/progress.png'},
      { 'name': '是否添加客户微信', 'value': 'add_Weixin', 'imgUrl': '/pages/images/work/customer_info/weixin.png'},
      { 'name': '是否已预约上门测量', 'value': 'appointment', 'imgUrl': '/pages/images/work/customer_info/measure.png'},
      { 'name': '是否发送离店短信', 'value': 'send_Message', 'imgUrl': '/pages/images/work/customer_info/message.png'},
      ],

    classifyName:null,  //分类的 标签客户
    classifyValue:null,  //分类的值
    selectArr:[],  //分类选中的值
    selectArr2: [],  //储存选中的值得临时容器

    selectData:null,  //被筛选数据展示
    selectHide:true,   //筛选条件的显示与隐藏

    showMes:true,     //标签客户单独切换显隐
    nums:null, //筛选的数字 
    numss:2,  //选择的是标签用户1 还是非标签用户2
    selectName:'',//筛选的键
    active:['',''], //筛选的显示与隐藏
    active2: ['','']//筛选的显示与隐藏

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage =this;
    thisPage.setData({
      fromType: options.types
    })
    thisPage.getData();
   
  },
  //获取数据
  getData:function(e){
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      this.applyList(1);   //请求数据（导购）
      this.setData({
        customerShow: false
      })
    } else {
      this.adminList(1);  //请求数据（后台）
      this.setData({
        adminShow: false
      })
    }
  },

  //渲染列表(获取客户档案列表-导购)
  applyList: function (num){
    var thisPage = this;
    thisPage.setData({
      selectArr2: thisPage.data.selectArr
    })

    var params = {
      sellerId: app.globalData.user_Info.user_id,  //导购id
      search: thisPage.data.product_title,    //搜索条件
    };
    if (thisPage.data.selectArr2.length>0){
      for (var m = 0; m < thisPage.data.selectArr2.length; m++) {
        var temDataValue = thisPage.data.selectArr2[m];
        var params2 = params;
        params2 = Object.assign(temDataValue, params2);
        params = params2;
      }
    }

    wx.request({
      url: url + '/app/selectHorizontalAlliancesPage',
      data: {           //请求参数      
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: params
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        
        if (resData.code == 0) {
          var resDataList = resData.result.data;
          if (resDataList && resDataList.length>0){
            for (var i = 0; i < resDataList.length; i++) {
              if (!resDataList[i].tags) {
                resDataList[i].tags = [
                  { "name":"添加 +","type":2}
                ]
              } else if (resDataList[i].tags.length <5){
                resDataList[i].tags.push({ "name": "添加 +", "type": 2 })
              }
            }
          }
          
          var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isTureFalsePage = false;
          }
          if (num > 1) {
            resDataList = thisPage.data.customerInfo.concat(resDataList);
          }
         
          thisPage.setData({
            customerInfo: resDataList,
            isTureFalsePage: isTureFalsePage ,
            page: resData.result.page,  //当前页面
            total: resData.result.total,  //总条数

          })
        } else if (resData.code == 1) {
          console.log("获取数据失败");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //渲染列表(获取客户档案列表-后台)
  adminList: function (num) {
    var thisPage = this;
    var selectName = thisPage.data.numss == 1 ? thisPage.data.selectName : '';
    wx.request({
      url: url + '/app/selectAppCustomerDataStatistics',
      data: {           //请求参数      
        page: num,
        pageSize: thisPage.data.pageSize,
        ispage: true,    //是否分页
        param: {
          shop_id: app.globalData.user_Info.shop_id,  //店铺id
          customer_name: thisPage.data.product_title,    //搜索条件
          property: thisPage.data.property,  //来源
          customerStatus: thisPage.data.state, //状体（）
          [selectName]: thisPage.data.numss == 1 ? thisPage.data.nums : ''
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
  
          var resDataList = resData.data;

          var isTureFalsePage = true;
          if (resDataList.length < thisPage.data.pageSize) {
            var isTureFalsePage = false;
          }
          if (num > 1) {
            resDataList = thisPage.data.customerInfo.concat(resDataList);
          }
          thisPage.setData({
            customerInfo: resDataList,
            isTureFalsePage: isTureFalsePage,
            page: resData.page,  //当前页面
            total: resData.total,  //总条数

          })
      
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //全部渠道
  bindPickerChange:function(e){
    var value = e.detail.value;
    this.setData({
      property: e.detail.value //当前
    })
    this.settleApply(1);
  },
  //失去焦点获取存放搜索数据
  blurGetData: function (e) {
    var searchData = e.detail.value;
    this.setData({
      product_title: searchData   //搜索条件
    })
  },
  //搜索
  search: function (e) {
    var searchType = e.currentTarget.dataset.type;
    if (searchType == '2') {
      var searchData = e.detail.value;
      this.setData({
        product_title: searchData   //搜索条件
      })
    }
    this.settleApply(1);
  },
  //点击顶部按钮请求
  click_request_data:function(e){
    var searchType = parseInt(e.currentTarget.dataset.item);
    var activeList = [];
    var itenList = [];
    var thisPage = this;
    var current = e.currentTarget.dataset;
    for (var i = 0; i < thisPage.data.titleList.length;i++){
      if (i == searchType){
        activeList.push('active');
        itenList.push('');
        }else{
        activeList.push('');
        itenList.push('true');
        }
    }
    if (searchType == 2 && thisPage.data.showMes){
      // var active = thisPage.data.active;
      // var active2 = thisPage.data.active2;
      var selectHide = thisPage.data.selectHide;
      var numss =1;
      var showMes = false;
      this.initRestSelect();
    }else{
      var active  =[];
      var active2 =[];
      var selectHide = true;
      var numss =2;
      var showMes = true;
      if (searchType == 0){
          thisPage.setData({
            selectArr2:[],
            selectArr:[]
          })
      }
    }

    thisPage.setData({
      state: thisPage.data.titleList[searchType],
      activeList: activeList,
      itenList: itenList,

      selectHide: selectHide,
      numss: numss,
      showMes: showMes
    })
    if (wx.showLoading){
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }
    this.settleApply(1);
  },
  //权限
  settleApply:function(num){
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      this.applyList(num);   //请求数据（导购）
    } else {
      this.adminList(num);  //请求数据（后台）
    }
  },
  //点击跳转
  skipUpTo: function (e) {
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    app.skipUpTo(skipUrl, skipType);
  },
  initRestSelect:function(){
    var e = {
      currentTarget: {
        dataset: {
          indexs: 0,
          types: "all_select",
          active: "", 
          // selectArr2: [],
          // selectArr: []
        }
      }
    };
    this.selectCondion(e);
  },
  //点击筛选
  selectCondion:function(e){
    var content = e.currentTarget.dataset;    //{indexs:1,types:gender}
    var types = content.types;                //types:gender(值)
    var thisPage = this;
    var lengths = thisPage.data[types].length;    //types的长度（gender的长度是2：男，女）
    var indexs = content.indexs;              //对应筛选条件的index（0-9）
 
    if (indexs == 0){            //如果是第一个（index是0）时，就是全部分类，就调用顶部标签全部的数据     
      var selectDatas = [];
      selectDatas.push({ name: '全部',value:' '});
      var active = ['active'];
      thisPage.setData({
        selectData: selectDatas,
        active: active,
        selectName: types,
        
      })
      return;         //第一个全部类型，没有参数，跟性别等其他类型不一样
    }
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      var urls = "selectQueryParam";  //导购
      var datas = {
        queryParam: types,
        userManager_id: app.globalData.user_Info.user_id,
        length: lengths
      };
    }else{
      var urls = "selectShopQueryParam";  //商户
      var datas = {
        queryParam: types,
        shop_id: app.globalData.user_Info.shop_id,
        length: lengths,
        user_level: app.globalData.user_Info.user_limits
      };
    }


    wx.request({
      url: url + '/app/' + urls,
      data: datas,          //请求参数      
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data.result;
        var temporary = [];
        var active =[];
        if (resData){
          var resDataLenth = Object.keys(resData).length;
        }else{
          var resDataLenth = 0;
        }
       
        if (res.data.code == 0) {
          for (var m = 0; m <= 8;m++){

            if (m == indexs){  //列表后的换背景
              active.push('active');
            }else{
              active.push('');
            }

            for (var n = 0; n < resDataLenth;n++){
              if (m == n){
                    var objs = {};
                    objs.name = thisPage.data[types][m];
                    objs.value = resData[n];
                    temporary.push(objs);
                }
            }
            thisPage.data[types]
          }
          thisPage.setData({
            selectData: temporary,
            selectName: types.replace('_',''),
            active:active,
            selectName: types,
            active2:[""],
            
            classifyName: types
          })
          // console.log(resData);
        } else if (resData.code == 1) {
          console.log("获取数据失败");
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //完成提交按钮
  submitBtn: function () {
    var thisPage = this;
    thisPage.setData({
      selectHide: true,
    })
    if (thisPage.selectSearchText == 'all_select'){
      var e = {
        currentTarget:{
          dataset:{
            item:"0"
          }
        }
      };
      thisPage.click_request_data(e);
      return;
    }
      thisPage.settleApply(1);
      thisPage.hideSelect();
  },

  //对应条件的筛选
  selectTip:function(e){
    var thisPage = this;
    var content = e.currentTarget.dataset;    //{indexs；1，types:gender}
    var nums = parseInt(content.nums)+1;
    var types = content.types; 
      
    thisPage.selectSearchText = content.value;
    var indexs = content.indexs;
    var active2 = [];     //样式（选中背景，默认未被选中）
    var selectArr = [];   //暂时 存放选中数据的数组
      
    if (types=='0'){  //关闭
      for (var m = 0; m < thisPage.data.selectData.length;m++){
        if (indexs==m){
          active2.push('active2');
        }else{
          active2.push('');
        }
      }
      
      //去重
      for (var m = 0; m < thisPage.data.selectArr.length; m++) {
        var lengths = JSON.stringify(thisPage.data.selectArr[m]).split(':')[0].length - 1;
        var temDatas = JSON.stringify(thisPage.data.selectArr[m]).split(':')[0].substring(2, lengths);
        if (temDatas == thisPage.data.classifyName) {
  
          thisPage.data.selectArr.splice(m,1);      //删除
        
          //console.log('删除');//数组 当前这条  thisPage.data.selectArr[m]
        }

      }
     

      //去重后赋值
      if (thisPage.data.classifyName && nums) {
        console.log(thisPage.data.classifyName);
        console.log(thisPage.data.nums);
       var objs = {
          [thisPage.data.classifyName]: nums
        };
        if(indexs == 0){
          selectArr:[];
          selectArr2:[];
        }else{
          selectArr.push(objs);
        }
       
      }

      selectArr = thisPage.data.selectArr.concat(selectArr);
      thisPage.setData({
        selectHide: false,
        nums: nums,
        active2: active2,
        selectArr: selectArr,
      })
    }else{
     var activeList = [];

      thisPage.setData({
        selectHide: false,
        // selectData:'',
        //  active:[],
      })
      thisPage.click_request_data(e);
    }
    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // app.showWarnMessage("刷新中！");
    this.getData();
    wx.stopPullDownRefresh();  //页面自己回去！！
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触发了下拉');
    if (this.data.isTureFalsePage) {
      var pages = this.data.page + 1;
      this.settleApply(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },
  
  //消失
  hideSelect:function(){
    var thisPage = this;
    thisPage.setData({
      selectHide: true,
      showMes:true,
    })
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
  setCommission : function(e){
    var thisPage = this;
    var skipUpContent = e.currentTarget.dataset;
    var item = skipUpContent.item;   //路径
    var skUrl = skipUpContent.url;   //路径

    //获取活动任务列表
      wx.request({
        url: url + '/app/updateHorizontalAlliances',
        data: {           //请求参数 
          is_horizontal_alliances : 1 ,
          id: item.customerId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: function (res) {
          var resData = res.data;
          if (resData.code == 0) {
            app.skipUpTo(skUrl, 1);
          } else if (resData.code == 1) {
            app.showWarnMessage("提交失败！");  //失败
          }
        },
        fail: function (res) {
          app.showWarnMessage("提交失败！");  //失败
        }
      })
    
  },

   //模态框
  modealTap: function (e) {
    var thisPage = this;
    wx.showModal({
      title: title,
      content: "是否确认移入异业联盟列表?",
      success: function (res) {
        if (res.confirm) {
          thisPage.setCommission();
        } else if (res.cancel) {
          thisPage.skipUpTo(e);
        }
      }
    })
  },
  addTags : function(e){
    var thisPage = this;
    var customerId = e.currentTarget.dataset.item.customer_id;
    console.log(customerId)
    thisPage.setData({
      codeImageHidden : false,
      customerId: customerId
    })

  },
  selectcel: function () {
    var thisPage = this;
    thisPage.setData({
      codeImageHidden: true,
      tag : null,
      customerId :null
    })
  },
  selectsure: function () {
    var thisPage = this;
      
    if (!thisPage.data.tag){
      app.showWarnMessage("请填写标签名称!");
    }

    wx.request({
      url: url + '/app/addHorizontalTag',
      data: {           //请求参数 
        customerId: thisPage.data.customerId,
        tag: thisPage.data.tag,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          thisPage.setData({
            codeImageHidden: true,
            customerId: null,
            tag: null,
          })
          thisPage.getData();
        } else if (resData.code == 1) {
          app.showWarnMessage("提交失败！");  //失败
        }
      },
      fail: function (res) {
        app.showWarnMessage("提交失败！");  //失败
      }
    })

    
  },
  accent_input: function(e){
    var value = e.detail.value;
    this.setData({
      tag:  value
    })
    
  },
  deleteTags : function(e){
    var thisPage  = this;
    var id = e.currentTarget.dataset.item.id;
    wx.showModal({
      content: '是否删除标签',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: url + '/app/deleteHorizontalTag/'+id,
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: 'GET',
            success: function (res) {
              var resData = res.data;
              if (resData.code == 0) {
                wx.showToast({
                  title: '删除成功!',
                  icon: 'success',
                  duration: 2000
                })
                thisPage.getData();
              } else if (resData.code == 1) {
                app.showWarnMessage("提交失败！");  //失败
              }
            },
            fail: function (res) {
              app.showWarnMessage("提交失败！");  //失败
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
})