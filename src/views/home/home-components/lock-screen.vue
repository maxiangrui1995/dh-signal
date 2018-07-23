<template>
  <el-tooltip class="layout-header-tools-btn-con" content="锁屏">
    <i class="fa fa-lock" @click="lockScreen "></i>
  </el-tooltip>
</template>

<script>
const setLockBackSize = () => {
  let x = document.body.clientWidth;
  let y = document.body.clientHeight;
  let r = Math.sqrt(x * x + y * y);
  return parseInt(r);
};
export default {
  data() {
    return {
      lockScreenSize: 0
    };
  },
  methods: {
    lockScreen() {
      let lockScreenBack = document.getElementById("lock_screen_back");
      lockScreenBack.style.transition = "all 3s";
      lockScreenBack.style.zIndex = 10000;
      lockScreenBack.style.opacity = 0.3;
      lockScreenBack.style.boxShadow =
        "0 0 0 " + this.lockScreenSize + "px #667aa6 inset";
      sessionStorage.setItem("locked", true);
      setTimeout(() => {
        lockScreenBack.style.transition = "all 0s";
        this.$router.replace({
          path: "/lock"
        });
      }, 800);
    }
  },
  mounted() {
    let lockScreenBack;
    if (!document.getElementById("lock_screen_back")) {
      let lockdiv = document.createElement("div");
      lockdiv.setAttribute("id", "lock_screen_back");
      lockdiv.setAttribute("class", "lock-screen-back");
      document.body.appendChild(lockdiv);
      lockScreenBack = document.getElementById("lock_screen_back");
      window.addEventListener("resize", () => {
        let size = setLockBackSize();
        this.lockScreenSize = size;
        lockScreenBack.style.transition = "all 0s";
        lockScreenBack.style.width = lockScreenBack.style.height = size + "px";
      });
    } else {
      lockScreenBack = document.getElementById("lock_screen_back");
    }
    let size = setLockBackSize();
    this.lockScreenSize = size;
    lockScreenBack.style.transition = "all 3s";
    lockScreenBack.style.width = lockScreenBack.style.height = size + "px";
  }
};
</script>

<style>
.lock-screen-back {
  border-radius: 50%;
  z-index: -10;
  box-shadow: 0 0 0 0 #667aa6 inset;
  position: fixed;
  left: 50%;
  top: 50%;
  opacity: 1;
  transform: translate(-50%, -50%);
  transition: all 3s;
}
</style>


