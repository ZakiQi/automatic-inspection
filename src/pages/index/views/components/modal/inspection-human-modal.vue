<!-- 新增/编辑巡检人 -->
<template>
   <modal
    :title="(type === 'edit' ? '编辑' : '新增') + '巡检人'"
    :width="750"
    :visible.sync="visible"
    :centered="true"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel">
    <div class="inspection-human-wrap" title="">
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="巡检人">
          <a-input v-if="type === 'edit'" v-model="userName" :disabled="true" class="dark-theme custom-inp" />
          <a-tree-select
            v-if="type === 'add'"
            v-model="userName"
            style="width: 240px"
            :dropdown-style="dropdownStyle"
            :tree-data="treeData"
            :showSearch="true"
            :treeCheckStrictly="true"
            placeholder="Please select"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item label="联系电话">
          <a-input class="dark-theme custom-inp" :maxLength="maxLength" v-model="phone" />
        </a-form-item>

        <a-form-item label="对应账号">
          <a-input class="dark-theme custom-inp" :maxLength="userMaxLength" v-model="userId" />
        </a-form-item>

        <a-form-item label="巡检内容">
          <div class="inspection-auth">
            <div class="remind-title">短信提醒方式</div>
            <div class="remind-content">
              <a-checkbox v-for="(e, i) in sysInfo" :key="i" :checked="e.checked" @change="remindcheckChange(e,i)">
                <span class="checked-label">{{ e.label }}</span>
              </a-checkbox>
            </div>
          </div>

          <div class="inspection-auth">
            <div class="remind-title">系统提醒方式</div>
            <div class="remind-content">
              <a-checkbox v-for="(e, i) in smsInfo" :key="i" :checked="e.checked" @change="remindcheckChange(e,i)">
                <span class="checked-label">{{ e.label }}</span>
              </a-checkbox>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <div class="footer-btns" slot="footer">
      <a-button style="width:100px;height:26px;" key="back" ghost type="primary" @click="handleCancel">返回</a-button>
      <a-button style="width:100px;height:26px;" key="submit" type="primary" :loading="loading" @click="handleSubmit">
        {{ this.type === 'edit' ? '确认' : '添加' }}
      </a-button>
    </div>
  </modal>
</template>

<script>
import modal from '../common/modal'
import { getInspectorPostTree, getInspectorUserTree, saveInspector } from '@/lib/api/setting'

export default {
  props: {
    humanVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      dropdownStyle: {
        maxHeight: '300px', overflow: 'auto',background: '#414F6F',color: '#fff', 'font-size': '12px' 
      },
      visible: false,
      confirmLoading: false,
      loading: false,
      maxLength: 11,
      userMaxLength: 50,
      rowId: '',
      userName: '',
      phone: '',
      userId: '',
      sysInfo: [
        {code: 'sys-interface', label: '对外接口巡检'},
        {code: 'sys-application', label: '应用服务巡检'},
        {code: 'sys-colony', label: '集群巡检'},
        {code: 'sys-server', label: '服务器巡检'}
      ],
      smsInfo: [
        {code: 'sms-interface', label: '对外接口巡检'},
        {code: 'sms-application', label: '应用服务巡检'},
        {code: 'sms-colony', label: '集群巡检'},
        {code: 'sms-server', label: '服务器巡检'}
      ],
      inspectorPostTree: [],
      treeData: []
    }
  },

  components: {
    modal
  },

  watch: {
    humanVisible (val) {
      this.visible = val
    },

    visible (val) {
      this.$emit('update:humanVisible', val)
    },
    type () {
      if (this.type === 'add') {
        this.userName = ''
        this.phone = ''
        this.userId = ''
        this.rowId = ''
        this.remindcheckDefault()
      }
    },
    rowData (data) {
      if (this.type === 'edit') {
        this.userName = data.userName
        this.phone = data.phone
        this.userId = data.userId
        this.rowId = data.id
        const checkedInfo = data.inspectorConfigs.map(e => e.configCode)
        
        this.remindcheckDefault(checkedInfo)
      }
    }
  },

  methods: {
    showModal() {
      this.visible = true;
    },

    async initTreeInfo () {
      await this.getInspectorPostTree()
      this.getInspectorUserTree()
    },

    getInspectorPostTree () {
      return new Promise((reslove, reject) => {
        getInspectorPostTree().then(e => {
          this.inspectorPostTree = e
          reslove()
        })
      })
    },

    getInspectorUserTree () {
      getInspectorUserTree().then(e => {
        const treeOriginalArr = this.inspectorPostTree.concat(e)

        treeOriginalArr.forEach(e => {
          e.title = e.USERNAME
          e.key = e.ID + '_' + e.USERID
          e.value = e.ID + '_' +e.USERNAME
          e.PARENTID === 0 && this.treeData.push(e)
          let a = treeOriginalArr.filter(item => item.PARENTID === e.ID)
          if (a.length) {
            e.children = a
            e.disabled = true
          }
        })
      })
    },

    // 提醒改变
    remindcheckChange (e, i) {
      this.$set(e, 'checked', !e.checked)
    },

    // 默认选中,不传为初始化多选框
    remindcheckDefault (checkedInfo = []) {
      this.sysInfo.forEach(e => {
        this.$set(e, 'checked', checkedInfo.includes(e.code))
      })

      this.smsInfo.forEach(e => {
        this.$set(e, 'checked', checkedInfo.includes(e.code))
      })
    },

    handleCancel(e) {
      this.visible = false;
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },

    dataCheck () {
      if (!this.userName || !this.phone || !this.userId) {
        let arr = []
          !this.userName && arr.push('巡检人') 
          !this.phone && arr.push('联系电话') 
          !this.userId && arr.push('对应账号') 
        this.$message.warning(
          arr.join('、') + '不能为空！'
        )
        return false
      }
      return true
    },

    // 提交
    handleSubmit () {
      const checkRes = this.dataCheck()
      if (!checkRes) return

      let sysInfo = this.sysInfo.filter(e => e.checked).map(e => e.code)
      let smsInfo = this.smsInfo.filter(e => e.checked).map(e => e.code)
      let params = {
        userName: this.type === 'edit' ? this.userName : this.userName.split('_')[1],
        phone: this.phone,
        userId: this.userId,
        configCodes: sysInfo.concat(smsInfo).join(',')
      }

      this.type === 'edit' && (params.id = this.rowId)
      saveInspector(params).then(e => {
        this.$message.success(
          this.type === 'edit' ? '修改成功' : '添加成功'
        )
        this.type === 'edit' ? this.$emit('updateRow', e, this.treeVal) : this.$emit('initRow')
        this.visible = false
      })
    }
  },

  created () {
    this.initTreeInfo()
    // let arr = [
    //   {id: 1, pid: 0},
    //   {id: 2, pid: 0},
    //   {id: 3, pid: 1},
    //   {id: 4, pid: 2},
    //   {id: 5, pid: 2},
    //   {id: 6, pid: 1},
    // ]

    // let obj = []
    // arr.forEach(e => {
    //   e.pid === 0 && obj.push(e)
    //   let a = arr.filter(item => item.pid === e.id)
    //   if (a.length) e.children = a
    // })
    // console.log(obj, 'obj')
  }
}
</script>

