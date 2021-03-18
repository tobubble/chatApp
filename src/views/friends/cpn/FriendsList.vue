<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="item in friendsList" :key="item._id">
        <v-card class="d-flex justify-space-between align-center">
          <div class="ml-2 d-flex align-center">
            <div class="imgWrapper">
              <img
                class="friendsA"
                :class="item.isonline ? '' : 'imgGrey'"
                :src="item.avatar.url"
              />
            </div>
            <!-- <v-avatar>
              <img :src="item.avatar.url" />
            </v-avatar> -->
            <div class="nick text-center ml-2">
              {{ item.nick }}
            </div>
          </div>
          <v-btn @click="sendMessage(item)" color="primary mr-2" small>
            <v-icon small left>mdi-email</v-icon>
            <span>发消息</span>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getFriendsList } from "network/chat/test";

export default {
  data() {
    return {
      // 保存好友列表
      friendsList: [],
      marginLeftArr: [],
    };
  },
  updated() {
    const nodeArr = document.querySelectorAll(".friendsA");
    // 摆好朋友的头像
    this.moveFriendsAvatar(nodeArr, this.marginLeftArr);
  },
  methods: {
    // 网络请求
    // 获取好友列表
    async getFriendsListPut() {
      const { data: res } = await getFriendsList();
      if (res.status !== 1) return;
      this.friendsList = res.friendsList;
      this.marginLeftArr = [];
      this.friendsList.forEach((item, index) => {
        this.marginLeftArr.push(item.avatar.marginLeft);
      });
      console.log(this.friendsList);
    },

    // 事件监听方法
    sendMessage(node) {
      this.$router.push({
        name: "sendMessage",
        query: {
          username: node.username,
        },
      });
    },

    // 定义一个方法, 将所有的图片都显示正确
    moveFriendsAvatar(nodeArr, marginArr) {
      console.log(marginArr);
      console.log(nodeArr);
      nodeArr.forEach((item, index) => {
        item.style.marginLeft = marginArr[index] * 100 + "%";
      });
    },
  },
  created() {
    this.getFriendsListPut();
  },
};
</script>

<style lang='less' scoped>
.imgWrapper {
  width: 48px;
  height: 48px;
  overflow: hidden;
  position: relative;
  img {
    height: 48px;
    width: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>