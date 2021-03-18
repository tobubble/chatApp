import io from 'socket.io-client';
import { getBadge } from 'network/chat/test'
import store from '../store'
import ip from '../common/ipconfig'

// const con = io('', { reconnect: true })
// const con = io('http://127.0.0.1:3000', { reconnect: true, "transports": ["websocket"] })
const con = io(ip, { reconnect: true, "transports": ["websocket"] })
// const con = io('http://192.168.0.105:3000', { reconnect: true})

const token = window.sessionStorage.getItem('token')

con.emit('reconnect', { token })

// 监听发来的好友消息
// 监听得到服务器发来的好友消息
con.on("getFriends", (data) => {
  console.log(data);
  getBadge().then(res => {
    // 如果这个时候发来了消息，我们要将 badge 数量 +1
    // getBadge
    store.commit('changeBadge')
  })
});

// 监听服务器的重新连接成功
con.on('reconnectSuccess', () => {
  getBadge().then(res => {
    console.log(res)
    store.commit('setBadge', res.data.badge)
    store.commit('setMsgBadge', res.data.messageBadge)
  })
})

// 监听服务器的重复好友添加
con.on('addfriendMore', () => {
  store.commit('change', {
    text: '重复请求,请等待对方确认',
    timeout: 1200,
    color: 'error'
  })
})

con.on('addfriendMore2', () => {
  store.commit('change', {
    text: '对方已经是你的好友了~',
    timeout: 1200,
    color: 'error'
  })
})

con.on('news', data => {
  console.log(data)
})

export default con