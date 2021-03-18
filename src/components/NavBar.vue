<template>
  <div class="nav-bar">
    <v-app-bar dense flat app>
      <!-- width="sm-60" -->
      <div class="user-avatar" @click="drawer = !drawer">
        <img
          v-if="this.userInfo"
          class="userInfoImg changeImg"
          :src="userInfo.avatar.url"
        />
      </div>
      <!-- <v-avatar class="user-avatar" size="38" @click="drawer = !drawer">
        <img class="userInfoImg" :src="userInfo.avatar.url" />
        <img src="http://192.168.0.105:3000/images/tokisaki3.png" />
      </v-avatar> -->
      <v-toolbar-title class="ml-4 body-2">我们聊天吧！</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
        v-model="angleVisible"
        nudge-bottom="8"
        offset-y
        class="menu-list"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="addClick"
            class="addBTN"
            color="grey"
            icon
            dark
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
            <div class="angle" :class="{ angleVisible: angleVisible }"></div>
          </v-btn>
        </template>
        <v-list dense class="pa-0">
          <v-list-item @click="searchFriends" class="px-2">
            <v-list-item-icon class="mr-2">
              <v-icon small right>mdi-heart</v-icon>
            </v-list-item-icon>
            <v-list-item-title>添加好友</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      class="f-grow-1 d-relative drawer"
      v-model="drawer"
      app
    >
      <div class="d-flex flex-column align-center mt-3">
        <div class="bigAvatarWrapper">
          <img class="bigAvatar changeImg" :src="userInfo.avatar.url" />
        </div>
        <!-- <v-avatar size="70">
          <img class="bigAvatar" :src="userInfo.avatar.url" alt="" />
        </v-avatar> -->

        <span class="mt-4 subtitle-2 font-weight-bold">{{
          userInfo.nick
        }}</span>

        <!-- 上传图片按钮 -->
        <div class="uploadBox mt-3">
          <v-btn small class="upload_btn">
            <input
              ref="uploadFile"
              @change="fileSelected"
              class="upload_file"
              type="file"
            />
            <span class="imgValue"> {{ inputValue }} </span>
          </v-btn>
          <!-- dialogVisible -->
          <v-dialog
            persistent
            v-model="dialogVisible"
            width="500"
            class="imgDialog"
          >
            <!-- v-show="imgFile" -->
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-show="preViewVisible"
                retain-focus-on-click
                v-bind="attrs"
                v-on="on"
                small
                class="preView ml-4"
                @click="preViewClick"
              >
                预览
              </v-btn>
            </template>

            <v-card class="imgCard">
              <v-card-title class="headline grey lighten-2">
                图片预览
              </v-card-title>

              <div
                @mousedown="imgEnter"
                @touchstart="imgTouchStartADown"
                ref="imgWrapperA"
                class="markContainer"
              >
                <img
                  ref="avatarPre"
                  :src="imgBase64"
                  class="avatarPreviewImg"
                />
                <div ref="maskLeft" class="markOuterLeft"></div>
                <div class="markInner" ref="markInner"></div>
                <div class="markOuterRight"></div>
              </div>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="avatarConfirm">
                  确定
                </v-btn>
                <v-btn color="primary" text @click="avatarDisConfirm">
                  取消
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
      <div class="d-flex justify-center loginout">
        <v-btn
          @click="loginOut"
          text
          outlined
          class="blue--text accent-3 grey lighten-2"
          >退出登录</v-btn
        >
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { avatar, uLoginout } from "network/chat/test";
export default {
  data() {
    return {
      drawer: false,
      userInfo: "",
      // 控制三角形的显示
      angleVisible: false,
      // 保存图片的路径
      imgFile: null,
      // 控制对话框的显示与消失
      dialogVisible: false,
      // preViewVisible
      preViewVisible: false,
      // 预览图片的 base64 编码
      imgBase64: "",
      // 预览图片的格式
      imgType: "",
      // 记录点击的图片
      imgRef: "",
      // 记录鼠标的点击开始点 X 标
      originX: "",
      // 记录鼠标点击开始的 y 标
      originY: "",
      // 记录鼠标是否在点击中
      isMouseDown: false,
      // 记录当前图片的 margin 值为多少
      imgMargin: 0,
      // 记录card框相对视口的定位
      toWindowLeft: 0,
      toWindowTop: 0,
      // 记录图片的margin百分比
      marginForm: 0,
      // 记录图片初始在阴影部分的宽度
      imgShadowWidth: 0,
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.avatarMove();
  },
  // updated() {
  //   this.avatarMove();
  // },
  methods: {
    // 自定义方法
    getUserInfo() {
      const userStr = window.sessionStorage.getItem("userInfo");
      this.userInfo = JSON.parse(userStr);
      console.log(this.userInfo);
    },

    // 事件监听方法
    // 监听退出登录的点击
    loginOut() {
      // 发出退出登录的请求
      this.uLoginoutPut();
    },
    // 监听添加好友按钮的点击
    addClick() {
      this.angleVisible = !this.angleVisible;
    },
    // 监听添加好友的点击
    searchFriends() {
      this.$router.push("/addFriends");
    },
    // 监听图片文件上传成功事件(文件的选择成功)
    fileSelected() {
      const that = this;
      // 获取 upload 元素
      const uploadFile = this.$refs.uploadFile;
      if (uploadFile.files === []) return false;
      // 获取选取的文件路径
      const selectedFile = uploadFile.files[0];
      // 判断当前的文件是否是图片文件
      if (
        selectedFile.type !== "image/png" &&
        selectedFile.type !== "image/gif" &&
        selectedFile.type !== "image/jpg" &&
        selectedFile.type !== "image/jpeg"
      ) {
        return (this.imgFile = "请选择 jpg/png/gif 文件");
      }
      this.imgType = selectedFile.type.replace(/^image\//, "");
      this.preViewVisible = true;
      this.imgFile = selectedFile.name;
      // 获取 fileReader api 对象
      const reader = new FileReader();
      console.log(reader);
      // reader 对象初始化完成之后调用这个
      reader.onload = function (e) {
        console.log(e);
        // 得到 base64 编码
        const data = e.target.result;
        // 赋值 base64编码
        that.imgBase64 = data;
      };
      // 这个方法是异步的, 当这个方法完成了之后就会调用上面的 onload 方法, 上面的 e 也是这里的 selectedFile
      reader.readAsDataURL(selectedFile);
    },
    // 监听图片的确定事件
    avatarConfirm() {
      // const { data }
      this.dialogVisible = false;
      this.avatarPut();
      // this.$refs
      // this.$socket.emit('changeAvatar', )
    },
    // 监听选取图片取消
    avatarDisConfirm() {
      // 重置上传按钮的点击 和 预览的消失
      this.imgFile = "";
      // 重置 Input 的 value 值, 防止选中同一张图片的时候为重新选择
      this.$refs.uploadFile.value = "";
      this.preViewVisible = false;
      // 还原图片的位置
      this.$refs.avatarPre.style.marginLeft = 0;
      this.dialogVisible = false;
    },
    // 监听图片的点击事件
    imgEnter(event) {
      // 判断当前点击的对象是否是 img
      if (event.target !== this.$refs.avatarPre) return false;
      // 得到图片的引用
      this.imgRef = this.$refs.avatarPre;
      // 得到鼠标的点击的 clinetX 和 clientY(相对于浏览器视口的距离)
      this.originX = event.clientX || event.touches[0].clientX;
      // 得到鼠标的相对于浏览器 y 方向的位置
      this.originY = event.clientY || event.touches[0].clientY;
      // 将当前的状态改变为 true
      this.isMouseDown = true;

      // 初始化元素相对视口的宽度
      // this.toWindowLeft = 0;
      // this.toWindowTop = 0;
      // 获取图片容器对于视口的距离
      // this.getOffsetLeftWindow(this.$refs.markInner);
      // console.log(this.toWindowLeft,this.toWindowTop);

      // 除了递归，下面这种方法更加方便 Obj 中返回的是这个元素的 width ， height ， 和相对于左上角的四个边的位置
      const Obj = this.$refs.markInner.getBoundingClientRect();
      // 但是上面这个方法自己实测的时候发现与上面的自己用递归计算出来的数值有 1.5 个像素的差异，原因尚未知道
      // 自己递归计算出来的 应该比这个精确， 下面由于这个方法计算的不精确，我适当调整了判断的范围

      // 给 img 绑定 mousemove 事件
      this.imgRef.onmousemove = (e) => {
        // 判断当前的状态
        if (!this.isMouseDown) return false;
        e.preventDefault();
        // 记录移动过程中的鼠标的坐标
        const eventX = e.clientX || event.touches[0].clientX;
        const eventY = e.clientY || event.touches[0].clientY;
        // 计算出鼠标移动的距离
        const moveX = eventX - this.originX;
        const moveY = eventY - this.originY;
        /*
          计算出图片左侧在阴影部分的面积
        */
        // 计算图片的宽度
        const imgWidth = this.imgRef.offsetWidth;
        this.imgShadowWidth = (imgWidth - 200) / 2;

        // 移动图片的位置
        this.imgRef.style.marginLeft = this.imgMargin + moveX + "px";

        // 判断图片是否移除的位置超过了阴影部分
        if (this.imgMargin + moveX >= this.imgShadowWidth) {
          this.imgRef.style.marginLeft = this.imgShadowWidth + "px";
          // 记录当前的 margin 值
          this.imgMargin = this.imgShadowWidth;
          // 计算出来图片的百分比
          this.marginForm = this.imgMargin / 200;
          console.log(this.imgMargin);
        } else if (this.imgMargin + moveX <= -this.imgShadowWidth) {
          this.imgRef.style.marginLeft = -this.imgShadowWidth + "px";
          // 记录当前的 margin 值
          this.imgMargin = -this.imgShadowWidth;
          this.marginForm = this.imgMargin / 200;
          console.log(this.imgMargin);
        }

        // 判断鼠标是否超过了左右两侧的边框
        if (
          e.clientX >= Obj.right - 5 ||
          e.clientX <= Obj.left + 5 ||
          e.clientY >= Obj.bottom - 5 ||
          e.clientY <= Obj.top + 5
        ) {
          // 记录当前的图片的 margin 值为多少
          this.imgMargin = parseInt(
            window.getComputedStyle(this.imgRef).marginLeft
          );
          this.marginForm = this.imgMargin / 200;
          console.log(this.imgMargin);
          this.isMouseDown = false;
        }
      };
      // 给 img 绑定鼠标的松开事件
      this.imgRef.onmouseup = (e) => {
        console.log("mouseup");
        // 判断当前的状态
        if (!this.isMouseDown) return false;
        // 记录当前的图片的 margin 值为多少
        this.imgMargin = parseInt(
          window.getComputedStyle(this.imgRef).marginLeft
        );
        this.isMouseDown = false;
        this.marginForm = this.imgMargin / 200;
        console.log(this.imgMargin);
      };
    },
    // 监听图片的 touchStart 事件
    imgTouchStartADown() {
      console.log(event);
      // 判断当前点击的对象是否是 img
      if (event.target !== this.$refs.avatarPre) return false;
      // 得到图片的引用
      this.imgRef = this.$refs.avatarPre;
      // 得到鼠标的点击的 clinetX 和 clientY(相对于浏览器视口的距离)
      this.originX = event.clientX || event.touches[0].clientX;
      // 得到鼠标的相对于浏览器 y 方向的位置
      this.originY = event.clientY || event.touches[0].clientY;
      // 将当前的状态改变为 true
      this.isMouseDown = true;
      this.imgRef.ontouchmove = (e) => {
        // 判断当前的状态
        if (!this.isMouseDown) return false;
        e.preventDefault();
        // 记录移动过程中的鼠标的坐标
        const eventX = e.clientX || event.touches[0].clientX;
        const eventY = e.clientY || event.touches[0].clientY;
        // 计算出鼠标移动的距离
        const moveX = eventX - this.originX;
        const moveY = eventY - this.originY;
        /*
          计算出图片左侧在阴影部分的面积
        */
        // 计算图片的宽度
        const imgWidth = this.imgRef.offsetWidth;
        this.imgShadowWidth = (imgWidth - 200) / 2;

        // 移动图片的位置
        this.imgRef.style.marginLeft = this.imgMargin + moveX + "px";

        // 判断图片是否移除的位置超过了阴影部分
        if (this.imgMargin + moveX >= this.imgShadowWidth) {
          this.imgRef.style.marginLeft = this.imgShadowWidth + "px";
          // 记录当前的 margin 值
          this.imgMargin = this.imgShadowWidth;
          this.marginForm = this.imgMargin / 200;
          console.log(this.imgMargin);
        } else if (this.imgMargin + moveX <= -this.imgShadowWidth) {
          this.imgRef.style.marginLeft = -this.imgShadowWidth + "px";
          // 记录当前的 margin 值
          this.imgMargin = -this.imgShadowWidth;
          this.marginForm = this.imgMargin / 200;
          console.log(this.imgMargin);
        }
      };
      // 给 img 绑定鼠标的松开事件
      this.imgRef.ontouchend = (e) => {
        console.log("mouseup");
        // 判断当前的状态
        if (!this.isMouseDown) return false;
        // 记录当前的图片的 margin 值为多少
        this.imgMargin = parseInt(
          window.getComputedStyle(this.imgRef).marginLeft
        );
        this.isMouseDown = false;
        this.marginForm = this.imgMargin / 200;
        console.log(this.imgMargin);
      };
    },
    // 监听预览按钮的点击
    preViewClick() {},
    // 网络请求方法
    // 请求 上传头像图片
    async avatarPut() {
      const { data: res } = await avatar(
        this.imgBase64,
        this.imgType,
        this.marginForm.toFixed(2)
      );
      this.$refs.avatarPre.style.marginLeft = 0;
      console.log(res);
      const imgUrl = res.data;
      console.log(imgUrl);
      this.userInfo.avatar = imgUrl;
      const result = JSON.parse(window.sessionStorage.getItem("userInfo"));
      result.avatar = imgUrl;
      window.sessionStorage.setItem("userInfo", JSON.stringify(result));
      // 重置上传按钮的点击 和 预览的消失
      this.imgFile = "";
      this.preViewVisible = "";
      this.$refs.uploadFile.value = "";
      this.getUserInfo();
      this.avatarMove();
    },
    // 退出登录请求
    async uLoginoutPut() {
      const { data: res } = await uLoginout();
      if (res.status !== 1) {
        return this.$store.commit("change", {
          text: "退出失败",
          color: "error",
          timeout: 800,
        });
      } else {
        this.$store.commit("change", {
          text: "退出成功",
          color: "success",
          timeout: 800,
        });
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("userInfo");
        // 重新连接客户端和服务端，以便于登录其他账号的时候能够不使用当前的 chatid
        this.$socket.disconnect();
        this.$socket.connect();
        this.$router.push("/login");
      }
    },
    // 自定义方法
    // 自定义一个获取当前元素距离时候的宽度的函数
    getOffsetLeftWindow(el) {
      this.toWindowLeft = this.toWindowLeft + el.offsetLeft;
      this.toWindowTop = this.toWindowTop + el.offsetTop;
      if (!el.offsetParent) {
        return;
      }
      this.getOffsetLeftWindow(el.offsetParent);
    },
    // 定义一个方法，将图片移动到正确的位置
    avatarMove() {
      // 修改图片的位置
      const imgArr1 = document.querySelectorAll(".changeImg");
      imgArr1.forEach((item) => {
        item.style.marginLeft = this.userInfo.avatar.marginLeft * 100 + "%";
      });
    },
  },
  computed: {
    inputValue() {
      return this.imgFile ? this.imgFile : "上传头像";
    },
  },
};
</script>

<style lang='less' scoped>
.loginout {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

.angle {
  width: 0;
  height: 0;
  border-right: 6px solid transparent;
  border-top: 6px solid transparent;
  border-bottom: 6px solid #757575;
  border-left: 6px solid transparent;
  position: absolute;
  bottom: -50%;
  transform: translateY(50%);
  display: none;
}

.addBTN {
  position: relative;
}

.angleVisible {
  display: block;
}

.menu-list {
  transform: translateY(12px);
}

.upload_btn {
  position: relative;
}

.upload_file {
  opacity: 0;
  // width: 50px;
  width: 100%;
  position: absolute;
}

.imgCard {
  overflow: hidden;
}

.markContainer {
  display: flex;
  width: 100%;
  height: 200px;
  position: relative;
}

.avatarPreviewImg {
  position: absolute;
  height: 100%;
  width: auto;
  transform: translateX(-50%);
  left: 50%;
  user-select: none;
}

.markOuterLeft {
  flex: 1;
  background: black;
  opacity: 0.5;
}

.markInner {
  width: 200px;
  height: 200px;
}

.markOuterRight {
  flex: 1;
  background: black;
  opacity: 0.5;
}

.imgValue {
  max-width: 110px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // word-break: break-all;
}

.userInfoImg {
  // width: ;
  height: 38px;
  width: auto;
  // margin-left: 10px;
  position: relative;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.bigAvatarWrapper {
  height: 70px;
  width: 70px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.bigAvatar {
  height: 70px;
  width: auto;
}

.drawer {
  height: 100% !important;
}
</style>