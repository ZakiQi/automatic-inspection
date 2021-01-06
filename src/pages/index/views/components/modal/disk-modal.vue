<!-- 磁盘弹出框 -->
<template>
   <modal
    title="磁盘巡检日志"
    :width="700"
    :visible.sync="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    :footer="null">
    <div class="disk-log-wrap">
      <p>巡检清单： {{ rowDatadiskInfo && rowDatadiskInfo.content }}</p>
      <p>巡检周期： 5分钟</p>
      <p>磁盘使用情况</p>
      <div>
        <vxe-table :data="tableData" :loading="loading" :centered="true" max-height="300">
          <vxe-table-column field="code" title="磁盘分区"></vxe-table-column>
          <vxe-table-column field="status" title="状态" width="50">
            <template v-slot="{ row }">
              <span v-if="row.status === 2" style="color: #FF4F4F;">异常</span>
              <span v-else-if="row.status === 3" style="color: #FFA65D;">告警</span>
              <span v-else style="color: #4DAF63;">正常</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="shqk" title="使用情况">
            <template v-slot="{ row }">
              <div class="memory">
                <div class="memory-text" :title="`${row.resultValue}` + 'KB / ' + `${row.totalValue}` + 'KB'">
                  {{row.resultValue}} KB / {{row.resultValue}} KB
                </div>
                <div class="memory-bar">
                  <a-progress :percent="setPercent(row.resultValue, row.totalValue)" :show-info="false" :size="'small'" :stroke-color="strokeColor(row.resultValue, row.content)" />
                </div>
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column title="阈值" width="100">
            <template v-slot="{ row, rowIndex }">
              <div>
                <span v-show="!row.edit">{{ row.thresholdValue || 'Null' }} {{row.thresholdValue && '%'}}</span>
                <a-input v-show="row.edit" :size="'small'" ref="editInput" @blur="submitEmit(row)"  @keyup="(data) => inputChange(data, row)" v-model="row.newThresholdValue" class="custom-input" suffix="%" />
                <a-icon v-show="!row.edit" class="threshold-edit" type="edit" @click="itemEdit(rowIndex)" />
                <a-icon v-show="row.edit" class="threshold-submit" type="check-square" @click="submitEmit(row)" />
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </modal>
</template>

<script>
import modal from '../common/modal'
import { queryDiskJson, updateInspectionCodeByCode } from '@/lib/api/inspection'

export default {
  props: {
    diskModalVisible: {
      type: Boolean,
      default: false
    },
    rowData : {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      visible: false,
      confirmLoading: false,
      loading: false,
      tableData: [],
      rowDatadiskInfo: [],
      diskCode: ''
    }
  },

  components: {
    modal,
    // aInput
  },

  watch: {
    diskModalVisible (val) {
      this.visible = val
    },

    visible (val) {
      this.$emit('update:diskModalVisible', val)
    },

    rowData (data) {
      this.rowDatadiskInfo = data
      this.diskCode = data.diskCode
      this.diskCode && this.queryDiskInfo()
    }
  },

  methods: {
    showModal() {
      this.visible = true;
    },

    handleCancel(e) {
      this.visible = false;
    },

    queryDiskInfo () {
      queryDiskJson({code: this.diskCode}).then(e => {
        if (e) {
          this.tableData = e
        }
      })
    },

    // 内存进度条颜色
    strokeColor (value, total) {
      const res = (+value / +total) * 100
      if (res <= 100 && res > 80) {
        return '#FF4F4F'
      } else if (res <= 80  && res > 60){
        return '#3E86ED'
      } else {
        return '#4DAF63'
      }
    },

    setPercent (value, total) {
      const res = (+value / +total) * 100
      return res
    },

    itemEdit (index) {
      let res = this.tableData.find(e => e.edit)
      res && this.$set(res, 'edit', false)

      const data = this.tableData[index]
      this.$set(data, 'edit', !data.edit)
    },

    // 控制值必须是数字
    inputChange (data, row) {
      
      this.$set(row, 'newThresholdValue', row.newThresholdValue.replace(/[^\d]/g,''))
    },

    submitEmit (row) {
      if (!row.newThresholdValue) return this.$set(row, 'edit', false)
      // 超过100会自动变成100%
      if (+row.newThresholdValue > 100) this.$set(row, 'newThresholdValue', 100)
      
      const params = {
        code: row.code,
        thresholdValue: row.newThresholdValue
      }
    
      row.newThresholdValue && updateInspectionCodeByCode(params).then(e => {
        this.$set(row, 'thresholdValue', row.newThresholdValue)
        this.$set(row, 'newThresholdValue', '')
      })
      this.$set(row, 'edit', false)
    }
  },

  created () {
  }
}
</script>

<style lang="less" scoped>
.disk-log-wrap{
  padding: 40px 70px;
  font-size: 12px;
  user-select: none;
  color: #B6BECE;

  .threshold-edit{
    cursor: pointer;
    margin-left: 5px;
    color: #37BDFF;
  }
  .threshold-submit{
    color: #4DAF63;
  }
  .custom-input{
    width: 60px;
    margin-right: 5px;
    background-color: #414F6F;
    border: none;
    color: #fff;
    border-radius: 5px;
  }
}


/deep/.vxe-table {
  font-size: 12px;
  .vxe-header--column {
    padding: 8px 0 !important;
  }
  .vxe-body--column{
    padding: 10px 0 !important;
  }

  .memory{
    font-size: 12px;
    color: #8BBBFF;

    .memory-text{
      line-height: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .memory-bar{
      padding-right: 5%;
    }
  }
  .ant-input-affix-wrapper .ant-input:not(:last-child){
    padding-right: 20px;
  }
  .ant-input-affix-wrapper .ant-input-suffix{
    right: 5px;
    color: #fff;
  }
  .ant-input{
    background-color: #414F6F;
    color: #fff;
    border:none;
    font-size: 12px;
  }
}
</style>