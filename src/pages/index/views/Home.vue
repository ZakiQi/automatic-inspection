<template>
  <div class="home">
    <!-- 总体情况 -->
    <information></information>

    <div class="inspection-content">
      <option-menu></option-menu>
      <inspection-content></inspection-content>
    </div>

    <goSetting></goSetting>
  </div>
</template>

<script>

import information from './components/information'
import optionMenu from './components/option-menu'
import inspectionContent from './components/inspection-content'
import goSetting from './components/inspection/go-setting'

export default {
  name: 'Home',

  components: {
    information,
    optionMenu,
    inspectionContent,
    goSetting
  },

  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.home{
  background-color: #1E2941;
  height: 100%;
  width: 100%;
  padding: 20px;
  color: #ffffff;
  font-size: 13px;
  box-sizing: border-box;
  .inspection-content{
    height: calc(~"100% - 40px");
    overflow: auto;
  }
}
</style>

<style lang="scss">
  @import 'vxe-table/styles/variable.scss';
  $vxe-font-size: 13px;
  $vxe-font-color: #fff;
  $vxe-table-background-color: #323F60;
  $vxe-table-header-background-color: #325093;
  $vxe-table-body-background-color: $vxe-table-background-color;
  $vxe-table-footer-background-color: $vxe-table-background-color;
  $vxe-table-font-color: $vxe-font-color;
  $vxe-primary-color: #325093;
  $vxe-table-border-color: #325093;
  $vxe-table-border-radius: 4px;
  $vxe-table-row-striped-background-color: #314472;
  @import 'vxe-table/styles/modules.scss';
</style>