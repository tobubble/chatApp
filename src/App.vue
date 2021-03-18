<template>
  <v-app id="app">
    <v-main>
      <snack-bar></snack-bar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { getUserList } from "network/chat/test.js";

export default {
  name: "App",

  data: () => ({}),
};
</script>

<style lang="less" scoped>
#app /deep/ .v-application--wrap {
  min-height: 100%;
}
</style>
