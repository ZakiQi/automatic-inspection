<!-- 搜索部分 -->
<template>
  <div class="search-wrap">
    <div class="search-options-warp">
      <div style="display: inline;" v-show="searchConditions.customSearch">
        <div class="search-options">
          <span class="option-describe">状态 :</span>
          <a-select style="width: 95px;" v-model="searchConditions.status">
            <a-select-option v-for="(e, i) in statusOptions" :value="e.value" :key="i">
              {{e.name}}
            </a-select-option>
          </a-select>
        </div>

        <div class="search-options">
          <span class="option-describe">种类 :</span>
          <a-select v-model="searchConditions.kind" style="width: 95px;" :dropdownMatchSelectWidth="false">
            <a-select-option v-for="(e, i) in kindOptions" :value="e.value" :key="i">
              {{e.name}}
            </a-select-option>
          </a-select>
        </div>

        <div class="search-options" v-show="searchConditions.kind === 1">
          <span class="option-describe">cup :</span>
          <a-select style="width: 95px;" :dropdownMatchSelectWidth="false" v-model="searchConditions.cupStatus">
            <a-select-option v-for="(e) in cupOptions" :value="e.value" :key="e.value">
              {{e.name}}
            </a-select-option>
          </a-select>
        </div>

        <div class="search-options" v-show="searchConditions.kind === 1">
          <span class="option-describe">磁盘 :</span>
          <a-select style="width: 95px;" :dropdownMatchSelectWidth="false" v-model="searchConditions.diskStatus">
            <a-select-option v-for="(e) in diskOptions" :value="e.value" :key="e.value">
              {{e.name}}
            </a-select-option>
          </a-select>
        </div>

        <div class="search-options" v-show="searchConditions.kind === 1">
          <span class="option-describe">内存 :</span>
          <a-select style="width: 95px;" :dropdownMatchSelectWidth="false" v-model="searchConditions.memoryStatus">
            <a-select-option v-for="(e) in memoryOptions" :value="e.value" :key="e.value">
              {{e.name}}
            </a-select-option>
          </a-select>
        </div>

        <div class="search-options" v-show="searchConditions.kind === 2">
          <span class="option-describe">子分类 :</span>
          <a-select style="width: 95px;" :dropdownMatchSelectWidth="false" v-model="searchConditions.colony">
            <a-select-option v-for="e in colonyOptions" :value="e.value" :key="e.value">
              {{e.name}}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <div v-show="!searchConditions.customSearch" style="display: inline;">
        <a-input class="search-input" v-model="searchConditions.keyWord" placeholder="请输入清单名称或者编码名称进行搜索" />
      </div>
    </div>
    <a-button type="primary" style="line-height:32px;" @click="search"><i class="iconfont gb-search">&#xe60a;</i>搜索</a-button>
    <a-button class="custom-btn" @click="searchConditions.customSearch = !searchConditions.customSearch">{{ searchConditions.customSearch ? '自定义搜索' : '条件搜索' }} </a-button>
  </div>
</template>

<script>
import Bus from '@/lib/common/Bus'
export default {
  data () {
    return {
      statusOptions: [{value: -1, name: '全部'}, {value: 1, name: '正常'}, {value: 2, name: '告警'}, {value: 0, name: '异常'}],
      statusDefault: -1,
      kindOptions: [{value: -1, name: '全部'}, {value: 1, name: '服务器巡检'}, {value: 2, name: '集群巡检'}, {value: 3, name: '应用服务巡检'}, {value: 4, name: '对外接口巡检'}],
      cupOptions: [{value: -1, name: '全部'} ,{value: 1, name: '超过阈值'}, {value: 2, name: '未超过阈值'}],
      diskOptions: [{value: -1, name: '全部'} ,{value: 1, name: '超过阈值'}, {value: 2, name: '未超过阈值'}],
      memoryOptions: [{value: -1, name: '全部'} ,{value: 1, name: '超过阈值'}, {value: 2, name: '未超过阈值'}],
      colonyOptions: [{value: -1, name: '全部'} ,{value: 'spark', name: 'spark集群'}, {value: 'impala', name: 'impala集群'}, {value: 'hive', name: 'hive集群'}, {value: 'hbase', name: 'hbase集群'}, {value: 'hdfs', name: 'hdfs集群'}],
      kindValue: -1,
      statusVal: -1,
      searchConditions: {
        customSearch: true,
        keyWord: '',
        status: -1,
        kind: -1,
        cupStatus: -1,
        diskStatus: -1,
        memoryStatus: -1,
        colony: -1
      }
    }
  },

  watch: {
  },

  methods: {
    search () {
      Bus.$emit('searchHandler', this.searchConditions)
      // console.log(this.searchConditions, 'statusVal')
    }
  }
}
</script>


<style lang="less" scoped>
.search-wrap{
  height: 70px;
  line-height: 70px;
  background-color: #2B3651;
  border: 1px solid #2C3E61;
  padding: 0 22px;

  .search-options-warp{
    display: inline;
  }

  .option-describe{
    margin-right: 8px;
  }

  .search-options{
    margin-right: 20px;
    display: inline;
  }
  
  .gb-search{
    font-size: 13px;
    margin-right: 5px;
  }

  .custom-btn{
    margin-left: 20px;
    line-height:32px;
    border:1px solid #2971E8;
    color:#2971E8;
    background-color: transparent;
  }

  .search-input{
    width: 340px;
    background: #414F6F;
    border: none;
    font-size: 12px;
    color: #fff;
    margin-right: 20px;
  }

  /deep/ .ant-select-selection{
    background-color: #414F6F;
    border: 1px solid #414F6F;
    color: #CADEFF;
    font-size: 12px;
  }
  
  /deep/ .ant-select-selection-selected-value, /deep/ .ant-select-dropdown-menu-item{
    font-size: 12px;
  }
}
</style>