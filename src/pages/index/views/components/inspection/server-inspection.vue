<!-- 服务器巡检 -->
<template>
    <inspection-table :tableTitle="'服务器巡检'" v-show="showComponents" :count="count">
      <div style="margin-top:13px;font-size: 12px;">
        <vxe-table stripe :data="tableData" :loading="loading" :align="'center'">
          <vxe-table-column field="code" title="编号" width="80"></vxe-table-column>
          <vxe-table-column field="content" title="服务器巡检清单"></vxe-table-column>
          <!-- 状态 -->
          <vxe-table-column field="status" title="状态" width="80">
            <template v-slot="{ row }">
              <span v-if="row.status === 2" style="color: #FF4F4F;">异常</span>
              <span v-else-if="row.status === 3" style="color: #FFA65D;">告警</span>
              <span v-else style="color: #4DAF63;">正常</span>
            </template>
          </vxe-table-column>

          <!-- 磁盘 -->
          <vxe-table-column field="disk" title="磁盘" width="60">
            <template v-slot="{ row }">
              <div class="disk" @click="diskModalShow(row)">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use :xlink:href="'#sdcipan-zhengchang'"></use>
                </svg>
                <span :class="['warning-tips', +row.diskStatus === 1 && 'normal-tips', +row.diskStatus === 0 && 'error-tips']" :style="{right: row.diskCount > 10 && '-9px'}">{{row.diskCount }}</span>
              </div>
            </template>
          </vxe-table-column>

          <!-- CPU -->
          <vxe-table-column field="cpuValue" title="CPU" width="60">
            <template v-slot="{ row }">
              <div class="cpu-modal" @click="cpuModalShow(row, 'cpu')">
                {{row.cpuValue || 'Null'}}
              </div>
            </template>
          </vxe-table-column>

          <!-- 内存 -->
          <vxe-table-column field="memory" title="内存">
            <template v-slot="{ row }">
              <div class="memory" :key="row.disk" @click="cpuModalShow(row, 'memory')">
                <div class="memory-text">
                  {{ row.memoryValue }} GiB / {{ row.memoryTotalValue || '-' }} GiB
                </div>
                <div class="memory-bar">
                  <a-progress :percent="row.memoryTotalValue ? (+row.memoryValue / +row.memoryTotalValue) * 100 : 0.1" :show-info="false" :size="'small'" :stroke-color="strokeColor(row.memoryValue, row.memoryTotalValue)" />
                </div>
              </div>
            </template>
          </vxe-table-column>

          <!-- 平均负载 -->
          <vxe-table-column field="averageLoadValue" title="平均负载"></vxe-table-column>

          <!-- 交换空间 -->
          <vxe-table-column field="space" title="交换空间">
            <template v-slot="{ row }">
              <div class="memory" :key="row.disk">
                <span style="color:#4DAF63;" v-if="row.exchangeSpaceStatus">正常</span>
                <span style="color:#FF4F4F;" v-if="!row.exchangeSpaceStatus">异常</span>
              </div>
            </template>
          </vxe-table-column>

          <!-- 异常发生时间 -->
          <vxe-table-column field="createDate" title="异常发生时间" width="180">
            <template v-slot="{ row }">
              <span>
                {{row.createDate ? formatDate(row.createDate, 'hh:mm:ss') : '-'}}
              </span>
            </template>
          </vxe-table-column>
        </vxe-table>

        <pagination :size="'small'" :total="count" :page-size.sync="pageSize" @change="pageOnChange" @showSizeChange="sizeChange" v-show="expand" show-quick-jumper></pagination>

        <!-- 展开收缩按钮 -->
        <div class="operation-btns" v-show="count > 5">
          <a-button :size="'small'" class="expand-btn" @click="tableExpand" :loading="loading">
            <i v-show="!loading" :class="['iconfont', expand && 'fold']">&#xe618;</i>{{expand ? '收起' : '展开'}}全部
          </a-button>
        </div>
      </div>
      <disk-modal :diskModalVisible.sync="diskModalVisible" :rowData="rowData"></disk-modal>
      
      <!-- 详情弹框 -->
      <detailsModal 
        :detailsModalVisible.sync="detailsModalVisible" 
        :rowData="checkedRow" 
        :detailsTitle="detailsTitle" 
        :type="detailsType"
        ref="detailsModal">
      </detailsModal>
    </inspection-table>
