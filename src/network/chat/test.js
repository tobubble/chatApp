import request from '../request'

export function getUserList() {
  return request({
    url: 'user',
    method: 'get',
  })
}

export function getFriends(nick) {
  return request({
    url: 'searchfriends',
    method: 'get',
    params: {
      nick
    }
  })
}

export function getBadge(_id) {
  return request({
    url: 'badge',
    method: 'get',
    params: {
      _id: _id || ''
    }
  })
}

// 获取好友请求列表
export function getFriendsRes(_id) {
  return request({
    url: 'friendsRes',
    method: 'get',
    params: {
      _id: _id || ''
    }
  })
}

// 好友列表请求
export function getFriendsList() {
  return request({
    url: 'friendsList',
    method: 'get'
  })
}

// 获取聊天内容
export function getFriendsMSG(username) {
  return request({
    url: 'friendsMSG',
    method: 'get',
    params: {
      username: username
    }
  })
}

// 上传图片 avatar
export function avatar(base64, type, marginLeft) {
  return request({
    url: 'avatar',
    method: 'post',
    data: {
      base64: base64,
      type: type,
      marginLeft: marginLeft
    }
  })
}

// 减少自己的徽章
export function minusBadge(config) {
  return request({
    url: 'minusBadgeCount',
    method: 'post',
    data: {
      fromUsername: config.fromUsername,
      toUsername: config.toUsername,
      count: config.count || '',
    }
  })
}

// 退出登录请求
export function uLoginout() {
  return request({
    url: 'loginout',
    method: 'post'
  })
}