<template>
  <modal
    title="运行状况问题"
    :width="909"
    :visible.sync="visible"
    :confirm-loading="confirmLoading"
    :footer="false"
    :centered="true"
    @cancel="handleCancel"
    >
      <div>
        <div class="table-wrap">
          <vxe-table stripe :data="tableData" :loading="loading" :show-header="false" :centered="true">
            <vxe-table-column>
              <template v-slot="{ row }">
                <div class="error-item">
                  <i class="iconfont error-icon">&#xe60e;</i>
                  <span class="error-title">【编号{{ row.CODE }}】【{{ row.CODEDESCRIBE }}节点异常】</span>
                  {{ row.CONTENT }}访问异常，发生异常时间为 <span class="creative-time">{{ formatDate(row.CREATEDATE) }}</span>
                </div>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <pagination :size="'small'" :total="count" :page-size.sync="pageSize" @change="pageOnChange" @showSizeChange="sizeChange" show-quick-jumper></pagination>
      </div>
    </modal>
</template>

<script>
import Bus from '@/lib/common/Bus'
import modal from '../common/modal'
import pagination from '../common/pagination'
import tableMixins from '@Ind/views/mixins/table-mixins'
import { errorListInfoCount, errorListInfo } from '@/lib/api/inspection'


export default {
  mixins: [tableMixins],

  props: {
    modalVisible: {
      type: Boolean,
      default: false,
    },
    keyWord: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      visible: false,
      confirmLoading: false,
      count: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      tableData: []
    }
  },

  components: {
    modal,
    pagination
  },

  watch: {
    modalVisible (val) {
      this.visible = val
      if (val) {
        this.getCount()
        this.getErrorListInfo()
      }
    },

    visible (val) {
      this.$emit('update:modalVisible', val)
    }
  },

  methods: {
    showModal() {
      this.visible = true;
    },

    handleCancel(e) {
      this.visible = false;
    },

    getCount () {
      errorListInfoCount(this.keyWord ? {code: this.keyWord} : {}).then(e => {
        this.count = e
      })
    },

    getErrorListInfo () {
      this.loading = true
      let  params = {
        pageNo: this.page,
        pageSize: this.pageSize,
      }
      this.keyWord && (params.code = this.keyWord)
      errorListInfo(params).then(e => {
        this.loading = false
        this.$set(this, 'tableData', e.list)
      })
    },

    pageOnChange (pageNumber) {
      this.page = pageNumber
      this.getErrorListInfo()
    },

    sizeChange (page, pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.getErrorListInfo()
    },
  },
  created () {
    // this.getCount()
    // this.getErrorListInfo()
  }
}
</script>

<style lang="less" scoped>
.table-wrap{
  max-height: 500px;
  overflow:auto;
}
/deep/ .pagination{
  margin-top: 15px;
}
.error-item{
  font-size: 12px;
  & i{
    color: #FF4F4F;
  }
  .error-title {
    color: #FF4F4F;
  }
  .creative-time{
    color:#8BBBFF;
  }
  .error-icon{
    color: #ff4f4f;
    font-size:13px;
  }
}
</style>