</template>

<script>
import Bus from '@/lib/common/Bus'
import inspectionTable from './inspection-table'
import pagination from '../common/pagination'
import diskModal from '../modal/disk-modal'
import detailsModal from '../modal/details-modal'
import tableMixins from '@Ind/views/mixins/table-mixins'
import { serverListInfo, serverListInfoCount } from '@/lib/api/inspection'


export default {
  mixins: [tableMixins],

  data () {
    return{
      searchConditions: '',
      showComponents: true,
      expand: false,
      loading: false,
      diskModalVisible: false,
      detailsModalVisible: false,
      detailsTitle: '',
      detailsType: '',
      tableData: [],
      count: 0,
      page: 1,
      pageSize: 5,
      rowData: {},
      checkedRow: {},
      optionsInfo: {
        cpu: 'CPU',
        memory: '内存'
      }
    }
  },

  components: {
    inspectionTable,
    pagination,
    diskModal,
    detailsModal
  },

  watch: {
  },

  methods: {
    // 初始化，有传值为有查询条件情况
    initQuery (data) {
      let params = {}
      if (data) {
        // 是否显示本组件
        this.showComponents = data.kind === -1 || data.kind === 1
        
        this.showSearchRes = !!data && data.status !== -1 && !data.keyWord

        // 状态
        if (!data.customSearch) {
          params.code = data.keyWord
        } else {
          +data.status !== -1 && ( params.status = data.status )
        }

        // 其他参数
        if (data.kind === 1) {
          data.cupStatus !== -1 && (params.cpuStatus = data.cupStatus)
          data.diskStatus !== -1 && (params.diskStatus = data.diskStatus)
          data.memoryStatus !== -1 && (params.memoryStatus = data.memoryStatus)
        }
      }
      if (this.showComponents) {
        this.getCount(params)
        this.initServerListInfo(params)
      }
    },

    getCount (params) {
      serverListInfoCount(params).then(e => {
        this.count = e
      })
    },

    initServerListInfo (data) {
      this.loading = true
      const params = {
        pageNo: this.page,
        pageSize: this.pageSize
      }
      
      serverListInfo(Object.assign(params, data)).then(e => {
        this.loading = false
        if (e){
          this.tableData = e.list || []
        }
      })
    },

    tableExpand () {
      this.$set(this, 'expand', !this.expand)
      this.size = this.expand ? 10 : 5
      this.initServerListInfo()
    },

    pageOnChange (pageNumber) {
      this.page = pageNumber
      this.initServerListInfo()
    },

    sizeChange (page, pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.initServerListInfo()
    },

    // 内存进度条颜色
    strokeColor (value, total) {
      let res = total ? 10 : value / total
      if (res <= 100 && res > 80) {
        return '#FF4F4F'
      } else if (res <= 80  && res > 60) {
        return '#3E86ED'
      } else {
        return '#4DAF63'
      }
    },

    // 硬盘弹框
    diskModalShow (row) {
      this.diskModalVisible = true
      this.rowData = row
    },
    
    // 折线图弹框
    cpuModalShow (row, type) {
      this.detailsModalVisible = true
      this.detailsTitle = this.optionsInfo[type] + '巡检日志'
      this.detailsType = type
      this.checkedRow = row

      this.$nextTick(e => {
        this.$refs.detailsModal.queryDetailsInfo()
      })
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

.disk{
  cursor: pointer;
  user-select: none;
  display: inline-block;
  position: relative;
  width: auto;

  .warning-tips{
    position: absolute;
    top: -2px;
    font-size: 12px;
    right: -2px;
    background: chocolate;
    width: auto;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    padding: 0 3px;
    border-radius: 8px;
  }

  .normal-tips{
    background: #4DAF63;
  }

  .error-tips{
    background: #FF4F4F;
  }
  
  & i{
    color: #3a60a6;
    font-size: 18px;
    position: relative;
    top: 3px;
  }

  .svg-icon{
    width: 24px;
    height: 24px;
  }

}
.cpu-modal{
  user-select: none;
  cursor: pointer;
}

.memory{
  cursor: pointer;
}

.memory-text,.memory-bar{
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.memory-text{
  color: #8BBBFF;
}
</style>