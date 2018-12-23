// pages/work/product_center/share_product_img/share_product_img.js
const app = getApp()
 var urls = app.globalData.domainName;        //请求域名
const ctx = wx.createCanvasContext('myCanvas');
//var urls = 'https://www.kaolaj.com/magic_cloud2.0_test';
Page({

  data: {
    gift:false,  //等待的字样
    jointUrl:null, // 生成连接的路径
    tips:true,  //提示成功不成功
    urlImage:null,  //背景图
    erweima:null  //二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thisPage = this;
    thisPage.setData({
      erweima: options.erweima,
      urlImage: options.urlImage
    })
    thisPage.crowImg();
  },
//重新画图片
  crowImg:function(e){
    var thisPage = this;
    thisPage.setData({
      tips: true,
      gift: false,
    })
    ctx.drawImage(thisPage.data.urlImage, 0, 0, 250, 444);
    ctx.drawImage(thisPage.data.erweima, 86, 336, 78, 78);
    ctx.draw();
    var falg = setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 250,
        height: 500,
        destWidth: 750,
        destHeight: 1334,
        canvasId: 'myCanvas',
        fileType: 'png',
        success: function (res) {
          console.log(res.tempFilePath + '画后');
          thisPage.setData({
            jointUrl: res.tempFilePath,
            gift: true
          })
        },
        fail: function (data) {
          console.log(data);
          thisPage.setData({
            tips:false
          })
        }
      })
    }, 1000);
  },
  /* 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
  
  },
  //授权（下载到本地）
  downLoad: function (e) {
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
                  app.addPageSharePoint('分享');
                  app.showSuccessMessage('成功保存到相册');
                },
                fail: function (mess){
                  console.log(mess);
                }
              })
            }
          })
        }
      }
    })
  }
})