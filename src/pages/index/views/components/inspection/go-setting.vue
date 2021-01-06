<template>
  <div class="setting-content" @click="goSetting">
    <i class="iconfont">&#xe610;</i>
    <span class="setting-text">设置</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  methods: {
    goSetting () {
      this.$router.push({path: '/setting'})
    }
  }
}
</script>

<style lang="less" scoped>
.setting-content{
  cursor: pointer;
  width: 60px;
  position:fixed;
  top: 50px;
  right: -45px;
  z-index: 99;
  background:#46B6BC;
  border-radius: 5px;
  padding: 5px 10px;
  transition: all .3s;
  font-size: 13px;
  .setting-text{
    position: relative;
    top: -1px;
    left: 8px;
  }
  &:hover{
    right: -15px;
  }
}
</style>