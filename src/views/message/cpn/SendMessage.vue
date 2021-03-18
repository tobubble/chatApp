<template>
  <div class="chatContentWrapper">
    <v-btn @click="goBackClick" icon color="grey" class="backArr" small
      ><v-icon> mdi-backburger</v-icon></v-btn
    >
    <v-container class="chatContent pa-2" ref="chatContentWrapper">
      <v-row no-gutters ref="chatRow">
        <v-col
          class="mt-4 d-flex"
          v-for="item in friendsMSG"
          :key="item._id"
          cols="12"
          :class="item.username !== username ? 'justify-end' : 'justify-start'"
        >
          <v-card class="cardMesage"
          :class="item.username !== username ? 'grey lighten-3' : ''"
          >
            <div
              class="d-flex"
              :class="
                item.username !== username ? 'flex-row-reverse' : 'flex-row'
              "
            >
              <div class="imgWrapper">
                <img class="friendsA" :src="item.avatar.url" />
              </div>
              <!-- <v-avatar>
                <img :src="item.avatar.url" />
              </v-avatar> -->
              <div class="d-flex flex-column content1">
                <div
                  class="caption font-weight-bold ml-2"
                  :class="
                    item.username !== username ? 'align-self-end' : 'flex-row'
                  "
                >
                  {{ item.nick }}
                </div>
                <div class="chatContentBox ml-2">{{ item.message }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <div class="ScrollIntoView" ref="ScrollIntoView"></div>
    </v-container>

    <!-- <div class="inputForm">

    </div> -->
    <v-form class="inputForm d-flex mb-2" ref="inputForm">
      <v-textarea
        @input="textareaInput()"
        class="textareainput white mx-2"
        bakground-color="#bfa"
        outlined
        dense
        auto-grow
        rows="1"
        v-model="inputMessage"
        @keydown.enter="inputEnter"
      >
        <template v-slot:message>
          <div v-attr="message"></div>
        </template>
      </v-textarea>
      <v-btn
        class="sendMessageBtn mr-2 align-self-center"
        small
        @click="sendMessageHandle"
        >发送</v-btn
      >
    </v-form>
  </div>
</template>

<script>
import { getFriendsMSG, minusBadge } from "network/chat/test";

// 获取到聊天内容
export default {
  data() {
    return {
      // 保存和别人的聊天的 username
      username: "",
      // 聊天的内容
      friendsMSG: [],
      // 输入框的内容
      inputMessage: "",
      // 默认输入框的高度为: 40px
      inputHeightData: null,
      inputHeightDataCopy: null,
      // 保存默认的
      scrollBar: null,
      scrollBarCopy: null,
      // 保存滚动的锚点
      scrollIntoView: "",
      // flag 表示调用锚点没有
      // aFlag: false,
      marginLeftArr: [],
    };
  },
  methods: {
    // 网络请求方法
    // 请求获取聊天内容
    async getFriendsMSGPut() {
      const { data: res } = await getFriendsMSG(this.username);
      // console.log(res)
      if (res.status !== 1) return;
      this.friendsMSG = res.friendsMSG;
      // 将消息栏放到最下面
      this.$nextTick(() => {
        this.scrollIntoView.scrollIntoView();
      });
      this.marginLeftArr = [];
      this.friendsMSG.forEach((item, index) => {
        this.marginLeftArr.push(item.avatar.marginLeft);
      });
      console.log(this.friendsMSG);
    },
    // 事件监听方法
    // 监听发送按钮的点击
    sendMessageHandle() {
      const that = this;
      // 判断当前的内容是否为空
      if (this.inputMessage === "") return false;

      // 向服务器发送发送消息的事件
      this.$socket.emit("sendMSG", {
        content: this.inputMessage,
        fromChatid: this.$socket.id,
        toUsername: this.username,
      });
      // 清空输入框的内容
      this.inputMessage = "";
      // 还原输入框和滚动框的的高度
      console.log(this.scrollBarCopy);
      this.$refs.chatContentWrapper.style.height = this.scrollBarCopy + "px";
      this.inputHeightData = this.inputHeightDataCopy;
    },
    // 监听返回按钮的点击
    goBackClick() {
      // console.log('hhh')
      this.$router.go(-1);
    },

    // 更新自己屏幕上的消息事件的数组数据

    // 监听输入框的输入
    textareaInput() {
      setTimeout(() => {
        // 获取滚动条元素的高度
        let barHeight = this.$refs.chatContentWrapper.clientHeight;
        // console.log(barHeight);
        // let barHeight = this.$refs.chatContentWrapper.getComputedS
        // 获取当前的输入框的高度
        let inputHeight = this.$refs.inputForm.$el.clientHeight;
        if (inputHeight > this.inputHeightData) {
          this.$refs.chatContentWrapper.style.height =
            barHeight - (inputHeight - this.inputHeightData) + "px";
          this.inputHeightData = inputHeight;
        } else if (inputHeight < this.inputHeightData) {
          this.$refs.chatContentWrapper.style.height =
            barHeight + (this.inputHeightData - inputHeight) + "px";
          this.inputHeightData = inputHeight;
        }
      });
    },
    // 监听 enter 键的输入
    inputEnter(e) {
      e.preventDefault();
      this.sendMessageHandle();
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
    const that = this;
    this.username = this.$route.query.username;
    this.getFriendsMSGPut();
  },
  mounted() {
    const that = this;
    // 得到 锚点
    this.scrollIntoView = this.$refs.ScrollIntoView;
    // 保存当前输入框和滚动框的高度
    this.inputHeightData = this.$refs.inputForm.$el.clientHeight;
    this.inputHeightDataCopy = this.$refs.inputForm.$el.clientHeight;
    this.scrollBar = this.$refs.chatContentWrapper.clientHeight;
    this.scrollBarCopy = this.$refs.chatContentWrapper.clientHeight;
    console.log(this.scrollBarCopy);

    // 监听别人发过来的消息
    this.$socket.on("getMessage", (data) => {
      // 监听服务器发来的消息
      // 如果服务器发来消息更新当前的界面
      that.getFriendsMSGPut();
    });

    // 监听自己发出的消息成功
    this.$socket.on("getMessageFrom", (data) => {
      // 监听服务器发来的消息
      // 如果服务器发来消息更新当前的界面
      that.getFriendsMSGPut();
    });
  },
  updated() {
    const nodeArr = document.querySelectorAll(".friendsA");
    // 摆好朋友的头像
    this.moveFriendsAvatar(nodeArr, this.marginLeftArr);
  },
};
</script>

<style lang='less' scoped>
.chatContentWrapper {
  border: 1px solid #aaa;
  position: relative;
  // width: 100%;
  // height: 100%;
  // height: calc(100% - 200px);
  // overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
  .chatContent {
    // padding-bottom: 10px;
    height: calc(100vh - 180px);
    overflow-y: scroll;
    // position: fixed;
    // height: 100%;
    // padding-bottom: 100px;
    // margin-bottom: 55px;
    // flex-grow: 0;
  }
}

.textareainput /deep/ .v-text-field__details {
  display: none;
}

.textareainput /deep/ .v-input__slot {
  margin: 0;
  // overflow-y: visible;
  // max-height: 60px;
}

// .textareainput /deep/ textarea {
//   // margin-top: 0 !important;
//   // height: 100%;
//   // padding: 2px 0 !important;
//   line-height: 16px;
// }

// .sendMessageBtn {
//   position: absolute;
// }
.chatContentBox {
  font-size: 14px;
  flex: 1;
  overflow-wrap: break-word;
  // width: 100%;
}

.content1 {
  overflow: hidden;
  // width: 100%;
}

.imgWrapper {
  width: 48px;
  height: 48px;
  border-radius: 50% !important;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  img {
    height: 48px;
    width: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.ScrollIntoView {
  display: fixed;
  bottom: 0;
}

.backArr {
  position: fixed;
  right: 55px;
  top: 10px;
  z-index: 9999;
}

.cardMesage {
  width: calc(100% - 50px);
}
</style>
