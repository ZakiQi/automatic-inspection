<!-- 集群巡检 -->
<template>
  <inspection-table :tableTitle="'集群巡检'" v-show="showComponents" :count="count">
    <div class="cluster-inspection">
      <a-tabs default-active-key="'spark'" :activeKey="activeKey" :animated="true" :tab-position="'left'" :tabBarStyle="{}" :tabBarGutter="5" @change="tabClick">
        <a-tab-pane v-for="(e, i) in tableObj" :key="i">
          <div slot="tab">
            <span>{{i}} 集群</span>
            <span v-show="!!searchConditions && searchConditions.status !== -1"> (<font style="color:#FF4F4F;">{{ tablePaginationInfo[i].showNum }}</font>)</span>
          </div>

          <!-- 表格 -->
          <vxe-table stripe :data="tableObj[i] || []" height="200" :loading="loading" :align="'center'">
            <vxe-table-column field="code" title="编号" width="150"></vxe-table-column>
            <vxe-table-column field="content" title="巡检内容"></vxe-table-column>
            <vxe-table-column field="typeName" title="巡检名称" width="150"></vxe-table-column>
            <vxe-table-column field="codeDescribe" title="巡检节点" width="150"></vxe-table-column>
            <vxe-table-column field="status" title="状态" width="80">
              <template v-slot="{ row }">
                <span v-if="row.status === 2" style="color: #FF4F4F;">异常</span>
                <span v-else-if="row.status === 3" style="color: #FFA65D;">告警</span>
                <span v-else style="color: #4DAF63;">正常</span>
              </template>
            </vxe-table-column>
          </vxe-table>

          <pagination :size="'small'"
            :total="tablePaginationInfo[i].count"
            :page-size.sync="tablePaginationInfo[i].size"
            @change="(page) => pageOnChange(page, i)"
            v-show="tableObj[i].length && tablePaginationInfo[i].count > 5"
            @showSizeChange="(page, pageSize) => sizeChange(page, pageSize, i)">
            
            <!-- 展开收缩按钮 -->
            <div class="operation-btns">
              <a-button :size="'small'" class="expand-btn" @click="tableExpand(i)" :loading="loading">
                <i v-show="!loading" :class="['iconfont', tablePaginationInfo[i].expand && 'fold']">&#xe618;</i>{{tablePaginationInfo[i].expand ? '收起' : '展开'}}全部
              </a-button>
            </div>
          </pagination>
        </a-tab-pane>
      </a-tabs>
    </div>
  </inspection-table>
</template>

<script>
import Bus from '@/lib/common/Bus'
import inspectionTable from './inspection-table'
import pagination from '../common/pagination'
import tableMixins from '@Ind/views/mixins/table-mixins'
import _ from 'lodash'
import { colonyListInfo, colonyListInfoCount } from '@/lib/api/inspection'

