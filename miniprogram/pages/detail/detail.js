//detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    image: '',
    MeterNo: '',
    locationAddress: '',
    latitude: '',
    longitude: ''
  },

  onLoad: function() {
    this.getMeterDetail();
  },

  /**
   * 获取文章详情
   */
  getMeterDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let meterId = app.globalData.meter.id;
    db.collection('MeterLoaction').doc(meterId).get().then(res => {
        console.log('db读取成功', res.data);
        let data = res.data;
        this.setData({
          image: data.image,
          MeterNo: data.MeterNo,
          locationAddress: data.locationAddress,
          latitude: data.latitude,
          longitude: data.longitude
        });
      })
      .catch(e => {
        wx.showToast({
          title: 'db读取失败',
          icon: 'none'
        });
      });
  },

  /**   
   * 预览图片  
   */
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.image] // 需要预览的图片http链接列表  
    });
  },

  findLocation() {
    wx.setStorage({
      key: "mydata",
      data: {       
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        locationAddress:this.data.locationAddress
      },
      success: function() {
        wx.navigateTo({
          url: '../myRoute/myRoute'
        });
      }
    })
  },
  onUnload: function () {

  },
})