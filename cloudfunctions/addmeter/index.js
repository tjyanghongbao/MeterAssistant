const cloud = require('wx-server-sdk');

// 用于权限控制
let whiteList = [];

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    MeterNo,
    latitude,
    longitude,
    locationAddress,
    image,
    userInfo
  } = event;

  let openId = userInfo.openId; // 添加用户的openId

  cloud.init();
  // 数据库引用
  const db = cloud.database();
  // 集合引用
  const collection = db.collection('MeterLoaction');

  if (whiteList.length && !whiteList.includes(openId)) {
    return {
      code: 2, // 没有权限
      msg: 'You don\'t have sufficient rights'
    }
  }

  let result = null;

  try {
    // 数据库引用
    const db = cloud.database();
    // 集合引用
    const collection = db.collection('MeterLoaction');

    result = await collection.add({
      data: {
        MeterNo,
        latitude,
        longitude,
        locationAddress,
        image,
        _openid: openId,
      }
    });
  }
  catch (e) {
    return {
      code: 1, // 添加数据失败
      msg: e.message
    };
  }

  console.log(result);

  return {
    code: 0,
    data: {
      id: result.id
    }
  };
};
