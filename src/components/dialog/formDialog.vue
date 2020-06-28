<template>
  <div id="formDialog">
    <el-dialog :title="formTitle"
               :visible.sync="formDialog"
               :before-close="closeDialog">
      <el-form :model="ruleForm"
               ref="ruleForm"
               :rules="rulesNow"
               label-width="110px">
        <span v-for="(res,index) in Object.keys(ruleForm)"
              :key="index"
              v-show="ruleForm[res].show">
          <el-form-item v-if="ruleForm[res].type === '1'"
                        :label="ruleForm[res].label"
                        :prop="ruleForm[res].name">
            <el-input v-model="ruleForm[res].value"></el-input>
          </el-form-item>
          <el-form-item v-if="ruleForm[res].type === '2'"
                        :label="ruleForm[res].label"
                        :prop="ruleForm[res].name">
            <el-select v-model="ruleForm[res].value">
              <el-option v-for="(item,indexI) in ruleForm[res].data"
                         :key="indexI"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </span>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    formTitle: {
      type: String,
      default: () => ''
    },
    formProp: {
      type: Object,
      default: () => { }
    },
    ruleForm: {
      type: Object,
      default: () => { }
    },
    // formArr: {
    //   type: Array,
    //   default: () => []
    // },
    rulesNow: {
      type: Object,
      default: () => { }
    },
    isCreate: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      formDialog: false,
      formDetail: {},
      ifTrue: false
    }
  },
  watch: {
    formDialog: {
      handler (val) {
        if (val) {
          setTimeout(() => {
            this.formDetail = JSON.parse(JSON.stringify(this.ruleForm))
            console.log('测试更新', this.formDetail)
          }, 500)
        } else {
          this.formDetail = {}
        }
      },
      deep: true
    },
    // rulesNow: {
    //   handler (val) {
    //     setTimeout(() => {
    //       this.rules = val
    //     })
    //   },
    //   deep: true
    // }
  },
  methods: {
    // 显示弹窗
    showDialog () {
      this.formDialog = true
    },
    // 关闭弹窗
    closeDialog () {
      let _this = this
      this.formDialog = false
      Object.keys(_this.ruleForm).forEach(res => {
        _this.ruleForm[res].value = ''
      })
    },
    //重置
    resetForm () {
      let _this = this
      if (_this.isCreate) {
        Object.keys(_this.ruleForm).forEach(res => {
          _this.ruleForm[res].value = ''
        })
      } else {
        Object.keys(_this.ruleForm).forEach(res => {
          _this.ruleForm[res].value = _this.formDetail[res].value
        })
        // _this.ruleForm = JSON.parse(JSON.stringify(_this.formDetail))
      }

    },
    // 确定
    submitForm (formName) {
      let _this = this
      _this.getNull()
      this.$refs[formName].validate((valid) => {
        if (valid && _this.ifTrue) {
          // alert('submit!');
          if (_this.isCreate) {
            _this.$emit('submit', _this.rebackData())
          } else {
            _this.$emit('editform', _this.rebackData())
          }
          // _this.rebackData()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    rebackData () {
      let _this = this
      console.log('测试', _this.ruleForm)
      let cc = {}
      Object.keys(_this.ruleForm).forEach(res => {
        // console.log('测试key', res)
        // console.log('测试key值', _this.ruleForm[res])
        cc[res] = _this.ruleForm[res]['value']
      })
      console.log('测试这个cc', cc)
      return cc
    },
    // 检验为空
    getNull () {
      let _this = this
      for (let res of Object.keys(_this.ruleForm)) {
        if (_this.ruleForm[res]['value'] === '') {
          setTimeout(() => {
            _this.$message.error(`${_this.ruleForm[res]['label']}不能为空`)
            _this.ifTrue = false
          })
          break
        } else {
          _this.ifTrue = true
        }
      }

    }
  }
}
</script>
<style lang="scss" scoped>
#formDialog /deep/ .el-dialog__body {
  max-height: 400px;
  overflow-y: auto;
}
#formDialog /deep/ .el-select {
  width: 100%;
}
#formDialog {
  width: 100%;
}
</style>