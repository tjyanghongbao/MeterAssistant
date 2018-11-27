// pages/record/record.js
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
    toggle2: false,
  
    actions: [
      {
        name: 'detail',
        width: 70,
        color: '#fff',
        fontsize: '25',
        icon: 'browse',
        background: '#225aa5'
      },
      {
        name: 'edit',
        width: 70,
        color: '#80848f',
        fontsize: '25',
        icon: 'editor'
      },
      {
        name: 'delete',
        color: '#fff',
        fontsize: '25',
        width: 70,
        icon: 'delete',
        background: '#ed3f14'
      }      
    ]
  },

  handleCancel2() {
    this.setData({
      visible2: false,
      toggle: this.data.toggle ? false : true
    });
    console.log(this.data.toggle, 111111111)
  },
  handleClickItem2() {
    const action = [...this.data.actions];
    action[0].loading = true;

    this.setData({
      actions: action
    });

    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions: action,
        toggle: this.data.toggle ? false : true
      });

    }, 2000);
  },
  handlerCloseButton() {
    this.setData({
      toggle2: this.data.toggle2 ? false : true
    });
  },
  actionsTap() {
    this.setData({
      visible2: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    const db = wx.cloud.database()
    db.collection('MeterLoaction').get({

      success: res => {
        this.setData({
          meterloaction: res.data
        })
      }
    })
  },
  onDel: function (e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    db.collection("MeterLoaction").doc(id).remove({
      success: res => {
        wx.showToast({
          title: 'Success',
        })
        this.onLoad()
      },
      fail: err => {
        wx.showToas({
          title: 'Failed',
        })
      }
    })
  },
  onUpdate: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '',
    })
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
    var _this = this;
    const db = wx.cloud.database()
    db.collection('MeterLoaction').get({

      success: res => {
        this.setData({
          meterloaction: res.data
        })
      }
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})