<template>
  <div class="pagination">
    <a-pagination 
      show-size-changer
      show-quick-jumper
      :default-current="2"
      :page-size-options="pageSizeOptions"
      v-bind="$attrs" 
      v-on="$listeners"/>
      <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return  {
      pageSizeOptions: ['5', '10', '20', '30', '50'],
    }
  }
}
</script>

<style lang="less" scoped>
.pagination{
  text-align: center;
  margin: 15px 0;
  position: relative;

  /deep/ .ant-pagination-item-active{
    font-weight: 500;
    background: #3E86ED;
    border-color: #3E86ED;
    a {
      color: #fff;
    }
  }

  /deep/ .ant-pagination.mini .ant-pagination-item{
    min-width: 24px;
    height: 24px;
    margin: 0 2px;
    line-height: 22px;
    border: 1px solid #325093;
    a {  color: #fff; }
  }

  /deep/ .ant-pagination-options-quick-jumper input{
    background-color: #374360;
    border: 1px solid #325093;
    color: #fff;
  }

  /deep/ .ant-pagination-prev a, /deep/ .ant-pagination-next a{
    color: #fff;
  }

  /deep/ .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis, 
  /deep/ .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis{
    color: #fff;
  }

  /deep/ .ant-select-selection{
    background-color: #2B3651;
    border: 1px solid #2C3E61;
  }
  
  /deep/ .ant-select{
    color: #fff;
    & i{
      color: #fff;
    }
  }

  .ant-pagination{
    color: #fff;
  }
}
</style>