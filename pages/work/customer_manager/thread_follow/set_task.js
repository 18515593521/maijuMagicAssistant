// pages/work/thread_follow/thread_follow/set_task.js
const app = getApp()
var url = app.globalData.domainName;  
Page({
  
  data: {
    customer_id: null,
    tasklist:['已完成','未完成','进行中'],
    taskState:0,
    page: 1,//当前页
    pageSize: 5, //一页展示几个
    total: 0,  //总页数
    isTureFalsePage: true,  // 是否分页
    seller_id:null  //导购id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;

    thisPage.setData({
      customer_id: options.detail,
      seller_id: options.seller_id ? options.seller_id:app.globalData.user_Info.user_id
    })

    this.applyList(1);   //请求数据（导购）
  },
  getData: function (e) {
    if (app.globalData.user_Info.user_limits_role == 'seller') { //导购
      this.applyList(1);   //请求数据（导购）
    }
  },
  //渲染列表(获取客户档案列表-导购)
  applyList: function (num) {
    var thisPage = this;
    thisPage.setData({
      selectArr2: thisPage.data.selectArr
    })
    var params = {
      seller_id: thisPage.data.seller_id , //导购id
      customer_id: thisPage.data.customer_id
    };
    var data = {           //请求参数      
      page: num,
      pageSize: thisPage.data.pageSize,
      ispage: true,    //是否分页
      param: params
    };
    wx.request({
      url: url + '/app/selectAppCustomerBySellerId',
      data: data,
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
            resDataList = thisPage.data.taskInfo.concat(resDataList);
          }
          thisPage.setData({
            taskInfo: resDataList,
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
      this.applyList(pages);
    } else {
      app.showWarnMessage('没有更多数据了！');
    }
  },
  bindPickerChange: function (e) {
    var value = e.detail.value;
    var current = e.currentTarget.dataset;
    var indexs = current.indexs;
    var thisPage = this;
    var taskInfo = thisPage.data.taskInfo;
    var id = taskInfo[indexs].id;
    var status = parseInt(value) + 1
    taskInfo[indexs].status = status;
    

    wx.request({
      url: url + '/app/updateTaskBySeller',
      data: {           //请求参数      
        id:id,
        status: status
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;

        if (resData.code == 0) {
          thisPage.setData({
            taskInfo: taskInfo,
          })
          app.showWarnMessage('修改成功！');
    
        } else if (resData.code == 1) {
          app.showWarnMessage('修改失败！');
        }
      },
      fail: function (res) {
        app.showWarnMessage('网络异常！');
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