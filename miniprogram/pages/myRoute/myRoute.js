const app = getApp()

Page({
  data: {
    
    // routeInfo: {
    
    //   endLat: 30.406110, // 终点经度必传
    //   endLng: 120.305010, //终点纬度 必传
    //   endName: "haha", //终点名称 必传
    //   mode: "car" //算路方式 选填
    // },
    // routeInfo:routeInfo,
  },
  onLoad: function() {
    var that = this
    wx.getStorage({
      key: 'mydata',
      success: function(res) {
        that.setData({
          routeInfo:{
            endLat: res.data.latitude,
            endLng: res.data.longitude,
            endName: res.data.locationAddress
          }
          
        })
        


      },
    })
  },
  onShow: function() {
    let plugin = requirePlugin("myPlugin");
  }
})