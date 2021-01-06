<template>
  <v-chart v-bind="$attrs" class="line-charts" ref="line" :options="lineData"  :chartsType="'line'"></v-chart>
</template>

<script>
import ECharts from "vue-echarts"
import "echarts/lib/component/legend"
import "echarts/lib/component/tooltip"
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataZoom'
import "echarts/lib/chart/line"
import tableMixins from '@Ind/views/mixins/table-mixins'

export default {
  mixins: [tableMixins],
  props: {
    options: {
      type: Array,
      default: () => []
    },
    // 阈值
    thresholdValue: {
      type: String/Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },

  watch: {
    thresholdValue (val) {
      this.initData()
    }
  },

  data () {
    return  {
      // 图表基础信息
      lineData: {
        tooltip: {
          trigger: 'axis',
          formatter: function (param) {
            return '<div style="padding: 3px;font-size: 12px;">时间：' + param[0].axisValue + '<br/>使用率：' +  param[0].value + '%</div>'
          }
        },
        grid: {
          top: '16%',
          left: '0%',
          right: '0%',
          bottom: '38px',
          containLabel: true
        }, 
        legend: {
          show: false
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',  //更改坐标轴文字颜色
              fontSize : 12      //更改坐标轴文字大小
            }
          },
          axisTick: {
            show: false
          },
          axisLine:{
            lineStyle:{
              color:'#C1CEF9' //更改坐标轴颜色
            }
          }
        },
        yAxis: {
            type: 'value',
            // name: '使用率（%）',
            splitLine: {
                show: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',  //更改坐标轴文字颜色
                fontSize : 12      //更改坐标轴文字大小
              }
            },
            axisLine:{
              show: false,
              lineStyle:{
                color:'#C1CEF9' //更改坐标轴颜色
              }
            },
            axisTick: {
              show: false
            },
            // 修改Y轴坐标名称
            axisLabel: {
              margin: 5,
              // 后缀
              formatter: function (value, index) {
                return value + '%'
              }
            },
            nameTextStyle: {
              align: 'left',
              padding: [0, 0, 5, -30],
              color: '#B6BECE'
            },
            max:function (value) {
                return value.max + 1
            },
            min: 0,
        },
        // 视觉映射,用于数据分段展示
        visualMap: {
            show: false,
            pieces: [{
                gt: 0,
                lte: 70,
                color: '#087BEA'
            }],
            //{
            //     gt: 0.5,
            //     lte: 2,
            //     color: '#FF4F4F'
            // }],
        },
        series: [{
            data: [],
            type: 'line',
            smooth: false
        }],
        dataZoom: [{
          type: 'slider',//slider表示有滑动块的，
          show:true,
          xAxisIndex:[0],//表示x轴折叠
          state: 1,
          end: 98,
          top: 'bottom',
        }],
      }
    }
  },

  components: {
    'v-chart': ECharts
  },

  methods: {
    initData () {
      let seriesData = []
      let xAxisData = []
      this.options.forEach(e => {
        let xDate = this.formatDate(e.ZONETIME, 'hh:mm')
        xAxisData.push(xDate)
        seriesData.push(+e.PERCENTAGE)
      })
      
      this.lineData.yAxis.name = this.name + '使用率(%)'
      this.lineData.xAxis.data = xAxisData
      this.$set(this.lineData.xAxis, 'data', xAxisData)
      this.$set(this.lineData.series[0], 'data', seriesData)
      
      // 阈值显示处理
      this.lineData.visualMap.pieces[0].lte = +this.thresholdValue ? +this.thresholdValue : 70
      const obj = {
          gt: +this.thresholdValue || 70,
          lte: 100,
          color: '#FF4F4F'
      }
      this.lineData.visualMap.pieces[1] = obj
    }
  }
}
</script>

<style lang="less" scoped>
.line-charts{
  width: 100%;
  height: 100%;
}
</style>