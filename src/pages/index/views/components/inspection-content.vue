<!-- 右侧主体部分 -->
<template>
  <div class="inspection-content-wrap">
    <!-- 搜索栏 -->
    <search-wrap></search-wrap>
    
    <!-- 服务器巡检 -->
    <server-inspection></server-inspection>

    <!-- 集群巡检 -->
    <cluster-inspection></cluster-inspection>

    <!-- 应用服务巡检 -->
    <app-server-inspection></app-server-inspection>

    <!-- 对外接口巡检 -->
    <interface-inspection></interface-inspection>
  </div>
</template>

<script>

import searchWrap from './search-wrap'
import serverInspection from './inspection/server-inspection'
import clusterInspection from './inspection/cluster-inspection'
import interfaceInspection from './inspection/interface-inspection'
import appServerInspection from './inspection/app-server-inspection'

export default {
  data () {
    return {
    }
  },

  components: {
    searchWrap,
    serverInspection,
    clusterInspection,
    interfaceInspection,
    appServerInspection
  }
}
</script>
<style lang="less" scoped>
.inspection-content-wrap{
  overflow: hidden;
  // height: 100%;
  padding-left: 10px;
  // overflow: auto;
}
/deep/ .vxe-table{
  font-size: 12px;
}
</style>