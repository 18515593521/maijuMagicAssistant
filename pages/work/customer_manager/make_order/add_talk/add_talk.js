const app = getApp()
var urls = app.globalData.domainName;        //请求域名
/*模态框*/
var until = require('../../../../../utils/util.js');

Page({
  data: {
    info:{
      customerUserManagerBasic: {
        communicate_id: null,  
        communicate_content: null,   //沟通内容
      },
      // remark: null  //备注
    }
  },

  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var thisPage = this;
    thisPage.setData({
      'info.customer_id': options.customer_id,
      'info.userManager_id': app.globalData.user_Info.user_id
    })
    thisPage.getTalkInfo(); //获取沟通信息
  },
  //获取沟通信息
  getTalkInfo:function(e){
    var thisPage = this;
    wx.request({
      url: urls + '/app/related/customer/selectCommunicate',
      data: {           //请求参数      
        customer_id: thisPage.data.info.customer_id,
        userManager_id: thisPage.data.info.userManager_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          var resDatas2 = resData.result;

          thisPage.setData({

            info:{
              customer_id: thisPage.data.info.customer_id,
              customerUserManagerBasic:{
                communicate_content: resDatas2.customerUserManagerBasic, //沟通内容
                communicate_id: resDatas2.communicate_id
              },
              
            }


          })
       
        } else if(resData.code == 2){

        }else {
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  //秒的转换
  
//选择状态
  editContent:function(e){
    var thisPage = this;
    var values = e.detail.value;
    var current = e.currentTarget.dataset;
    var keys = current.keys;
    var basic = current.basic;
    if (values!=='0'){
      if (basic) {
        var infos = 'info.customerUserManagerBasic.' + keys;
        thisPage.setData({
          [infos]: values
        })
      } else {
        var infos = 'info.'+ keys;
        thisPage.setData({
          [infos]: values
        })
      }
    }
    console.log(thisPage.data.info);
  },



//提交
  submitData:function(){
    var thisPage = this;
   var timestamp = Date.parse(new Date()); //获取当前时间
    //沟通时间
   var installation_time_end = Date.parse(new Date(thisPage.data.info.installation_time_end + ' ' + thisPage.data.installation_time2));
   var installation_time_start = Date.parse(new Date(thisPage.data.info.installation_time_start + ' ' + thisPage.data.installation_time1));
   //安装时间应该大于当前时间
   var communicate_timer = Date.parse(new Date(thisPage.data.info.communicate_time_start + ' ' + thisPage.data.communicate_time1));
 

    // thisPage.setData({
    //   'info.communicate_time_start': communicate_timer,
    //   'info.installation_time_start': installation_time_start,
    //   'info.installation_time_end': installation_time_end,

    //   'info.sendMessage': thisPage.data.info.sendMessage == 0 ? '' : thisPage.data.info.sendMessage, //是否发送离店短信
    //   'info.appointment': thisPage.data.info.appointment == 0 ? '' : thisPage.data.info.appointment, //是否预约测量
    //   'info.addWeixin': thisPage.data.info.addWeixin == 0 ? '' : thisPage.data.info.addWeixin, //是否添加微信
    //   'info.furnishProgress': thisPage.data.info.furnishProgress == 0 ? '' : thisPage.data.info.furnishProgress, //装修进度
    //   'info.furnishStyle': thisPage.data.info.furnishStyle == 0 ? '' : thisPage.data.info.furnishStyle,// 装修风格
    //   'info.houseSpace': thisPage.data.info.houseSpace == 0 ? '' : thisPage.data.info.houseSpace, //房屋面积

    // })

thisPage.setData({
  'info.customerUserManagerBasic.userManager_id': app.globalData.user_Info.user_id,
  'info.userManager_id': app.globalData.user_Info.user_id
})
    wx.request({
      url: urls + '/app/related/customer/addCommunicate',
      data: thisPage.data.info,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;
        if (resData.code == 0) {
          var skinUp = '/pages/work/customer_manager/customer_detail/customer_detail?detail=' + thisPage.data.info.customer_id;
         // app.skipUpTo(skinUp, 2);
          app.backGo(1);
        }else{
          app.showWarnMessage('提交失败！');
        }

      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })
  },
  

})