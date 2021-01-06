<template>
  <div class="common-wrap">
      <div class="wrap-header">
        {{headerText}}
        <slot name="num"></slot>
      </div>
      <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },

  computed: {
  }
}
</script>

<style lang="less" scoped>
.common-wrap{
  margin-top: 10px;
  border: 1px solid #2C3E61;
  background-color: #2B3651;
  color: #98BDFF;

 .wrap-header{
   height: 38px;
   line-height: 38px;
   padding: 0 14px;
   background-color: #303D5C;
 } 
}
</style>
