<template>
  <div class="text-center">
    <v-snackbar
      class="text-center snackBar"
      :color="snackOption.color"
      :timeout="snackOption.timeout"
      absolute
      top
      v-model="snackOption.visible"
      text
    >
      {{ snackOption.text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    snackOption() {
      return this.$store.state.snackOption;
    },
  },
};
</script>

<style lang='less' scoped>
.text-center /deep/ .v-snack__wrapper {
  min-width: 150px;
  min-height: 38px;
}

.text-center /deep/ .v-snack__content {
  width: 160px;
  height: 35px;
  line-height: 38px;
  padding: 0;
  text-align: center;
  font-size: 12px;
}
</style>