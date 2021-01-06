<!-- 通用主题色的弹框 -->
<template>
  <a-modal
    v-bind="$attrs" 
    v-on="$listeners">
    <slot></slot>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
/deep/ .ant-modal{
  color: #fff;
  .ant-modal-title{
    color: #fff;
    font-size: 14px;
  }
  .ant-modal-close{
    color: #fff;
    display: block;
    transition: all .4s;
    transition-timing-function: ease-out;
  }
  .ant-modal-close:hover{
    transform: rotate(360deg);
  }
  .ant-modal-header{
    background: #435473;
    border: none;
    padding: 9px 24px;
  }
  .ant-modal-body{
    background: #303E59;
    border: none;
  }
  .ant-modal-footer{
    border: none;
    background-color: #354563;
    text-align: center;
  }
  .ant-modal-close-x{
    display: block;
    height: 40px;
    width: 40px;
    line-height: 45px;
  }
  .ant-modal-body{
    padding: 20px;
  }
  .vxe-body--column{
    padding: 8px 0;
  }
}
</style>