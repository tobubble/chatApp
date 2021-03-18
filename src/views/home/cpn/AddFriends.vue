<template>
  <div id="addFriends">
    <v-form>
      <v-text-field
        ref="searchField"
        hide-details
        placeholder="搜索用户昵称"
        solo
        append-icon="mdi-account-search"
        v-model="searchValue"
        @click:append="search"
      ></v-text-field>
    </v-form>
    <v-alert v-if="!searchData" type="warning" class="pa-0 mt-4"
      >暂无数据，查找用户试试</v-alert
    >
    <v-card v-else class="mt-4">
      <v-list class="pa-0">
        <v-list-item
          class="searchList"
          v-for="item in searchData"
          :key="item._id"
        >
          <div class="imgWrapper">
            <img class="friendsA" :src="item.avatar.url" />
          </div>
          <!-- <v-list-item-avatar>
            <img :src="item.avatar.url" />
          </v-list-item-avatar> -->
          <v-list-item-content>
            <div class="d-flex align-center justify-space-between">
              <v-subheader class="font-weight-bold">{{
                item.nick
              }}</v-subheader>
              <v-btn text class="primary" @click.stop="addFriends(item.nick)"
                >添加好友</v-btn
              >
            </div>
          </v-list-item-content>
        </v-list-item>

        <v-dialog max-width="400" persistent v-model="addFriendsDialog">
          <v-card>
            <v-card-title class="headline"> 验证消息 </v-card-title>
            <v-divider></v-divider>

            <v-form ref="form">
              <v-textarea v-model="textValue"> </v-textarea>
            </v-form>

            <v-card-actions class="d-flex justify-end">
              <v-btn depressed small color="primary" @click="addConfirm"
                >确定</v-btn
              >
              <v-btn depressed small color="red" @click="removeDialog"
                >取消</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { getFriends } from "network/chat/test";

export default {
  data() {
    return {
      // 保存查询参数
      searchValue: "",
      // 保存查询结果
      searchData: "",
      marginLeftArr: [],
      addFriendsDialog: false,
      // 对话框中的验证消息
      textValue: "",
      // 添加好友的昵称
      nick: "",
    };
  },
  mounted() {
    this.removeACPL();
  },
  updated() {
    const nodeArr = document.querySelectorAll(".friendsA");
    // 摆好朋友的头像
    this.moveFriendsAvatar(nodeArr, this.marginLeftArr);
  },
  methods: {
    // 自定义方法
    // 删除输入框的自动补全
    removeACPL() {
      const textField = this.$refs.searchField.$el;
      const child = textField.children[0].children[0].children[0].children[0];
      child.setAttribute("autocomplete", "off");
    },
    // 网络请求方法
    // 查找用户
    async searchFriendsPut() {
      const res = await getFriends(this.searchValue);
      if (!res.status) {
        return this.$store.commit("change", {
          text: "请求失败",
          timeout: 1000,
          color: "red",
        });
      }
      this.searchData = res.data.data;
      this.marginLeftArr = [];
      this.searchData.forEach((item, index) => {
        this.marginLeftArr.push(item.avatar.marginLeft);
      });
    },
    // 时间监听方法
    // 监听搜索按钮的点击
    search() {
      this.searchFriendsPut();
    },
    // 监听添加好友事件的点击
    addFriends(nick) {
      this.nick = nick;
      this.addFriendsDialog = true;
      // this.$socket.emit("addFriends", {
      //   fromChatId: this.$socket.id,
      //   toNick: nick,
      // });
    },
    // 定义一个方法, 将所有的图片都显示正确
    moveFriendsAvatar(nodeArr, marginArr) {
      console.log(marginArr);
      console.log(nodeArr);
      nodeArr.forEach((item, index) => {
        item.style.marginLeft = marginArr[index] * 100 + "%";
      });
    },
    // 移除对话框
    removeDialog() {
      // 重置对话框
      this.$refs.form.reset();

      this.addFriendsDialog = false;
    },
    // 确认验证消息
    addConfirm() {
      const that = this;
      this.$socket.emit("addFriends", {
        fromChatId: this.$socket.id,
        toNick: that.nick,
        message: that.textValue,
      });
      this.$refs.form.reset();
      console.log(this.textValue);
      this.addFriendsDialog = false;
    },
  },
};
</script>

<style lang='less' scoped>
.searchList:nth-of-type(2n) {
  background: rgba(0, 0, 0, 0.1);
}

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