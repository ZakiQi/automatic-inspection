<template>
   <a-input class="custom-input" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  props: {
    value: {}
  },

  watch: {
    value (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="less" scoped>
.custom-input{
  background-color: #414F6F;
  border: none;
}
</style>