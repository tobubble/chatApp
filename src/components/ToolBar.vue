<template>
  <div>
    <v-app-bar app bottom dense flat>
      <v-row no-gutters>
        <v-col class="d-flex justify-center">
          <v-badge
            color="error"
            :value="this.$store.state.msgBadge"
            :content="this.$store.state.msgBadge"
            bordered
            overlap
          >
            <v-btn
              @click="showMSG"
              outlined
              small
              to="/message"
              active-class="select"
              text
            >
              <v-icon small left>mdi-message</v-icon>
              <div>消息</div>
            </v-btn>
          </v-badge>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-badge
            color="error"
            :value="this.$store.state.badgeMessage"
            :content="this.$store.state.badgeMessage"
            bordered
            overlap
          >
            <v-btn small outlined to="/friends" active-class="select" text>
              <v-icon small left>mdi-account</v-icon>
              <div>好友</div>
            </v-btn>
          </v-badge>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn outlined small to="/space" active-class="select" text>
            <v-icon small left>mdi-earth</v-icon>
            <div>动态</div>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  methods: {
    // 监听消息按钮的点击
    showMSG() {
      // console.log(this.$route.)
      if (this.$route.fullPath === "/message/MessageList") {
        return this.$bus.$emit("getMSG");
      }
    },
  },
};
</script>

<style lang='less' scoped>
.select {
  background: #67ebff;
}

.bgSelect {
  background: #5dd3e5;
}
</style>