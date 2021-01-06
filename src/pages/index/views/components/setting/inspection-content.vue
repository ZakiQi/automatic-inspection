<!-- 巡检人权限表格 -->
<template>
  <div class="inspection-content-wrap">
    <div class="permissions-wrap">
      <div class="left-wrap">
        <span>短信提醒</span>
      </div>
      <div class="right-wrap">
        <div class="remind-content" v-for="(e, i) in sysInfo" :key="i">
          <a-icon v-show="e.checked" class="remind-icon" type="check" style="color: #4DAF63;" />
          <a-icon v-show="!e.checked" class="remind-icon" type="close" style="color: #ccc;" />
          {{e.label}}
        </div>
      </div>
    </div>
    <div class="permissions-wrap">
      <div class="left-wrap">
        <span>短信提醒</span>
      </div>
      <div class="right-wrap">
        <div class="remind-content" v-for="(e, i) in smsInfo" :key="i">
          <a-icon v-show="e.checked" class="remind-icon" type="check" style="color: #4DAF63;" />
          <a-icon v-show="!e.checked" class="remind-icon" type="close" style="color: #ccc;" />
          {{e.label}}
        </div>
      </div>
    </div>
    {{rowData}}    
  </div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {}
    }
  },

  watch: {
    rowData: {
      handler (data) {
        let checkedArr = data.inspectorConfigs.map(e => e.configCode)
        this.sysInfo.forEach(e => {
          this.$set(e, 'checked', checkedArr.includes(e.code))
        })

        this.smsInfo.forEach(e => {
          this.$set(e, 'checked', checkedArr.includes(e.code))
        })
      },
      immediate: true
    }
  },

  data () {
    return {
      sysInfo: [
        {code: 'sys-interface', label: '对外接口巡检'},
        {code: 'sys-application', label: '应用服务巡检'},
        {code: 'sys-colony', label: '集群巡检'},
        {code: 'sys-server', label: '服务器巡检'}
      ],
      smsInfo: [
        {code: 'sms-interface', label: '对外接口巡检'},
        {code: 'sms-application', label: '应用服务巡检'},
        {code: 'sms-colony', label: '集群巡检'},
        {code: 'sms-server', label: '服务器巡检'}
      ]
    }
  },

  // methods: {
  //   init () {

  //   }
  // },

  // created () {
  //   // this.init(this.rowData, 'rowData')
  // }
}
</script>

<style lang="less" scoped>
.inspection-content-wrap{
  height: 130px;
  overflow: hidden;

  .permissions-wrap{
    width: 280px;
    height: 60px;
    border: 1px solid #445E96;
    box-sizing: border-box;
    background-color: #374D85;

    &:first-child{
      margin-bottom: 10px;
    }
  }

  .left-wrap{
    float: left;
    height: 100%;
    width: 70px;
    background-color: #3A5392;
    position: relative;
    border-right: 1px solid #445E96;

    & span{
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      transform: translate(0%, -50%);
    }
  }
  .right-wrap{
    height: 100%;
    overflow: hidden;
  }
  .remind-content {
    width: 50%;
    height: 50%;
    float: left;
    line-height: 30px;
    text-align: left;
    text-indent: 5px;
  }
  .remind-icon{
    position: relative;
    top:2px;
  }
}
</style>