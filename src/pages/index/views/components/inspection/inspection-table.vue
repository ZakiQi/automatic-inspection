<template>
  <div class="table-wrap">
    <div class="table-title">
      {{tableTitle}}
      <span v-show="showSearchRes" class="search-res">包含有"<b>{{ statusName }}</b>"的结果： <b>{{ count }}</b></span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Bus from '@/lib/common/Bus'
export default {
  props: {
    tableTitle: {
      type: String,
      default: ''
    },

    count: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      statusArr: {'0': '异常', '1': '正常', '2': '告警'},
      statusName: '',
      showSearchRes: false
    }
  },

  methods: {
  },

  created () {
    Bus.$on('searchHandler', e => {
      this.statusName = this.statusArr[e.status]
      this.showSearchRes = !!e && e.status !== -1 && !e.keyWord
    })
  }
}
</script>

<style lang="less" scoped>
.table-wrap{
  margin-top: 10px;
  background-color: #2B3651 !important;
  border: 1px solid #2C3E61;
  padding: 10px 20px;

  .table-title{
    font-size: 16px;
  }

  .search-res{
    color: #85A0C1;
    font-size: 14px;
    & b{
      color: #FF4F4F;
    }
  }

  /deep/ .vxe-header--column{
    background: #325093 !important;
  }
  /deep/ .vxe-table .vxe-header--column:not(.col--ellipsis), .vxe-table .vxe-body--column:not(.col--ellipsis), .vxe-table .vxe-footer--column:not(.col--ellipsis){
    padding: 8px 0 !important;
  }
  /deep/ .vxe-body--column{
    padding: 8px 0 !important;
  }
}
</style>