<!-- 对外接口巡检 -->
<template>
  <inspection-table :tableTitle="'对外接口巡检'" v-show="showComponents" :count="count">
    <div style="margin-top:13px;">
      <vxe-table stripe :data="tableData" :loading="loading" :align="'center'">
        <vxe-table-column field="content" title="巡检内容" :align="'left'"></vxe-table-column>
        <vxe-table-column field="name" title="巡检名称" width="200"></vxe-table-column>
        <vxe-table-column field="status" title="状态" width="100">
          <template v-slot="{ row }">
            <span v-if="row.status === 2" style="color: #FF4F4F;">异常</span>
            <span v-else-if="row.status === 3" style="color: #FFA65D;">告警</span>
            <span v-else style="color: #4DAF63;">正常</span>
          </template>
        </vxe-table-column>
      </vxe-table>

      <pagination :size="'small'" :total="count" :page-size.sync="pageSize" @change="pageOnChange" @showSizeChange="sizeChange" v-show="expand" show-quick-jumper></pagination>

      <!-- 展开收缩按钮  -->
      <div class="operation-btns" v-show="count > 5">
        <a-button :size="'small'" class="expand-btn" @click="tableExpand"><i :class="['iconfont', expand && 'fold']">&#xe618;</i>{{expand ? '收起' : '展开'}}全部</a-button>
      </div>
    </div>
  </inspection-table>
</template>

<script>
import Bus from '@/lib/common/Bus'
import inspectionTable from './inspection-table'
import tableMixins from '@Ind/views/mixins/table-mixins'
import pagination from '../common/pagination'
import { interfaceListInfoCount, getInterfaceListInfo } from '@/lib/api/inspection'


export default {
  mixins: [tableMixins],

  data () {
    return{
      showComponents: true,
      loading: false,
      expand: false,
      tableData: [],
      count: 0,
      page: 1,
      pageSize: 5
    }
  },

  components: {
    inspectionTable,
    pagination
  },

  computed: {
  },

  methods: {
    initQuery (data) {
      let params = {}

      if (data) {
        this.showComponents = data.kind === -1 || data.kind === 4

        this.showSearchRes = !!data && data.status !== -1 && !data.keyWord

        // 状态
        if (!data.customSearch) {
          params.code = data.keyWord
        } else {
          +data.status !== -1 && ( params.status = data.status )
        }
      }

      if (this.showComponents) {
        this.getCount(params)
        this.initInterfaceListInfo(params)
      }
    },

    getCount (params) {
      interfaceListInfoCount(params).then(e => {
        this.count = e
      })
    },

    // 对外接口巡检表格内容初始化
    initInterfaceListInfo (data) {
      this.loading = true
      const params = {
        pageNo: this.page,
        pageSize: this.pageSize
      }
      getInterfaceListInfo(Object.assign(params, data)).then(e => {
        this.loading = false
        this.tableData = e.list
      })
    },

    tableExpand () {
      this.$set(this, 'expand', !this.expand)
      this.pageSize = 10
    },

    pageOnChange (pageNumber) {
      this.page = pageNumber
      this.initInterfaceListInfo()
    },

    sizeChange (page, pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.initInterfaceListInfo()
    }
  },

  created () {
    this.initQuery()

    Bus.$on('searchHandler', e => {
      this.searchConditions = e
      this.initQuery(e)
    })
  }
}
</script>

<style lang="less" scoped>
.operation-btns{
  margin-top:10px;
  width: 100%;
  text-align: center;
  & i{
    font-size: 12px;
    margin-right: 5px;
  }
  .fold{
    transform: rotate(180deg);
  }
}

.expand-btn{
  border: 1px solid #4E78B2;
  background-color: #2E4265;
  color: #ffffff;
  font-size: 12px;
}
</style>