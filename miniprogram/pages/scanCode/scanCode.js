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
    dataMsg: '',
    statusMsg: '',
    fileID: null,
    image: '',
    tempFilePath: '',
  },

  /**
   * 上传文件
   */
  uploadFile: function() {
    wx.chooseImage({
      success: dRes => {
        this.setData({
          statusMsg: '开始上传文件'
        })

        wx.showLoading({
          title: '加载中',
        });

        const uploadTask = wx.cloud.uploadFile({
          cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
          filePath: dRes.tempFilePaths[0],
          success: res => {
            if (res.statusCode < 300) {
              this.setData({
                fileID: res.fileID,
              }, () => {
                this.getTempFileURL();
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          },
        })
      },
      fail: console.error,
    })
  },

  /**
   * 获取图片链接
   */
  getTempFileURL: function() {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.fileID,
      }],
    }).then(res => {
      console.log('获取成功', res)
      let files = res.fileList;

      if (files.length) {
        this.setData({
          image: files[0].tempFileURL
        });
      }

      wx.hideLoading();
    }).catch(err => {
      console.error('获取失败', err)
      wx.showToast({
        title: '获取图片链接失败',
        icon: 'none'
      });
      wx.hideLoading();
    })
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
        this.txt_meterID.value = this.data.meterID
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
      hasLocation: false,
      image:''
    })
  },
  uploadToDB() {
    const db = wx.cloud.database()
    db.collection('MeterLoaction').add({

      data: {
        MeterNo: this.data.meterID,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        locationAddress: this.data.locationAddress,
        image: this.data.image
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

    const data = this.data
    const formData = e.detail.value;

    if (!e.detail.value.txt_meterID || !this.data.latitude) {
      return wx.showToast({
        title: 'Meter No and Location cannot be empty',
        icon: 'none'
      });
    }

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  

    const that = this
    that.setData({
      meterID: e.detail.value.txt_meterID
    })

    wx.showLoading({
      title: 'Uploading',
    });
    //this.uploadToDB()

    //yhb之后会调试
    wx.cloud.callFunction({
      name: 'addmeter',
      data: {
        MeterNo: this.data.meterID,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        locationAddress: this.data.locationAddress,
        image: data.image,
      }
    }).then(res => {
      console.log('调用成功', res)
      const result = res.result;
      const data = result.data || {};

      if (result.code) {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        });
        return;
      }

      // 跳转到详情
      //app.globalData.blog.detailId = data.id;
      wx.navigateTo({
        url: '../record/record'
      });
      wx.hideLoading();

    }).catch(err => {
      console.error('调用失败', err)
      this.setData({
        statusMsg: `调用失败：${err.errMsg}`,
      });
      wx.hideLoading();
    });

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