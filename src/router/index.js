import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const AddFriends = () => import('views/home/cpn/AddFriends')
const Space = () => import('views/space/Space')
const Friends = () => import('views/friends/Friends')
const FriendsRes = () => import('views/friends/cpn/FriendsRes')
const FriendsList = () => import('views/friends/cpn/FriendsList')
const Message = () => import('views/message/Message')
const SendMessage = () => import('views/message/cpn/SendMessage')
const MessageList = () => import('views/message/cpn/MessageList')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/home', component: Home, children: [
      { path: '', redirect: '/message' },
      {
        path: '/friends', component: Friends, children: [
          { path: '', redirect: '/friends/friendsList' },
          { path: '/friends/friendsRes', component: FriendsRes },
          { path: '/friends/friendsList', component: FriendsList },
        ]
      },
      { path: '/space', name: 'space', component: Space },
      {
        path: '/message', component: Message, children: [
          { path: '', redirect: '/message/MessageList' },
          { path: '/message/sendMessage', component: SendMessage, name: 'sendMessage' },
          { path: '/message/MessageList', component: MessageList, name: 'MessageList' }
        ]
      },
      { path: '/addFriends', name: 'addFriends', component: AddFriends },
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

/**
 * 解决报错问题：报错显示是路由重复
 * Error: Avoided redundant navigation to current location
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
