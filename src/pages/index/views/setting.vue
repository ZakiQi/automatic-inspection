<!-- 自动化巡检设置 -->
<template>
  <div class="setting-wrap">
    <settingHeader></settingHeader>

    <!-- 巡检人表格 -->
    <inspection-table></inspection-table>
  </div>
</template>

<script>
import settingHeader from './components/setting/setting-header'
import inspectionTable from  './components/setting/inspection-table'
export default {
  data () {
    return {

    }
  },

  components: {
    settingHeader,
    inspectionTable
  }
}
</script>
<style lang="less" scoped>
.setting-wrap{
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 20px;
  background-color: #1E2941;
}
</style>
