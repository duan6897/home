<template>
  <div id="formDialog">
    <el-dialog :title="formTitle"
               :visible.sync="formDialog"
               :before-close="closeDialog">
      <el-form :model="form"
               ref="ruleForm"
               :rules="rulesNow"
               label-width="110px">
        <span v-for="(res,index) in ruleForm"
              :key="index"
              v-show="res.show">
          <el-form-item v-if="res.type === '1'"
                        :label="res.label"
                        :prop="res.name">
            <el-input v-model="form[res.name]"
                      @change="getName(res)"></el-input>
          </el-form-item>
          <el-form-item v-if="res.type === '2'"
                        :label="res.label"
                        :prop="res.name">
            <el-select v-model="form[res.name]"
                       @change="getName(res)">
              <el-option v-for="(item,indexI) in res.data"
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
      type: Array,
      default: () => []
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
      ifTrue: false,
      form: {}
    }
  },
  watch: {
    formDialog: {
      handler (val) {
        if (val) {
          setTimeout(() => {
            this.formDetail = JSON.parse(JSON.stringify(this.ruleForm))
            console.log('测试更新', this.formDetail)
            this.changeForm()
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
    getName (res) {
      let _this = this
      _this.form[res] = _this.ruleForm[res].value
    },
    //
    changeForm () {
      let _this = this
      _this.$nextTick(() => {
        _this.ruleForm.forEach(res => {
          _this.form[res.name] = _this.ruleForm[res]['value']
        })
      })
      console.log('测试这个,_this.form', _this.form)
    },
    // 关闭弹窗
    closeDialog () {
      let _this = this
      this.formDialog = false
      Object.keys(_this.form).forEach(res => {
        _this.form[res] = ''
      })
    },
    //重置
    resetForm (formName) {
      let _this = this
      this.$refs[formName].resetFields();
      if (_this.isCreate) {
        Object.keys(_this.form).forEach(res => {
          // _this.form.value = ''
          _this.form[res] = ''
        })
      } else {
        _this.formDetail.forEach(res => {
          _this.ruleForm[res].value = _this.formDetail[res].value
          _this.form[res.name] = _this.formDetail[res].value
        })
        // _this.ruleForm = JSON.parse(JSON.stringify(_this.formDetail))
      }

    },
    // 确定
    submitForm (formName) {
      let _this = this
      // _this.getNull()
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
      Object.keys(_this.form).forEach(res => {
        // console.log('测试key', res)
        // console.log('测试key值', _this.ruleForm[res])
        cc[res] = _this.form[res]
      })
      console.log('测试这个cc', cc)
      return cc
    },

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