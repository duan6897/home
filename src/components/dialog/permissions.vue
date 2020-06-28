<template>
  <div id="permissions">
    <el-dialog :title="title"
               :visible.sync="permissionsDialog"
               width="30%"
               :before-close="handleClose">
      <span>
        <el-table :data="permissionData"
                  height="300px"
                  ref="selectionTable"
                  @selection-change="handleSelectionChange"
                  border>
          <el-table-column type="selection"
                           width="55"></el-table-column>
          <el-table-column label="权限名称"
                           prop="name"
                           align="center">
          </el-table-column>
        </el-table>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="permissionsDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="permissionsDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'permissions',
  props: {
    title: {
      type: String,
      default: () => ''
    },
    permissionData: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.$nextTick(() => {

    })
  },
  data () {
    return {
      permissionsDialog: false
    }
  },
  methods: {
    handleClose () {
      let _this = this
      _this.permissionsDialog = false
    },
    handleShow () {
      let _this = this
      _this.permissionsDialog = true
    },
    // 选定
    handleSelectionChange (val) {
      console.log('测试这个val', val)
    },
    // 重新选定
    choseSelection () {
      let _this = this
      _this.permissionData.forEach(res => {
        _this.$refs.selectionTable.toggleRowSelection(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>