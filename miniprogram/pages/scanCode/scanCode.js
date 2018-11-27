// pages/scanCode/scanCode.js
const util = require('../../util/util.js')

const formatLocation = util.formatLocation

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meterID: null,
    hasLocation: false,
    location: null,
    latitude: null,
    longitude: null,
    locationAddress: "",
  },

  scanCode: function(event) {
    const that = this
    wx.scanCode({
      scanType: ['barCode'],
      onlyFromCamera: false,
      success: res => {
        that.setData({
          meterID: res.result,
        })

        console.log(this.data.meterID)
        this.txt_meterID.value=this.data.meterID
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  chooseLocation() {
    const that = this
    wx.chooseLocation({
      success(res) {
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude),
          longitude: res.longitude,
          latitude: res.latitude,
          locationAddress: res.address
        })
      }
    })
  },
  
  clear() {
    this.setData({
      hasLocation: false
    })
  },
  uploadToDB() {   
    const db = wx.cloud.database()
    db.collection('MeterLoaction').add({

      data: {
        MeterNo: this.data.meterID,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        locationAddress: this.data.locationAddress
      }

    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '添加成功',
      })
    }).catch(err => {
      console.log(err)
    })

  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const that = this
    that.setData({
      meterID: e.detail.value.txt_meterID
    })
    this.uploadToDB()
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
    this.clear()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})