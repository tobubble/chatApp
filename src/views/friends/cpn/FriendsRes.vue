<template>
  <v-container>
    <v-row>
      <v-col cols="6" md="3" sm="4" v-for="item in friendsRes" :key="item._id">
        <v-card
          @click.stop="messagePre(item.validataMSG, item)"
          :color="item.is_read !== true ? 'white lighten-1' : 'grey lighten-1'"
          class="pt-2 d-flex flex-column"
        >
          <!-- <v-card-title>{{ item.nick }}</v-card-title> -->
          <div class="imgWrapper align-self-center">
            <img class="friendsA" :src="item.avatar.url" />
          </div>
          <!-- <v-avatar rounded="circle" class="align-self-center" size="50">
            <img :src="item.avatar.url" />
          </v-avatar> -->

          <div class="nick subtitle-2 mx-2 mt-2 mb-1">
            昵称: {{ item.nick }}
          </div>
          <div class="username subtitle-2 mx-2 my-1">
            用户名: {{ item.username }}
          </div>
          <div class="username mx-2 subtitle-2 my-1">时间: {{ item.time }}</div>
          <div class="username mx-2 subtitle-2 my-1">验证消息:</div>
          <div class="username mx-2 subtitle-2 my-1 validate">
            {{ item.validataMSG }}
          </div>
          <div
            class="btnWrapper py-1 d-flex justify-space-around"
            :class="btnBarColor(item.is_agree)"
          >
            <v-btn
              @click.stop="checkTrue(item)"
              small
              icon
              class="primary white--text"
              v-show="item.is_agree == 0"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              v-show="item.is_agree == 0"
              small
              icon
              class="error white--text"
              @click.stop="checkFalse($event, item)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <div v-if="item.is_agree !== 0" class="isTriggle">
              <span v-if="item.is_agree == 1" class="subtitle-2">已接受</span>
              <span v-else-if="item.is_agree == 2" class="subtitle-2"
                >已拒绝</span
              >
              <span v-else class="subtitle-2">已忽略</span>
            </div>
          </div>
        </v-card>
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title> 验证消息 </v-card-title>

            <v-divider></v-divider>
            <div class="dialogMSG">
              {{ msg }}
            </div>
            <v-divider></v-divider>

            <v-card-actions class="d-flex justify-end">
              <v-btn
                v-show="item.is_read === false"
                depressed
                color="primary"
                small
                @click="checkTrue"
                >接受</v-btn
              >
              <v-btn
                depressed
                color="red"
                class="white--text"
                small
                @click="loginOut"
                >退出</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getFriendsRes } from "network/chat/test";
import { getBadge } from "network/chat/test";
export default {
  data() {
    return {
      // 好友请求列表
      friendsRes: [],
      marginLeftArr: [],
      dialog: false,
      // 对话框的消息
      msg: "",
    };
  },
  updated() {
    const nodeArr = document.querySelectorAll(".friendsA");
    // 摆好朋友的头像
    this.moveFriendsAvatar(nodeArr, this.marginLeftArr);
  },
  methods: {
    // 网络请求方法
    // 请求获取好友邀请数据
    async getFriendsResPut() {
      let userInfo = window.sessionStorage.getItem("userInfo");
      const id = JSON.parse(userInfo).id;
      const { data: res } = await getFriendsRes(id);
      console.log(res);
      if (res.status !== 1) return;
      if (res.list == []) return;
      res.list.forEach((item) => {
        const timeArr = item.time.split("-");
        const day = timeArr[2].split("T")[0];
        item.time = timeArr[0] + "/" + timeArr[1] + "/" + day;
      });
      // const timeArr = res.list[0].time.split("-");
      // const day = timeArr[2].split("T")[0];
      // res.list[0].time = timeArr[0] + "/" + timeArr[1] + "/" + day;
      if (res.status !== 1) return;
      this.friendsRes = res.list;
      this.marginLeftArr = [];
      this.friendsRes.forEach((item, index) => {
        this.marginLeftArr.push(item.avatar.marginLeft);
      });
    },

    // 事件监听方法
    // 监听接受按钮的点击
    checkTrue(node) {
      const that = this;
      node.is_agree = 1;
      node.is_read = true;
      // 通过 socket 来将好友接受的消息发送
      console.log(this.$socket.id);
      this.$socket.emit("acceptFriend", {
        fromChatid: this.$socket.id,
        toUsername: node.username,
      });
      // 监听什么时候将添加好友成功了，这时候刷新数据列表
      that.$store.commit("badgeMinus");
    },
    // 监听拒绝按钮的点击
    checkFalse(event, node) {
      event.preventDefault()
      console.log(event)
      node.is_agree = 2;
      node.is_read = true;
    },
    // 监听对话框出现事件
    messagePre(msg, item) {
      this.msg = msg;
      this.item = item;
      this.dialog = true;
    },
    // 监听对话框的退出
    loginOut() {
      this.msg = "";
      this.dialog = false;
    },

    // 自定义事件
    // 定义一个方法, 将所有的图片都显示正确
    moveFriendsAvatar(nodeArr, marginArr) {
      nodeArr.forEach((item, index) => {
        item.style.marginLeft = marginArr[index] * 100 + "%";
      });
    },
  },

  created() {
    this.getFriendsResPut();
  },
  computed: {
    // 根据不同的状态选择不同的显示颜色
    btnBarColor() {
      return function (state) {
        switch (state) {
          case 0:
            return "white";
            break;
          case 1:
            return "success";
            break;
          case 2:
            return "error";
            break;
          case 3:
            return "warning";
        }
      };
    },
  },
};
</script>

<style lang='less' scoped>
.imgWrapper {
  width: 48px;
  height: 48px;
  border-radius: 50% !important;
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

.validate {
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialogMSG {
  min-height: 100px;
  max-height: 250px;
  padding: 8px;
}
</style>