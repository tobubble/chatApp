<template>
  <div class="messageList">
    <v-row>
      <v-col
        v-show="item.friendsMSG[item.friendsMSG.length - 1]"
        cols="12"
        v-for="item in friendsList"
        :key="item.username"
      >
        <v-card class="d-flex align-center" @click="friendsClick(item)">
          <!-- <v-avatar tile>
            <img :src="item.avatar.url" />
          </v-avatar> -->
          <div class="friendsAvatar">
            <img class="friendsA" :class="item.isonline ? '' : 'imgGrey'" @click="hhh(item)" :src="item.avatar.url" />
          </div>
          <div class="d-flex flex-column ml-2 chatContentWrapper">
            <div class="caption font-weight-bold">{{ item.nick }}</div>
            <div class="chatContent">
              {{ item.friendsMSG[item.friendsMSG.length - 1].message || `空` }}
            </div>
          </div>
          <v-btn
            fab
            x-small
            depressed
            v-show="item.newMSGCount"
            class="mr-2 red white--text"
            >{{ item.newMSGCount }}</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getFriendsList, minusBadge } from "network/chat/test";
export default {
  data() {
    return {
      friendsList: {},
      marginLeftArr: [],
    };
  },
  created() {
    const that = this;
    this.getFriendsListPut();
    this.$bus.$on("getMSG", function () {
      that.getFriendsListPut();
    });
    this.$socket.on("getMessage", () => {
      this.getFriendsListPut();
    });
  },
  updated() {
    const nodeArr = document.querySelectorAll(".friendsA");
    console.log(nodeArr);
    // 摆好朋友的头像
    this.moveFriendsAvatar(nodeArr, this.marginLeftArr);
  },
  methods: {
    // 请求消息列表
    async getFriendsListPut() {
      const { data: res } = await getFriendsList();
      if (res.status !== 1) return;
      res.friendsList = res.friendsList.filter((item) => {
        return item.friendsMSG.length != 0;
      });
      this.friendsList = res.friendsList;
      this.marginLeftArr = []
      this.friendsList.forEach((item, index) => {
        this.marginLeftArr.push(item.avatar.marginLeft);
      });
      console.log(this.friendsList);
    },
    // 时间监听方法
    // 监听朋友卡片的点击
    friendsClick(item) {
      const myUsername = JSON.parse(window.sessionStorage.getItem("userInfo"))
        .username;
      this.$router.push({
        query: {
          username: item.username,
        },
        name: "sendMessage",
      });

      if (!item.newMSGCount) return false;
      // 发送请求, 减少响应数量的 badge
      minusBadge({
        toUsername: item.username,
        fromUsername: myUsername,
        count: item.newMSGCount,
      });
      this.$store.commit("badgeMsgMinus", item.newMSGCount);
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
};
</script>

<style lang='less' scoped>
.chatContentWrapper {
  width: 80%;
}

.chatContent {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
}

.friendsAvatar {
  width: 48px;
  height: 48px;
  overflow: hidden;
  position: relative;

  img {
    height: 48px;
    width: auto;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
}
</style>