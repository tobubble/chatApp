<template>
  <div id="friends">
    <div class="d-flex justify-space-between">
      <v-badge
        color="error"
        bordered
        overlap
        :value="this.$store.state.badgeMessage"
        :content="this.$store.state.badgeMessage"
      >
        <v-btn
          @click="showFriendsRes"
          elevation="4"
          outlined
          small
          color="primary"
          class="pink--text"
          >待回复的好友邀请</v-btn
        >
      </v-badge>
      <v-btn elevation="4" outlined small color="warning">发出的好友邀请</v-btn>
    </div>
    <router-view ref="hhh"></router-view>
  </div>
</template>

<script>
import { getFriendsRes } from "network/chat/test";
export default {
  data() {
    return {};
  },

  methods: {
    // 事件监听方法
    // 监听待回复好友邀请按钮的点击
    showFriendsRes() {
      if (this.$route.fullPath === "/friends/friendsRes") {
        this.$refs.hhh.getFriendsResPut();
      } else if (this.$route.fullPath === "/friends/friendsList") {
        this.$refs.hhh.getFriendsListPut();
      }
      this.$router.push("/friends/friendsRes");
    },
  },
};
</script>

<style lang='less' scoped>
</style>