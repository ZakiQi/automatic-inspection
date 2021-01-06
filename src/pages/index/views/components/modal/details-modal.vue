<!-- 磁盘弹出框 -->
<template>
   <modal
    :title="detailsTitle"
    :width="700"
    :visible.sync="visible"
    :confirm-loading="confirmLoading"
    :centered="true"
    @cancel="handleCancel"
    :footer="null">
    <div class="details-log-wrap" title="">
      <p>巡检清单： {{detailsInfo.codeDescribe || '--'}}</p>
      <div class="operate-wrap">
        <span>巡检周期： 5分钟</span>
        <div class="threshold">
          阈值： 
          <span v-show="!edit">{{detailsInfo.thresholdValue || '--'}} {{ detailsInfo.thresholdValue && '%'}} </span>
          <i v-show="!edit" class="iconfont edit-icon" @click="showInput">&#xe611;</i>
          <a-input ref="inputNumber"
            v-show="edit" 
            :size="'small'" 
            v-model="threshold" 
            class="custom-input"
            suffix="%" 
            @keyup="inputValue"
            @keydown.enter="sumbitThresholdValue"
            @blur="sumbitThresholdValue" 
          />
        </div>
      </div>
      <!-- <p>磁盘使用情况</p> -->
      <div class="charts-wrap">
        <lineChart 
          :options="lineData || []" 
          :thresholdValue="detailsInfo.thresholdValue" 
          :type="type" ref="lineChart"
          :name="optionsInfo[type]">
        </lineChart>
      </div>
    </div>
  </modal>
</template>

<script>
import modal from '../common/modal'
import lineChart from '@/components/charts/line'
import _ from 'lodash'
import { updateInspectionCodeByCode, queryInspectionCodeByCode } from '@/lib/api/inspection'

export default {
  props: {
    detailsModalVisible: {
      type: Boolean,
      default: false
    },
    rowData : {
      type: Object,
      default: () => {}
    },
    detailsTitle: {
      type: String,
      default: '巡检日志'
    },
    type: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      visible: false,
      confirmLoading: false,
      loading: false,
      detailsInfo: {},
      lineData: [],
      optionsInfo: {
        cpu: 'CPU',
        memory: '内存'
      },
      threshold: '',
      edit: false
    }
  },

  components: {
    modal,
    lineChart
  },

  watch: {
    detailsModalVisible (val) {
      this.visible = val
    },

    visible (val) {
      this.$emit('update:detailsModalVisible', val)
    },

    rowData (data) {
    }
  },

  methods: {
    showModal() {
      this.visible = true;
    },

    handleCancel(e) {
      this.visible = false;
    },

    showInput () {
      this.edit = true
      this.$nextTick(e => {
        this.$refs.inputNumber.focus()
      })
    },

    // 只能整数
    inputValue () {
      this.$set(this, 'threshold', this.threshold.replace(/[^\d]/g,''))
    },

    queryDetailsInfo () {
      const params = {
        code: this.rowData.code + '-' + this.optionsInfo[this.type]
      }
      queryInspectionCodeByCode(params).then(e => {
        if (e) {
          this.detailsInfo = e.inspectionCode
          this.lineData = e.result
          this.threshold = this.detailsInfo.thresholdValue

          this.$nextTick(e => {
            this.$refs.lineChart.initData()
          })
        }
      })
    },

    sumbitThresholdValue: _.debounce (function () {
      if (this.threshold) {
        if (this.threshold > 100) this.threshold = 100
        const params = {
          code: this.detailsInfo.code,
          thresholdValue: this.threshold
        }
        updateInspectionCodeByCode(params).then(e => {
          this.$message.success('修改成功')
          this.$set(this.detailsInfo, 'thresholdValue', this.threshold)
        })
      }
      this.edit = false
    }, 300) 
  },

  created () {
  }
}
</script>

<style lang="less" scoped>
.details-log-wrap{
  padding: 40px 70px;
  font-size: 12px;
  user-select: none;
  color: #B6BECE;

  .operate-wrap{
    margin-bottom: 1em;
  }

  .edit-icon{
    font-size: 18px;
    position: relative;
    top: 2px;
    margin: 0 5px;
    cursor: pointer;
    &:hover{
      color: #94BEFF;
    }
  }

  /deep/ .ant-input{
    background-color: #414F6F;
    color: #fff;
    border:none;
    font-size: 12px;

  }
  /deep/  .ant-input-suffix{
    color: #fff;
    font-size: 12px;;
  }

  .threshold{
    display: inline;
    margin-left: 200px;
  }

  .charts-wrap{
    height: 240px;
    width: 100%;
    // overflow: hidden;
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
</style>