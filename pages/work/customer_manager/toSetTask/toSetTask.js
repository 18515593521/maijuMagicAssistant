// pages/work/thread_follow/toSetTask/toSetTask.js
var app = getApp();   //获取应用实例
var url = app.globalData.domainName;  
var dateTimePicker = require('../../../datetimepicker/datetimepicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startYear: 2018,
    endYear: 2050,

    dateTime: null,
    dateTime2:null,
    customer_id:null,
    types:null,
    selectTaskTime:null,

    dateTime3: null,
    dateTime4: null,

     setTaskTime: null,  //选定任务时间
    setTaskTimeArr:[],  //添加任务提醒
    dateTimeArray: null,
    selectTime:true,
    remarkText:null,  //任务内容
    selectTimer2:null, // 选择的那个 弹出
    opactionButton:false,  //是那个时间显示还是隐层
    formIdList:[]   //放表单id 的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    var obj = dateTimePicker.dateTimePicker(thisPage.data.startYear, thisPage.data.endYear);
    thisPage.setData({
      dateTime:obj.dateTime,
      dateTime3: obj.dateTime,
      setTaskTime: obj.dateTimeArray[0][obj.dateTime[0]] + '/' + obj.dateTimeArray[1][obj.dateTime[1]] + '/' + obj.dateTimeArray[2][obj.dateTime[2]] + ' ' + obj.dateTimeArray[3][obj.dateTime[3]],
      customer_id: options.detail,
      customer_name: options.customer_name,
      types: options.type,
      dateTimeArray: obj.dateTimeArray,
    })
  },
  //填写任务内容
  writeText:function(e){
    var values = e.detail.value;
    this.setData({
      remarkText: values
    })
  },
//更改选择时间
  bindPickerChange:function(e){
    this.setData({
      dateTime2:e.detail.value
    })   
  },
  //点击确定
  sureCancel:function(e){
    var current = e.currentTarget.dataset;
    var type = current.type;
    var thisPage = this;
    var dataTime = null;
    var dateTime = null;
    var formIdList = [];
    
    if (thisPage.data.selectTimer2=='1'){  //点击的是选择任务
      dateTime = 'dateTime';
      if (type == 1) {  //确定
       
        dataTime = thisPage.data.dateTime2 ? thisPage.data.dateTime2 : thisPage.data.dateTime;
      } else {
        dataTime = thisPage.data.dateTime;
      }
    }else{  //点击的是添加
      dateTime = 'dateTime3';
      var formId = e.detail.formId;
      console.log(formId+'表单id');
      console.log('type是几' + type);
      if (type == 1) {  //确定 
        dataTime = thisPage.data.dateTime2 ? thisPage.data.dateTime2 : thisPage.data.dateTime3;
        formIdList.push(formId);
        thisPage.setData({
          formIdList:thisPage.data.formIdList.concat(formIdList)
        })
        console.log('表单id' + thisPage.data.formIdList.concat(formIdList));
        console.log('总的表单的id' + thisPage.data.formIdList);
      } else {
        dataTime = thisPage.data.dateTime3;
       
      }
    }

    thisPage.setData({
      [dateTime]: dataTime,
      selectTime:true,
      dateTime2:''

    })
    //以下是为选择添加的时间赋值
    if (thisPage.data.selectTimer2 == '1'){
      thisPage.setData({
        setTaskTime: thisPage.data.dateTimeArray[0][thisPage.data.dateTime[0]] + '/' + thisPage.data.dateTimeArray[1][thisPage.data.dateTime[1]] + '/' + thisPage.data.dateTimeArray[2][thisPage.data.dateTime[2]] + ' ' + thisPage.data.dateTimeArray[3][thisPage.data.dateTime[3]] ,
       
      })
    }else{
      if (thisPage.data.setTaskTimeArr.length>=3){
        app.showWarnMessage('最多可设置三个！');
        return;
      }else{
        if (type==1){
          var setTaskTimeArr = [];
          var timer = thisPage.data.dateTimeArray[0][thisPage.data.dateTime3[0]] + '/' + thisPage.data.dateTimeArray[1][thisPage.data.dateTime3[1]] + '/' + thisPage.data.dateTimeArray[2][thisPage.data.dateTime3[2]] + ' ' + thisPage.data.dateTimeArray[3][thisPage.data.dateTime3[3]];
          setTaskTimeArr.push(timer);
          thisPage.setData({
            setTaskTimeArr: thisPage.data.setTaskTimeArr.concat(setTaskTimeArr),
          })
        }

      }

    }
  },
  //删除任务时间
  delect:function(e){
    var current = e.currentTarget.dataset;
    var indexs = current.index;
    var thisPage = this;
 
    thisPage.data.setTaskTimeArr.splice(indexs,1);
    thisPage.data.formIdList.splice(indexs,1);
    thisPage.setData({
      setTaskTimeArr: thisPage.data.setTaskTimeArr,
      formIdList: thisPage.data.formIdList
    })
    console.log(thisPage.data.setTaskTimeArr);

  },
 
  //选择时间弹框
  selectTimers:function(e){
    var current = e.currentTarget.dataset;
    var type = current.type;
    var opactionButton = null;
    if (type =='1'){  //选择任务时间
      opactionButton = false;
    } else{ //添加任务提醒
      opactionButton = true;
    }
    this.setData({
      selectTime: false,
      selectTimer2: type,
      opactionButton: opactionButton
    })
  },
  selectCustomer:function(e){
    var urls = '/pages/work/customer_manager/select_customer/select_customer';
    app.skipUpTo(urls,1);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  skipUpTo: function (e) {

    var thisPage = this;
    var skipUpContent = e.currentTarget.dataset;
    var types = thisPage.data.types;
    console.log(thisPage.data.types);
    var skipUrl = null;
    // var skipUrls = '/pages/work/index/work';  //返回工作台页面
    var customer_id = thisPage.data.customer_id;
    if (!thisPage.data.customer_id){
      app.showWarnMessage('请选择用户！');
      return;
    }
    if (!thisPage.data.setTaskTime) {
      app.showWarnMessage('请选任务时间！');
      return;
    }
    if (!thisPage.data.remarkText) {
      app.showWarnMessage('请选任务内容！');
      return;
    }
    if (thisPage.data.setTaskTimeArr.length<=0) {
      app.showWarnMessage('请选任务提醒！');
      return;
    }
    if (types == 1){
      skipUrl = '/pages/work/customer_manager/thread_follow/set_task?detail=' + customer_id;   //路径
    } else if (types == 2){
      skipUrl = '/pages/work/customer_manager/thread_follow_remind/set_task?detail=' + customer_id;   //路径
    }

    
    var data = {
      start_time: thisPage.data.setTaskTime ,
      customer_id: thisPage.data.customer_id,
      seller_id: thisPage.data.seller_id,
      dateList: thisPage.data.setTaskTimeArr,
      seller_id: app.globalData.user_Info.user_id,
      content: thisPage.data.remarkText,
      formIdList: thisPage.data.formIdList
    }
    console.log(data)
    wx.request({
      url: url + '/app/addTaskBySeller',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var resData = res.data;

        if (resData.code == 0) {
          app.showWarnMessage('新增成功！');
          //app.skipUpTo(skipUrls,1);   //提交成功以后没有默认跳转，点击返回，正常向上一级返回
          app.skipUpTo(skipUrl,2);   //1
        } else if (resData.code == 2) {
          app.showWarnMessage('新增失败！');
        }
      },
      fail: function (res) {
        console.log(res + '失败！');
      }
    })   
  },
})