export default {
  mixins: [tableMixins],

  data () {
    return {
      count: 0,
      showComponents: true,
      loading: true,
      activeKey: 'spark',
      count: 0,
      tableObj: {
        spark: [],
        impala: [],
        hive: [],
        hbase: [],
        hdfs: []
      },
      tablePaginationInfo: {
        spark: {
          expand: false,
          count: 0,
          page: 1,
          size: 5
        },
        impala: {
          expand: false,
          count: 0,
          page: 1,
          size: 5
        },
        hive: {
          expand: false,
          count: 0,
          page: 1,
          size: 5
        },
        hbase: {
          expand: false,
          count: 0,
          page: 1,
          size: 5
        },
        hdfs: {
          expand: false,
          count: 0,
          page: 1,
          size: 5
        }
      },
      searchConditions: ''
    }
  },

  components: {
    inspectionTable,
    pagination
  },

  methods: {
    initQuery (tab, data) {
      let params = {}

      if (data) {
        this.showComponents = data.kind === -1 || data.kind === 2
        this.activeKey = data.colony === -1 ? 'spark' : data.colony
      }

      // 状态
      if (this.searchConditions) {
        params.keyWord = this.searchConditions?.keyWord
      } else {
        +this.searchConditions.status !== -1 && ( params.status = this.searchConditions.status )
      }

      if (this.showComponents) {
        this.getCount(tab, params)
        this.initColonyListInfo(tab, params)
      }
    },

    // 查询数据总数
    getCount (val, data) {
      const params = {
        code: val.toUpperCase()
      }
      colonyListInfoCount(Object.assign(params, data)).then(e => {
        this.tablePaginationInfo[val].count = e
      })
    },

    // 表格数据列表信息
    initColonyListInfo (val, data) {
      this.loading = true

      const params = {
        pageNo: this.tablePaginationInfo[val].page,
        pageSize: this.tablePaginationInfo[val].size,
        code: val.toUpperCase()
      }
      colonyListInfo(Object.assign(params, data)).then(e => {
        this.loading = false
        this.tableObj[val] = e.list
      })
    },

    pageOnChange (pageNumber, key) {
      this.tablePaginationInfo[key].page = pageNumber
      this.initQuery(key)
    },

    tabClick (activeKey) {
      this.activeKey = activeKey
      this.searchConditions && this.$set(this.searchConditions, 'colony', activeKey.toLowerCase())
      this.initQuery(activeKey)
    },

    sizeChange (page, pageSize, activeKey) {
      this.tablePaginationInfo[activeKey].page = 1
      this.tablePaginationInfo[activeKey].size = pageSize
      this.initQuery(activeKey)
    },

    tableExpand (activeKey) {
      this.$set(this.tablePaginationInfo[activeKey], 'expand', !this.tablePaginationInfo[activeKey].expand)
      const status = this.tablePaginationInfo[activeKey].expand
    
      this.tablePaginationInfo[activeKey].page = 1
      this.tablePaginationInfo[activeKey].size = status ? 10 : 5
      this.initColonyListInfo(activeKey)
    },

    // 显示
    setShowNum () {
      if (this.clusterNumInfo && this.searchConditions.customSearch && this.searchConditions.status !== -1) {
        switch (this.searchConditions.status + '') {
          case '0': // 异常
            this.count = this.clusterNumInfo.map(e => e.errorStatus).reduce((total, res) => total + res)
            break
          case '1': // 正常
            this.count = this.clusterNumInfo.map(e => e.normalStatus).reduce((total, res) => total + res)
            break
          case '2': // 告警
            this.count = this.clusterNumInfo.map(e => e.warningStatus).reduce((total, res) => total + res)
            break
        }
      }
      console.log(this.clusterNumInfo, 'clusterNumInfo')
      this.clusterNumInfo.forEach(e => {
        let key = e.name.toLowerCase()
        this.tablePaginationInfo[key].error = e.errorStatus
        this.tablePaginationInfo[key].warning = e.warningStatus
        this.tablePaginationInfo[key].normal = e.normalStatus
      })
    },

    numShow: _.debounce (function () {
      if (!this.searchConditions) return
      // console.log(this.tablePaginationInfo, 'this.tablePaginationInfo', this.searchConditions.status, this.tablePaginationInfo[e])
      const clusterArr = ['spark', 'impala', 'hive', 'hbase', 'hdfs']
      clusterArr.forEach((e, i) => {
        switch (this.searchConditions.status + '') {
          case '0': // 异常
            this.tablePaginationInfo[e].showNum = this.tablePaginationInfo[e].error
            break
          case '1': // 正常
            this.tablePaginationInfo[e].showNum = this.tablePaginationInfo[e].normal
            break
          case '2': // 告警
            this.tablePaginationInfo[e].showNum = this.tablePaginationInfo[e].warning
            break
          default:
            this.tablePaginationInfo[e].showNum = this.tablePaginationInfo[e].warning + this.tablePaginationInfo[e].normal + this.tablePaginationInfo[e].warning
        }
      })
      this.$forceUpdate()
    }, 300)
  },

  created () {
    this.initQuery(this.activeKey)
    Bus.$on('clusterNumInfo', e => {
      this.clusterNumInfo = e
    })

    Bus.$on('searchHandler', e => {
      this.searchConditions = e
      this.initQuery(this.activeKey, e)
      this.setShowNum()
      this.numShow()
    })
    
  }
}
</script>

<style lang="less" scoped>
.cluster-inspection{
  margin-top:10px;

  .operation-btns{
    margin-top: 10px;
    text-align: center;
    display: block;
    position: absolute;
    top: -10px;
    right: 0;

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

  /deep/ .ant-tabs-tab{
    color: #ffffff;
    padding: 6px 24px;
  }
  /deep/ .ant-tabs-tab-active{
    background-color: #3E86ED;
    border-radius: 3px;
  }

  /deep/ .ant-tabs-left-content{
    border-left: none;
  }

  /deep/ .ant-tabs-left-bar{
    border-right: none;
  }

  /deep/ .ant-tabs-ink-bar{
    display: none !important;
  }
}
</style>