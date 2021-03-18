<template>
  <v-container id="login" class="mt-6">
    <v-sheet class="d-flex justify-center mt-12">
      <v-sheet>
        <img src="~assets/img/a.png" class="imgA" />
      </v-sheet>
      <v-sheet class="mt-2">
        <img src="~assets/img/b.png" class="imgB" />
      </v-sheet>
    </v-sheet>

    <v-form class="mt-5" ref="loginForm">
      <v-row no-gutters class="flex-column align-center">
        <v-col cols="9" class="col-sm-5 col-md-4 col-lg-3">
          <v-text-field
          placeholder="用户名"
            ref="loginUsername"
            outlined
            solo
            clearable
            dense
            flat
            validate-on-blur
            v-model="loginForm.username"
            :rules="loginRule.username"
          >
            <template v-slot:prepend-inner>
              <v-icon class="prepend-icon">mdi-account</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="9" class="col-sm-5 col-md-4 col-lg-3">
          <v-text-field
          placeholder="密码"
            outlined
            dense
            flat
            validate-on-blur
            :rules="loginRule.password"
            solo
            prepend-inner-icon="mdi-lock"
            :type="isShowPsd ? 'text' : 'password'"
            v-model="loginForm.password"
            hint="密码长度为 6 - 16个字符之间"
            :append-icon="isShowPsd ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="isShowPsd = !isShowPsd"
          >
            <template v-slot:prepend-inner>
              <v-icon class="prepend-icon">mdi-lock</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="9"
          class="col-sm-5 col-md-4 col-lg-3 d-flex justify-space-between"
        >
          <v-btn @click="loginHandle" text class="loginBtn blue lighten-3"
            >login</v-btn
          >
        </v-col>

        <v-col cols="9" class="mt-10 col-sm-5 col-md-4 col-lg-3">
          <v-dialog v-model="registerDialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined v-on="on" v-bind="attrs" text class="registerBtn"
                >没有用户名？注册我们</v-btn
              >
            </template>

            <v-card>
              <v-card-title class="grey pa-2">注册我们</v-card-title>

              <v-form ref="registerForm" :lazy-validation="false" class="pa-2">
                <v-text-field
                  ref="registerNick"
                  class="mt-2"
                  validate-on-blur
                  :rules="registerRules.nick"
                  label="昵称"
                  v-model="registerForm.nick"
                ></v-text-field>
                <v-text-field
                  ref="registerUsername"
                  validate-on-blur
                  class="mt-2"
                  :rules="registerRules.username"
                  label="账号"
                  v-model="registerForm.username"
                ></v-text-field>
                <v-text-field
                  ref="registerPassword"
                  class="mt-2"
                  validate-on-blur
                  type="password"
                  :rules="registerRules.password"
                  label="密码"
                  v-model="registerForm.password"
                ></v-text-field>

                <div class="d-flex justify-space-around mt-5">
                  <v-btn outlined color="success" @click="registerSBM" small
                    >提交</v-btn
                  >
                  <v-btn
                    outlined
                    color="error"
                    small
                    @click="registerDialog = false"
                    >退出</v-btn
                  >
                  <v-btn outlined color="warning" small @click="registerReset"
                    >重置</v-btn
                  >
                </div>
              </v-form>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { login, register } from "network/login/login";

export default {
  data() {
    return {
      isShowPsd: false,
      loginForm: {
        username: "",
        password: "",
      },
      // 登录的验证规则
      loginRule: {
        username: [
          (v) => !!v || "用户名不能为空",
          (v) => v.length <= 16 || "用户名在 16 个字符以内",
        ],
        password: [
          (v) => !!v || "密码不能为空",
          (v) =>
            (v.length <= 16 && v.length >= 6) || "密码在 6 - 16 个字符以内",
        ],
      },
      // 控制 snackbar 的出现
      visible: false,
      // 保存用户信息
      userInfo: "",
      // 控制登录对话框的弹出
      registerDialog: false,
      // 注册的表单
      registerForm: {
        nick: "",
        username: "",
        password: "",
      },
      // 注册表单的验证规则
      registerRules: {
        nick: [],
        username: [
          (v) => !!v || "用户名不能为空",
          (v) =>
            (v && v.length >= 6 && v.length <= 12) ||
            "用户名在 6 - 12 个字符之间",
        ],
        password: [
          (v) => !!v || "密码不能为空",
          (v) =>
            (v && v.length >= 6 && v.length <= 16) ||
            "密码在 6 - 16 个字符之间",
        ],
      },
    };
  },
  mounted() {
    this.deleteAutoPlay();
  },
  methods: {
    // 网络请求
    // 登录请求
    async loginPut() {
      const { data: res } = await login(this.loginForm).catch((error) => {
        console.log(error);
      });
      if (res.status == 0) {
        this.$store.commit("change", {
          text: "该账号已登录",
          color: "error",
          timeout: 800,
        });
      } else if (res.status !== 1) {
        return this.$store.commit("change", {
          text: "用户名或者密码错误",
          color: "error",
          timeout: 800,
        });
      }
      console.log(res);
      window.sessionStorage.setItem("token", res.token);
      window.sessionStorage.setItem("userInfo", JSON.stringify(res.data));

      // 弹出登陆成功提示
      this.$store.commit("change", {
        text: "登录成功",
        color: "primary",
        timeout: 800,
      });
      this.$socket.emit("login", {
        _id: res.data._id,
      });
      // 初始化当前的 好友和消息的 徽章
      this.$store.commit("setMsgBadge", res.data.messageBadge);
      this.$store.commit("setBadge", res.data.badge);
      this.$router.push("/home");
    },
    async registerPut() {
      const { data: res } = await register(this.registerForm);
      console.log(res);
      if (res.status !== 1) {
        return this.$store.commit("change", {
          text: "账号已存在",
          color: "error",
          timeout: 1200,
        });
      }
      this.$store.commit("change", {
        text: "注册成功",
        color: "success",
        timeout: 1200,
      });
      this.registerDialog = false;
    },

    // 事件监听
    // 监听登录点击
    loginHandle() {
      const valid = this.$refs.loginForm.validate();
      if (!valid) return;
      this.loginPut();
    },
    // 监听表单的提交
    registerSBM() {
      this.registerPut();
    },

    // 自定义方法
    // 重置注册表单
    registerReset() {
      this.$refs.registerForm.reset();
    },
    // 取消用户名的自动补全
    deleteAutoPlay() {
      let username = this.$refs.loginUsername.$el;
      username = username.children[0].children[0].children[2].children[0];
      // console.log(username)
      username.setAttribute("autocomplete", "off");
    },
    //
    hhhhhh() {
      alert("111111111");
    },
  },
  watch: {
    registerDialog(value, prevalue) {
      if (value === true && prevalue === false) {
        this.$nextTick(() => {
          this.registerReset();

          // 取消 input 的自动补全
          let nick = this.$refs.registerNick.$el;
          let username = this.$refs.registerUsername.$el;
          nick = nick.children[0].children[0].children[0].children[1];
          username = username.children[0].children[0].children[0].children[1];
          // console.log(nick.children[0].children[0].children[0].children[1])
          // console.log(username.children[0].children[0].children[0].children[1])
          nick.setAttribute("autocomplete", "off");
          username.setAttribute("autocomplete", "off");
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.imgB {
  width: 80px;
}

.imgA {
  width: 55px;
}

.prepend-icon::before {
  font-size: 18px;
}

.loginBtn {
  width: 100%;
}

.registerBtn {
  width: 100%;
}
</style>