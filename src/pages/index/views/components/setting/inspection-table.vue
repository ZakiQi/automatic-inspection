<template>
  <div class="inspection-table-wrap">
    <div class="table-content">
      <vxe-table stripe :data="tableInfo" max-height="100%" ref="inspection" :border="true" :align="'center'">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column field="userName" title="巡检人" width="200"></vxe-table-column>
        <vxe-table-column title="巡检内容"  width="300">
          <template v-slot="{ row }">
            <inspection-content :rowData="row"></inspection-content>
          </template>
        </vxe-table-column>
        <vxe-table-column field="userId" title="对应账号"></vxe-table-column>
        <vxe-table-column field="phone" title="联系方式"></vxe-table-column>
        <vxe-table-column field="createDate" title="添加日期" :formatter="formatDate"></vxe-table-column>
        <vxe-table-column field="status" title="状态" width="80">
          <template v-slot="{ row }">
            <span :class="[row.status === 1 ? 'online' : 'offline']">已{{ row.status === 1 ? '上线' : '下线'}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="200">
          <template  v-slot="{ row }">
            <div class="operation-wrap">
              <i v-show="row.status === 1" class="iconfont" style="font-size: 21px" @click="assignJob('edit', row)" title="编辑">&#xe611;</i>
              <i v-show="row.status === 1" class="iconfont" style="font-size: 21px" @click="updateInspectionStatus([row.id], 'offline')" title="下线">&#xe616;</i>
              <i v-show="row.status === 0" class="iconfont" style="font-size: 21px" @click="updateInspectionStatus([row.id], 'online')" title="上线" >&#xe614;</i>
              <i class="iconfont" style="font-size: 21px" @click="updateInspectionStatus([row.id], 'delete')" title="删除">&#xe612;</i>
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
      
      <pagination :size="'small'"
        :total="count"
        :page-size.sync="pageSize"
        @change="pageOnChange"
        @showSizeChange="sizeChange">
      </pagination>
    </div>

    <inspection-human :humanVisible.sync="humanVisible" :type="type" :rowData="rowData" @initRow="initRow" @updateRow="updateRow"></inspection-human>
  </div>
</template>

<script>
import Bus from '@/lib/common/Bus'
import { mapActions } from 'vuex'
import { formatDate } from '@/lib/utils/change'
import pagination from '../common/pagination'
import inspectionHuman from '../modal/inspection-human-modal'
import inspectionContent from './inspection-content'
import { updateInspectorStatus } from '@/lib/api/setting'
import { inspectorListInfo, inspectorListInfoCount } from '@/lib/api/setting'

export default {
  data () {
    return {
      tableInfo: [],
      count: 0,
      page: 1,
      pageSize: 10,
      humanVisible: false,
      type: '',
      userName: '',
      rowData: {}
    }
  },

  components: {
    pagination,
    inspectionHuman,
    inspectionContent
  },

  methods: {
    // 初始化表格数据
    initRow () {
      this.queryIinspectorCount()
      this.queryTableInfo()
    },
    
    queryIinspectorCount () {
      let params = {
        pageNo: this.page,
        pageSize: this.pageSize
      }
      this.userName && (params.userName = this.userName)
      
      inspectorListInfoCount(params).then(e => {
        this.count = e
      })
    },

    queryTableInfo () {
      let params = {
        pageNo: this.page,
        pageSize: this.pageSize
      }
      this.userName && (params.userName = this.userName)

      inspectorListInfo(params).then(e => {
        this.tableInfo = e?.list || []
      })
    },

    getChecked () {
      return this.$refs?.inspection.getCheckboxRecords()
    },

    // offline:下线 / delete:删除  / add: 新增 / edit: 编辑
    assignJob (type, data) {
      this.type = type
      switch (type) {
        case 'add':
          this.humanVisible = true
          break
        case 'edit':
          this.rowData = data
          this.humanVisible = true
          break
        case 'delete':
          this.deleteInspection()
          break
        case 'offline':
          this.InspectionOnlineStatus()
          break
      }
    },

    // 转换状态码
    transformStatus (status) {
      let obj = {}
      switch (status) {
        case 'online':
          obj.status = 1
          obj.msg = '上线'
          break
        case 'offline':
          obj.status = 0
          obj.msg = '下线'
          break
        case 'delete':
          obj.status = -1
          obj.msg = '删除'
          break
      }
      return obj
    },

    // 更改巡检人状态
    updateInspectionStatus (data, status) {
      const checkedArr = data || this.getChecked().map(e => e.id)

      if (checkedArr.length) {
        const obj = this.transformStatus(status)

        const params = {
          ids: checkedArr.join(','),
          status: obj.status
        }
        updateInspectorStatus(params).then(e => {
          this.$message.success( obj.msg + '成功')

          // 删除刷新，上下线更新状态
          if (obj.status = -1) {
            this.queryIinspectorCount()
            this.queryTableInfo()
          } else {
            checkedArr.forEach(e => {
            let rowData = this.tableInfo.find(item => item.id === e)
              rowData.status = obj.status
            })
          }
        })
      }
    },

    // 更新行
    updateRow (data) {
      this.tableInfo.forEach((e, i) => {
        e.id === data.id && this.$set(this.tableInfo, i, data)
      })
    },

    formatDate (data) {
      return formatDate(data.cellValue, 'YY-MM-DD')
    },

    pageOnChange (pageNumber) {
      this.page = pageNumber
      this.queryTableInfo()
    },

    sizeChange (page, pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.queryTableInfo()
    }
  },

  created () {
    this.initRow()

    Bus.$on('inspectionOperation', (type) => {
      this.assignJob(type)
    })

    Bus.$on('searchUser', (val) => {
      this.userName = val
      this.queryTableInfo()
      this.queryIinspectorCount()
    })
  }
}
</script>

<style lang="less" scoped>
.inspection-table-wrap{
  padding: 10px 0;
  height: calc(~"100% - 32px");

  .table-content{
    height: calc(~"100% - 24px");
  }

  .online{
    color: #3EA4FF;
  }

  .offline{
    color: #979797;
  }

  .operation-wrap{
    font-size: 16px;
    i {
      margin-right: 10px;
      &:hover{
        color: #31ADFF;
      }
    }
    .delete-item:hover{
      color: #ff4d4f;
    }
  }

  /deep/ .vxe-table {
    .vxe-cell--checkbox .vxe-checkbox--icon:before{
      background-color: transparent !important;
      border: 1px solid #5E95F6 !important;
    }
  }
}
</style>