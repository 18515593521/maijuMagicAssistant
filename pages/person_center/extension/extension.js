//页面js
var app = getApp();   //获取应用实例
var urlPage = app.globalData.domainName;        //请求域名
Page({
  data: {
    isHaveData: true,   //是否有数据
    codeImageHidden:true,
    searchText: "",       //搜索字段
    peopleList: [
    ],       //人员列表
    redMoney:0,
    currentPage: 1,  //当前页码
    pageSize: 15,     //每页记录数
    total: 0,        //总记录数 
    isSearchNextPage: true,   //是否查询下一页
    fromTypes:null  //1是从个人中心按钮进入 2是从推广明细进入
  
  },

  //页面加载
  onLoad: function (options) {
      this.setData({
        fromTypes: options.types
      })
  },
  //页面显示
  onShow: function () {
    this.getPeopleList(1);
  },
  //到达底部
  onReachBottom: function (e) {
    if (this.data.isSearchNextPage) {
      var searchPage = this.data.currentPage + 1;
      this.getPeopleList(searchPage);    
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getPeopleList(1);
  },

  //设置搜索条件
  setSearchText: function (e) {
    var searchText = e.detail.value;
    this.setData({
      searchText: searchText
    })
  },
  //搜索人员
  searchPeople: function (e) {
    var thisPage = this;
    var dataSet = e.currentTarget.dataset;
    var searchType = dataSet.type;

    if (searchType == 1) {
      var searchText = e.detail.value;
      this.setData({
        searchText: searchText
      })
    }

    thisPage.getPeopleList(1);
  },
  //获取人员列表 
  getPeopleList: function (searchPage) {
    var thisPage = this;

    var data = {};

    data.inviter = app.globalData.user_Info.user_id;
    data.name = thisPage.data.searchText;
    data.type = 1;

    wx.request({
      url: urlPage + '/app/selectInviterPage',  //接口地址 
      data: {           //请求参数 
        page: searchPage,
        pageSize: thisPage.data.pageSize,
        param: data
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {  //成功 
        var returnData = res.data;

        if (returnData.code == 0) { //成功 
          var dataList = returnData.result.data;
        
          for (var i = 0; i < dataList.length; i++) {
            var dataObj = dataList[i];
            if (!dataObj.name) {
              dataObj.name = '暂无';
            }
            if (!dataObj.phone) {
              dataObj.phone = '暂无';
            } else {
              dataObj.phone = dataObj.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            }
          }

          var isSearchNextPage = true;
          if (dataList.length < thisPage.data.pageSize) {
            isSearchNextPage = false;
          }
          if (searchPage > 1) {   //非第一页 
            dataList = thisPage.data.peopleList.concat(dataList);
          }

          var isHaveData = true;
          if (searchPage == 1 && dataList.length == 0) { //第一页无数据 
            isHaveData = false;
          }

          thisPage.setData({
            peopleList: dataList,
            currentPage: returnData.result.page,  //当前页码 
            total: returnData.result.total,       //总页数 
            isSearchNextPage: isSearchNextPage,    //是否查询下一页 
            isHaveData: isHaveData
          })
        } else {  //失败 
          app.showWarnMessage(returnData.message);
        }
      },
      fail: function (res) {     //失败 
        console.log('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成 
        console.log('请求完成：', res.errMsg);
        wx.stopPullDownRefresh();
      }
    })
  },

  getRedMoney: function (e) {
    var thisPage = this;
    var dataSet = e.currentTarget.dataset;
    var item = dataSet.item;
    if (item.is_get == 1) {
      return;
    }
  
    wx.request({
      url: urlPage + '/app/addRedCashWithdrawal',  //接口地址 
      data: {           //请求参数 
        appid: app.globalData.user_Info.app_id,
        appid1: app.globalData.appId,
        id: item.id
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
            codeImageHidden: false,
            redMoney: item.red_envelopes
          })

        } else {  //失败 
          app.showWarnMessage(returnData.message);
        }
      },
      fail: function (res) {     //失败 
        console.log('请求失败：', res.errMsg);
      },
      complete: function (res) { //完成 
        console.log('请求完成：', res.errMsg);
        wx.stopPullDownRefresh();
      }
    })



  },
  redPagcel: function () {
    var thisPage = this;
    thisPage.setData({
      codeImageHidden: true,
      redMoney: 0
    })
    this.getPeopleList(1);
  }


})