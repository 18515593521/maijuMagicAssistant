//获取应用实例
const app = getApp()
var url = app.globalData.domainName;        //请求域名 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_id:null ,//客户id
    linkManData:[]   //联系人数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    customer_id: options.customer_id  
  })
  this.getLinkMan();  // 获取联系人列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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
  
  },
//获取联系人的列表
  getLinkMan:function(){
  var thisPage = this;
  wx.request({
    url: url + '/app/selectCustomerAddress1',
    data: {           //请求参数      
      customer_id: thisPage.data.customer_id  //用户id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success: function (res) {
      var resData = res.data;
      if (resData.code == 0) {
        var obj = {};
        var resDataObj = resData.result;
        
        thisPage.setData({
          linkManData: resDataObj
        })
      } else if (resData.code == 1) {

      }

    },
    fail: function (res) {
      console.log(res + '失败！');
    }
  })
},
//选择地址
  chooseAddress:function(e){
    var thisPage = this;
    var current = e.currentTarget.dataset;
    var id = current.id; //id
    var arr = thisPage.data.linkManData;
    for (var i = 0; i < arr.length;i++){
      var caseArr = arr[i];
      if (caseArr.id == id){
        if (caseArr.choose){
          caseArr.choose = "";
          wx.setStorageSync('choose', "");
        }else{
          caseArr.choose = true;
          wx.setStorageSync('choose', caseArr);
        }
        
      }else{
        caseArr.choose = "";
      }
    }
    thisPage.setData({
      linkManData: arr
    })
  },  
//提交选中数据
submitData:function(e){
  var skipUrl = "/pages/work/customer_manager/make_order/make_order/make_order?pageType=1";
  app.skipUpTo(skipUrl, 2);
}
})