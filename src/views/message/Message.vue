<template>
  <div class="message" ref="messageBox">
    <!-- <v-list>
      <v-list-item-group>
        <v-list-item
          @click="changeActiveId(friend._id)"
          :class="activeId === friend._id ? 'selected-message elevation-1' : ''"
          v-for="friend in userInfo.friends.friendsMSG"
          :key="friend._id"
        >
          <v-list-item-avatar class="user-avatar">
            <img src="~assets/img/tokisaki3.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <div class="messageWraper d-flex flex-column">
              <div>
                {{ friend.nick }}
              </div>
              <div class="messageContent">
                {{ lastMsg(friend) }}
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存激活的 item 状态
      activeId: "",
      // 好友消息列表
      userInfo: {},
    };
  },
  methods: {
    // 事件监听
    // 改变激活状态的 id
    changeActiveId(id) {
      this.activeId = id;
    },
    // 自定义方法
    // 获取好友消息列表
    getFriendsList() {
      this.userInfo = window.sessionStorage.getItem("userInfo");
      this.userInfo = JSON.parse(this.userInfo);
    },
    // 监听子路由中的 input 的输入
    // messageInput(payload) {
    //   let a =  this.$refs.messageBox.scrollTop
    //   console.log(a)
    //   console.log(payload)
    // }
  },
  computed: {
    lastMsg() {
      return function (node) {
        return node.talkMSG[node.talkMSG.length - 1].content;
      };
    },
  },
  created() {
    this.getFriendsList();
  },
};
</script>

<style lang='less' scoped>
.messageContent {
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 12px;
}

.messageWraper {
  width: 100%;
  font-size: 12px;
}

.selected-message {
  .user-avatar {
    transform: scale(1.2);
  }
}

.message {
  // height: 100%;
  height: calc(100% - 200px);
}
</style>