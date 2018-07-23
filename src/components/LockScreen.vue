<template>
    <div style="width: 100%; height: 100%; background: rgb(102, 122, 166);">
        <div class="unlock-con" @click.self="handleCloseInput">
            <transition name="show-unlock">
                <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
                    <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                        <div class="unlock-avator-title">
                            <span>admin</span>
                        </div>
                        <div class="unlock-avator-cover">
                            <i class="fa fa-unlock-alt"></i>
                            <span>解锁</span>
                        </div>
                    </div>
                    <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}">
                        <div class="unlock-avator-under-back-con"></div>
                    </div>
                    <div class="unlock-input-con">
                        <div class="unlock-input-overflow-con">
                            <div class="unlock-overflow-body" :style="{right: inputLeft}">
                                <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
                                <button ref="unlockBtn" :disabled="check" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn">
                                    <i class="fa fa-key"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="unlock-locking-tip-con">已锁定</div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      showUnlock: false,
      avatorLeft: "0px",
      inputLeft: "400px",
      password: "",
      check: false
    };
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
    validator() {
      return true; // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
    },
    handleClickAvator() {
      this.avatorLeft = "-180px";
      this.inputLeft = "0px";
      this.$refs.inputEle.focus();
    },
    handleUnlock() {
      this.check = true;
      this.$http("index/d_member/login", {
        username: this.$store.state.userName,
        password: this.password,
        is_remember: "0"
      })
        .then(res => {
          if (res.status) {
            this.avatorLeft = "0px";
            this.inputLeft = "400px";
            sessionStorage.setItem("locked", false);
            setTimeout(() => {
              this.$router.replace({
                path: "/"
              });
            }, 400);
          } else {
            this.$message.error(res.message);
          }
          this.check = false;
        })
        .catch(() => {
          this.check = false;
        });
      /* if (this.validator()) {
        this.avatorLeft = "0px";
        this.inputLeft = "400px";
        this.password = "";
        sessionStorage.setItem("locked", false);
      } else {
        this.$message.error(
          "密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证"
        );
      } */
    },
    unlockMousedown() {
      this.$refs.unlockBtn.className = "unlock-btn click-unlock-btn";
    },
    unlockMouseup() {
      this.$refs.unlockBtn.className = "unlock-btn";
    },
    handleCloseInput() {
      this.avatorLeft = "0px";
      this.inputLeft = "400px";
    }
  },
  mounted() {
    this.showUnlock = true;
    if (document.getElementById("lock_screen_back")) {
      let lockScreenBack = document.getElementById("lock_screen_back");
      lockScreenBack.style.zIndex = -1;
    }
  }
};
</script>

<style lang="scss" scoped>
.unlock-body-con {
  position: absolute;
  width: 400px;
  height: 100px;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -200px;
  transform-origin: center center;
  z-index: 10;
  .unlock-avator-con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid white;
    cursor: pointer;
    transition: all 0.5s;
    z-index: 12;
    background: #64d9d6;
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
    .unlock-avator-title {
      display: block;
      width: 100%;
      height: 100%;
      z-index: 7;
      font-size: 18px;
      color: #f1f1f1;
      word-wrap: break-word;
      position: relative;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .unlock-avator-cover {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 11600;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.2s;
      color: white;
      .fa {
        display: block;
        font-size: 30px;
        text-align: center;
        margin: 20px auto 5px;
      }
      span {
        display: block;
        font-size: 16px;
        text-align: center;
      }
    }
    &:hover .unlock-avator-cover {
      opacity: 1;
      transition: opacity 0.2s;
    }
  }
  .unlock-avator-under-back {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-200px, -50%);
    box-sizing: border-box;
    width: 250px;
    height: 100px;
    background: #667aa6;
    transition: all 0.5s;
    z-index: 5;
    &-con {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #667aa6;
      position: absolute;
      right: -8px;
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .unlock-input-con {
    position: absolute;
    height: 70px;
    width: 350px;
    top: 15px;
    right: 0px;
    .unlock-input-overflow-con {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      overflow: hidden;
      .unlock-overflow-body {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        transition: all 0.5s ease 0.5s;
        .unlock-input {
          float: left;
          display: block;
          box-sizing: content-box;
          height: 22px;
          width: 200px;
          font-size: 18px;
          outline: none;
          padding: 10px 10px 11px 30px;
          border: 2px solid #eee;
          margin-top: 10px;
        }
        .unlock-btn {
          float: left;
          display: block;
          font-size: 21px;
          padding: 8px 24px;
          cursor: pointer;
          border-radius: 0 25px 25px 0;
          border: 2px solid #eee;
          border-left: none;
          background: #2d8cf0;
          color: #f1f1f1;
          outline: none;
          transition: all 0.2s;
          margin-top: 10px;
          &:hover {
            background: #5cadff;
            box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.2);
          }
        }
        .click-unlock-btn {
          background: #2b85e4 !important;
        }
      }
    }
  }
  .unlock-locking-tip-con {
    width: 100px;
    height: 30px;
    text-align: center;
    position: absolute;
    left: 50%;
    margin-left: -50px;
    bottom: -80px;
    color: white;
    font-size: 18px;
  }
}
@keyframes unlock-in {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(0);
  }
  88% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes unlock-out {
  0% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0);
  }
}
.show-unlock-enter-active {
  animation: unlock-in 1.4s ease;
}
.show-unlock-leave-to {
  opacity: 0;
}
.show-unlock-leave-active {
  transition: opacity 0.2s;
}
.unlock-con {
  width: 100%;
  height: 100%;
}
</style>