<style lang="less" scoped>
.inspection-human-wrap{
  padding: 30px 0px;

  .custom-inp{
    width: 240px;
  }

  .inspection-auth{
    width: 100%;
    height: 80px;
    background-color: #3E4D73;
  }

  .dark-theme{
    background-color: #414F6F;
    border: none;
    color: #fff;
    border-radius: 5px;
    font-size: 12px;
  }
  
  .remind-title{
    height: 30px;
    line-height: 30px;
    background-color: #405487;
    border: 1px solid #4C629A;
    color: #fff;
    font-size: 12px;
    text-indent: 10px;
  }

  .remind-content{
    color: #fff;
    font-size: 12px;
    text-indent: 5px;
    line-height: 50px;
  }
  .checked-label{
    margin-left: 5px;
  }

  .footer-btns-item{
    width: 100px;
    height: 26px;
  }

  /deep/ .ant-form{
    & label{
      font-size: 12px;
    }

    .ant-form-item {
      margin-bottom: 14px;
    }
  }
   
  /deep/ .ant-form-item-label > label{
    color: #B6BECE;
  }
  /deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper{
    margin-left: 10px;
  }
  /deep/ .ant-checkbox + span{
    padding-right: 5px;
    padding-left: 2px;
    color: #fff;
  }

  /deep/ .ant-checkbox {
  }

  /deep/ .ant-select-selection{
    background-color: #414F6F;
    border: none;

    .ant-select-arrow-icon{
      color: #fff;
    }
  }

  /deep/ .ant-select-dropdown-content{
    background-color: #414F6F !important;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
  }
  /deep/ .ant-select-dropdown-menu-item-active{
    background: #5E95F6;
  }

  .ant-select-selection:hover{
    background-color: #414F6F !important;
    border-right: 2px solid #8a8f9d !important;
  }
  .ant-select-selection:active{
    background-color: #414F6F !important;
    border-right: 2px solid #8a8f9d !important;
  }
  .ant-select-selection:focus{
    border-right: 2px solid #8a8f9d !important;
    background-color: #414F6F !important;
  }
}
</style>

<!-- 树形下拉框样式 -->
<style lang="less">
li.ant-select-tree-treenode-disabled > .ant-select-tree-node-content-wrapper span{
  color: #8895AD;
}
.inspection-human-wrap[data-v-55108686] .ant-select-selection .ant-select-arrow-icon{
  color: #CADEFF;
}
.ant-select-selection-selected-value{
  color: #fff;
  font-size: 12px;
}

.ant-select-tree li .ant-select-tree-node-content-wrapper{
  color: #fff !important;
  font-size: 12px !important;
}

.ant-select-dropdown{
  overflow-y: auto;
  overflow-x: hidden !important;
}

.ant-select-tree-dropdown {
  .ant-select-dropdown-search {
    background: #414F6F;
  }
}
.ant-select-tree li .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected{
  background-color: #5E95F6;
}
.ant-select-tree .ant-select-tree-node-content-wrapper:hover{
  background-color: #49597B !important;
}
.ant-select-tree-switcher_open{
  display: none !important;
}
.ant-select-tree-dropdown .ant-select-dropdown-search .ant-select-search__field{
  border: 1px solid #303E59;
  background: #303E59;
  color: #fff;
}
</style>