<template>
  <div class="option-menu-wrap">
    <!-- 服务器基本情况 -->
    <serverSituation :serverInfo="serverInfo" style="margin-top:0px;"></serverSituation>
    
    <!-- 集群情况 -->
    <cluster-situation :type="'cluster'" :briefInfo="clusterInfo" :headerText="'集群情况'"></cluster-situation>

    <!-- 应用服务情况 -->
    <cluster-situation :type="'appServer'" :briefInfo="appServerInfo" :headerText="'应用服务情况'"></cluster-situation>
    
    <!-- 对外接口 -->
    <cluster-situation :type="'interface'" :briefInfo="interfaceInfo" :headerText="'对外接口情况'"></cluster-situation>
  </div>
</template>
<script>
import Bus from '@/lib/common/Bus'
import commonWrap from './situation/common-wrap'
import serverSituation from './situation/server-situation'
import clusterSituation from './situation/cluster-situation'

export default {
  data () {
    return {
      serverInfo: {},
      clusterInfo: [],
      appServerInfo: [],
      interfaceInfo:[]
    }
  },

  components: {
    commonWrap,
    serverSituation,
    clusterSituation
  },

  methods: {
    getColonyInfo () {
      this.$store.dispatch('Dimension/getColonyInfo', {}).then(data => {
        if (data) {
          this.serverInfo = data.serverStatus[0]
          this.clusterInfo = data.colonyStatus
          this.appServerInfo = data.applicationStatus
          this.interfaceInfo = data.interfaceStatus
          Bus.$emit('clusterNumInfo', this.clusterInfo)
        }
      })
    }
  },

  created () {
    this.getColonyInfo()
  }
}
</script>

<style lang="less" scoped>
.option-menu-wrap{
  width: 288px;
  height: 100%;
  float: left;
  // overflow: auto;
}
</style>