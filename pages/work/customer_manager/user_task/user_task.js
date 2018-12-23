// pages/work/customer_manager/user_file/user_file.js
const app = getApp()
var url = app.globalData.domainName;        //请求域名
Page({

  /**
   * 页面的初始数据
   */
  selectSearchText:'',
  data: {
    page: 1,//当前页
    pageSize:10, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    product_title:null,  //搜索信息
    property: 0,   //来源 (全部渠道'0,'公司分配1','邀请注册2')
    into_Shop_Number:0,
    customer_Type: 0,
    customer_life: 0,
    appointment: 0,
    activity_id:0,
    search: null,
    into_Shop_Number_list: [ '进店次数','首次进店', '第二次进店', '第三次进店', '多次进店', '成交'],// 进店次数
    customer_Type_list: ['客户类型', '新客户','60-70%需求分析与产品确认', '70-80%上门测量与提交方案', '80-90%多次进店与邀约谈判', '90-100%价格谈判与逼单成交'],  //客户类型
    customer_life_list: ['生命周期', '0~3 天', '3~5 天', '5~10 天', '潜水用户'],  //生命周期
    appointment_list: ['上门量房', '已预约', '未预约', '其他'],  //生命周期
    activity_list: [
      {"name":"活动","value":0},
     
    ],  //生命周期
    seller_id: null  //导购id
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage =this;
    thisPage.selectActivity(); 
    thisPage.getData();
    thisPage.setData({
      seller_id: app.globalData.user_Info.user_id, //导购id
    })
  } ,
  //获取数据
  getData: function (e) {
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      this.applyList(1);   //请求数据（导购）
    }
  },
  customerTypeChange: function (e) {
    var value = e.detail.value;
    this.setData({
      customer_Type : e.detail.value //当前
    })
    this.settleApply(1);
  },
  customerLifeChange: function (e) {
    var value = e.detail.value;
    this.setData({
      customer_life: e.detail.value //当前
    })
    this.settleApply(1);
  },
  appointmentChange: function (e) {
    var value = e.detail.value;
    this.setData({
      appointment: e.detail.value //当前
    })
    this.settleApply(1);
  },
  intoShopNumberChange: function (e) {
    var value = e.detail.value;
    this.setData({
      into_Shop_Number: e.detail.value //当前
    })
    this.settleApply(1);
  },
  activityChange: function (e) {
    var value = e.detail.value;
    this.setData({
      activity_id: e.detail.value //当前
    })
    this.settleApply(1);
  },
  //渲染列表(获取客户档案列表-导购)
  applyList: function (num) {
    var thisPage = this;
    thisPage.setData({
      selectArr2: thisPage.data.selectArr
    })
    var params = {
      seller_id: app.globalData.user_Info.user_id, //导购id
    };

    if(thisPage.data.into_Shop_Number > 0){
      params.into_shop_number = thisPage.data.into_Shop_Number;
    }
    if (thisPage.data.customer_life > 0) {
      params.customer_life = thisPage.data.customer_life;
    }
    if (thisPage.data.appointment > 0) {
      params.appointment = thisPage.data.appointment;
    }
    if (thisPage.data.customer_Type > 0) {
      params.customer_type = thisPage.data.customer_Type -1;
    }
    if (thisPage.data.activity_id != 0) {
      params.activity_id = thisPage.data.activity_id;
    }
    if (thisPage.data.search) {
      params.search = thisPage.data.search;
    }
    wx.request({
      url: url + '/app/getAppSellerTaskForPage',
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
  //权限
  settleApply: function (num) {
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      this.applyList(num);   //请求数据（导购）
    } else {
      this.adminList(num);  //请求数据（后台）
    }
  },
  //失去焦点获取存放搜索数据
  blurGetData: function (e) {
    var searchData = e.detail.value;
    this.setData({
      search: searchData   //搜索条件
    })
  },
  //搜索
  search: function (e) {
    var searchType = e.currentTarget.dataset.type;
    if (searchType == '2') {
      var searchData = e.detail.value;
      this.setData({
        search: searchData   //搜索条件
      })
    }
    
    this.settleApply(1);
  },
  selectActivity:function(){
    var thisPage = this;
    var shopId = app.globalData.user_Info.shop_id

    wx.request({
      url: url + '/app/selectActivityByUserId/' + shopId ,     
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function (res) {
        var resData = res.data.result;
        if (res.data.code == 0) {
          if (resData) {
            var resDataLenth = Object.keys(resData).length;
          } else {
            var resDataLenth = 0;
          }
          var temporary = thisPage.data.activity_list;
          for (var n = 0; n < resDataLenth; n++) {
              var objs = {};
              objs.name = resData[n].name;
              objs.value = resData[n].value;
              temporary.push(objs);
          }
          thisPage.setData({
            activity_list: temporary
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
  skipUpTo: function (e) {
    var skipUpContent = e.currentTarget.dataset;
    var skipUrl = skipUpContent.url;   //路径
    var skipType = skipUpContent.type;  //类型
    app.skipUpTo(skipUrl, skipType);
  },
})