<!-- 简要信息 -->
<template>
  <div class="information-wrap">
    <span>
      运行总体情况：服务器 <b class="unusual-num">{{ serverErrorNum }}</b> 个异常；
      集群异常 <b class="unusual-num">{{ colonyErrorNum }}</b> 个；
      应用服务接口 <b class="unusual-num">{{ interfaceErrorNum }}</b>  个异常。
      <span class="chack-abnormal" @click="runningCondition = true">查看异常>></span>
    </span>
    <!-- <span class="setting" @click="goSetting">设置</span> -->
    <runningConditionModal :modalVisible.sync="runningCondition"></runningConditionModal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '@/lib/common/Bus'
import runningConditionModal from './modal/running-condition-modal'

export default {
  data () {
    return {
      runningCondition: false,
      serverErrorNum: 0,
      colonyErrorNum: 0,
      interfaceErrorNum: 0,
      normalNum: 0
    }
  },

  components: {
    runningConditionModal
  },

  computed: {
    ...mapState('Dimension', ['inspectionInfo'])
  },

  watch: {
    inspectionInfo: {
      handler (data) {
        if (data) {
          this.serverErrorNum = data.serverStatus.map(e => e.errorStatus).reduce((total, res) => total + res)
          this.colonyErrorNum = data.colonyStatus.map(e => e.errorStatus).reduce((total, res) => total + res)
          this.interfaceErrorNum = data.interfaceStatus.map(e => e.errorStatus).reduce((total, res) => total + res)
        }
      },
      immediate: false
    }
  },

  methods: {
  }
}
</script>

<style lang="less" scoped>
.information-wrap{
  background-color: #3D496E;
  height: 40px;
  line-height: 40px;
  border: 1px solid #4B5A87;
  padding-left: 14px;
  margin-bottom: 10px;
  position: relative;

  .unusual-num{
    color: #FF5959;
  }

  .chack-abnormal{
    color: #3488FF;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }

  .setting{
    position: absolute;
    right: 20px;
    top: 0;
    color: #3488FF;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>