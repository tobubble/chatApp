<template>
  <v-container class="home" ref="home">
    <tool-bar></tool-bar>
    <nav-bar></nav-bar>
    <router-view> </router-view>
  </v-container>
</template>

<script>
import NavBar from "components/NavBar";
import ToolBar from "components/ToolBar";
import { getFriendsMSG, minusBadge } from "network/chat/test";
export default {
  components: {
    NavBar,
    ToolBar,
  },
  created() {
    const myUsername = JSON.parse(window.sessionStorage.getItem("userInfo"))
      .username;
    const that = this;
    // 监听别人发过来的消息
    this.$socket.on("getMessage", (data) => {
      // 判断当前的路由是什么
      const routerUsername = this.$route.query.username;
      // 如果是当前页面跟我发消息的人说的，我就自己的徽章自减
      if (routerUsername === data.username) {
        // 发出请求自减徽章， 保证服务端和客户端的数据一样
        minusBadge({
          fromUsername: myUsername,
          toUsername: routerUsername,
        }).then((res) => {
          console.log(res);
        });
      } else {
        // 将消息徽章自加
        that.$store.commit("changeMsgBadge");
      }
    });

    this.$socket.on("loginRepite", () => {
      that.$store.commit("change", {
        text: "账号被登录，强制下线",
        color: "error",
        timeout: 800,
      });
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("userInfo");
      // 重新连接客户端和服务端，以便于登录其他账号的时候能够不使用当前的 chatid
      that.$socket.disconnect();
      that.$socket.connect();
      that.$router.push("/login");
    });
  },
};
</script>

<style lang='less' scoped>
.home {
  height: 100%;
}
</style>