<!-- 左边简要情况 -->
<template>
  <common-wrap :headerText="headerText">
    <div class="cluster-wrap">
      <div class="cluster" v-for="(item, i) in briefInfo" :key="i">
        <div class="left-cont">
          <svg class="icon svg-icon" aria-hidden="true">
              <use :xlink:href="'#' + `${sttuationConfig[item.name].icon}`"></use>
          </svg>
          <span class="cluster-name">{{sttuationConfig[item.name].name || ''}}</span>
        </div>
        <div class="right-cont">
          <div v-if="!item.warningStatus && !item.errorStatus">
            <i class="iconfont normal-icon">&#xe60d;</i>正常
          </div>
          <div v-if="item.errorStatus" @click="errorDetails(item)" class="error-row">
            <span class="iconfont bad-icon">&#xe60e;</span>
            <span style="color:#FF4F4F;margin:0 3px;">{{item.errorStatus}}</span>个异常
          </div>
          <div v-if="item.warningStatus" :style="item.errorStatus && {'margin-top': '5px'}">
            <span class="iconfont warning-icon">&#xe60f;</span>
            <span style="color:#FFA65D;margin:0 3px;">{{item.warningStatus}}</span>个警告
          </div>
        </div>
      </div>
    </div>

    <runningConditionModal :modalVisible.sync="runningCondition" :keyWord="keyWord"></runningConditionModal>
  </common-wrap>
</template>

<script>
import commonWrap from './common-wrap'
import Bus from '@/lib/common/Bus'
import runningConditionModal from '../modal/running-condition-modal'

export default {
  props: {
    type: {
      type: String,
      default: 'cluster'
    },
    briefInfo: {
      type: Array,
      default: () => []
    },
    headerText: {
      type: String
    }
  },

  data () {
    return {
      runningCondition: false,
      keyWord: '',
      sttuationConfig: {
        DB: { name: '数据库巡检', icon: 'sdshujuku3' },
        SS: { name: '数据探索平台', icon: 'sdshujutansuopingtaiLOGO-yuanse' },
        HIVE: { name: 'hive集群', icon: 'sdhive' },
        HBASE: { name: 'hbase集群', icon: 'sdhbase' },
        SPARK: { name: 'Spark集群', icon: 'sdspark' },
        HDFS: { name: 'hdfs集群', icon: 'sdHDFSlianjie' },
        IMPALA: { name: 'impala集群', icon: 'sdIMPALA' },
        interfaceStatus: { name: '对外服务接口', icon: 'sdjiekou1' },
        serverStatus: { name: '', icon: '' }
      }
    }
  },

  components: {
    commonWrap,
    runningConditionModal
  },
  
  methods: {
    errorDetails (item) {
      this.runningCondition = true
      this.keyWord = item.name
    }
  },

  created () {
  }
}
</script>

<style lang="less" scoped>
.cluster-wrap{
  width: 100%;
  padding: 20px 16px;
  color: #ffffff;
  overflow: hidden;
  box-sizing: border-box;

  .cluster{
    margin-top:20px;
    overflow: hidden;
    position: relative;
    background: #3D4B6E;
    box-shadow: 0px 1px 4px 0px rgba(26, 37, 56, 0.5);
    border-radius: 3px;
    padding: 5px;
  }

  .svg-icon{
    margin-right: 5px;
    background: #fff;
    border-radius: 2px;
    width: 26px;
    height: 24px;
    padding: 1px;
    position: relative;
    top: 3px;
  }

  .error-row {
    cursor: pointer;
  }

  .cluster:first-child{
    margin-top:0px;
  }

  .cluster-name{
    font-weight: bold;
  }

  .left-cont{
    width: 50%;
    display: block;
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);

    & i{
      font-size: 12px;
      margin-right: 5px;
    }
  }
  .right-cont{
    width: 50%;
    float: right;
  }

  .normal-icon, .bad-icon, .warning-icon{
    position: relative;
    top: 1px;
    margin-right: 5px;
  }

  .normal-icon{
    color: #4eaf63;
  }

  .bad-icon{
    color: #ff4f4f;
  }

  .warning-icon{
    color: #ffa65d;
  }
}
</style>