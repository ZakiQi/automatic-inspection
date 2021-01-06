<template>
  <div id="Main">
    <a-config-provider :locale="zh_CN">
    <!-- <i class="iconfont iconjiahao"></i>
    <i class="iconfont">&#xe608;</i> -->
    <!-- <div id="nav">
      <router-link></router-link>
      <router-link to="/">Home</router-link>
      <router-link to="/about">about</router-link> |
      <router-link @click.native="jump" to="">preview</router-link>
    </div> -->
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import '@/assets/font/iconfont.js'
export default {
  data() {
    return {
      zh_CN
    }
  },
  methods: {
    jump() {
      window.location.href = './preview';
    },
  },
};
</script>

<style>
html, body{
  background-color: #1E2941;
  height: 100%;
  width: 100%;
}
#Main{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}

@import url('../../assets/font/iconfont.css');
@font-face {
  font-family: 'iconfont';
  src: url('../../assets/font/iconfont.eot');
  src: url('../../assets/font/iconfont.eot?#iefix') format('embedded-opentype'),
  url('../../assets/font/iconfont.woff') format('woff'),
  url('../../assets/font/iconfont.ttf') format('truetype'),
  url('../../assets/font/iconfont.svg#iconfont') format('svg');
}

.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  background-color:#57637E;
  /* background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  ); */
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  /* background   : #424F6D; */
  border-radius: 10px;
}
</style>
