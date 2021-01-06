<!-- 自动化巡检设置头部 -->
<template>
  <div class="setting-header">
    <a-button class="basic-btn" type="primary" @click="inspectionOperation('offline')">下线</a-button>
    <a-button class="basic-btn" type="danger" @click="inspectionOperation('delete')">删除</a-button>
    <a-button class="basic-btn" type="primary" @click="inspectionOperation('add')" ghost>新增</a-button>

    <a-button type="primary" style="float:right;" @click="search"><i class="iconfont gb-search">&#xe60a;</i>搜索</a-button>
    <a-input class="basic-inp" v-model="userName" @keyup.enter="search" placeholder="请输入巡检人名称进行搜索" />
    <a-button type="link" class="callack-link" @click="goIndex">返回</a-button>
  </div>
</template>

<script>
// import settingMixins from '@Ind/views/mixins/setting-mixins'
import Bus from '@/lib/common/Bus'
export default {
  // mixins: [settingMixins],
  data () {
    return {
      userName: ''
    }
  },

  components: {
  },

  methods: {
    goIndex () {
      this.$router.push({path: '/'})
    },

    inspectionOperation (type) {
      Bus.$emit('inspectionOperation', type)
    },

    search () {
      Bus.$emit('searchUser', this.userName)
    }
  }
}
</script>
<style lang="less" scoped>
.setting-header{
  height: 32px;
  overflow: hidden;

  .basic-btn{
    margin-right: 10px;
  }
   
  .basic-inp{
    width: 300px;
    float:right;
    margin-right: 10px;
    background-color: #414F6F;
    color: #fff;
    border: none;
  }

  .callack-link{
    float:right;
    margin-right: 10px;

    &:hover{
      color: #FFA65D;
    }
  }
}
</style>
