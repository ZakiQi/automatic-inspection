<!-- 服务器情况 -->
<template>
  <common-wrap :headerText="'服务器基本情况:'">
    <span slot="num" class="wrap-title">
      {{
        +(serverInfo.errorStatus) +
        +(serverInfo.warningStatus) +
        +(serverInfo.normalStatus)
      }}
    </span>
    <div class="brief-info">
      <div class="brief-list">
        <div class="num-wrap">
          <span class="num-radius" style="border:1px solid #FF4F4F;color:#FF4F4F;">{{serverInfo.errorStatus}}</span>
          <span style="color: #fff;">异常</span>
        </div>
      </div>
      <div class="brief-list">
        <div class="num-wrap">
          <span class="num-radius" style="border:1px solid #FFA65D;color:#FFA65D;">{{serverInfo.warningStatus}}</span>
          <span style="color: #fff;">告警</span>
        </div>
      </div>
      <div class="brief-list">
        <div class="num-wrap">
          <span class="num-radius" style="border:1px solid #4DAF63;color:#4DAF63;">{{serverInfo.normalStatus}}</span>
          <span style="color: #fff;">正常</span>
        </div>
      </div>
    </div>
  </common-wrap>
</template>

<script>
import commonWrap from './common-wrap'

export default {
  props: {
    serverInfo: {
      type: Object,
      default: () => {
        return {errorStatus: '-', warningStatus: '-', normalStatus: '-'}
      } 
    }
  },

  data () {
    return {
    }
  },

  components: {
    commonWrap
  },

  created () {
  }
}
</script>

<style lang="less" scoped>
.wrap-title{
  font-weight: bold;
  color: #ffffff;
}

.brief-info{
  display: flex;
  flex-direction: row;
  height: 132px;
}

.brief-list{
  width: calc(~"100% / 3");
  height: 100%;
  position: relative;
  text-align: center;
}

.num-radius{
  border-radius: 50%;
}

.num-wrap{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
}

.num-radius{
  display: block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  border-radius: 50%;
  font-size: 20px;
  margin-bottom: 6px;
}
</style>