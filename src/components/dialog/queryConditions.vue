<template>
  <div id="queryConditions">
    <el-dialog title="查询条件"
               :visible.sync="queryShow"
               :before-close="closeQueryShow">
      <el-tabs v-model="activeName"
               @tab-click="handleClick"
               type="border-card">
        <el-button class="restButton"
                   type="primary"
                   plain
                   @click="restList">重置</el-button>
        <el-button class="showLastData"
                   type="primary"
                   @click="showSaveData">显示保存数据</el-button>
        <el-tab-pane name="first"
                     label="物化性能">
          <div class="querySelect">
            <el-select v-model="whValue"
                       filterable
                       @change="whChange"
                       placeholder="请选择"
                       value-key="csId">
              <el-option v-for="item in whoptions"
                         :key="item.csId"
                         :label="item.csmc"
                         :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="queryTitle"
               v-if="whList.length > 0">
            <span class="scopeValue">范围值</span>
            <span class="standardValue">标准值</span>
          </div>
          <div style="clear:both"></div>
          <div class="inputShow"
               v-for="(res,index) in whList"
               :key="index">
            <span class="name">{{res.name}}</span>
            <span class="standardSpan">
              <el-input v-model="res.equ"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        @focus="changeWH('equ',res)"
                        placeholder=""></el-input>
            </span>
            <span class="scopeSpan"
                  id="whSpan">
              <el-input v-model="res.min"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        placeholder=""
                        @focus="changeWH('min',res)"></el-input>
              <span>-</span>
              <el-input v-model="res.max"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        placeholder=""
                        @focus="changeWH('max',res)"></el-input>
            </span>
            <span>
              <el-button icon="el-icon-remove-outline"
                         @click="deleteWhList(res,index)"></el-button>
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane name="second"
                     label="力学性能">
          <div class="querySelect">
            <el-select v-model="lxValue"
                       filterable
                       @change="lxChange"
                       placeholder="请选择"
                       value-key="csId">
              <el-option v-for="item in lxoptions"
                         :key="item.csId"
                         :label="item.csmc"
                         :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="queryTitle"
               v-if="whList.length > 0">
            <span class="scopeValue">范围值</span>
            <span class="standardValue">标准值</span>
          </div>
          <div style="clear:both"></div>
          <div class="inputShow"
               v-for="(res,index) in lxList"
               :key="index">
            <span class="name">{{res.name}}</span>
            <span class="standardSpan">
              <el-input v-model="res.equ"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        placeholder=""
                        @focus="changeLX('equ',res)"></el-input>
            </span>
            <span class="scopeSpan"
                  id="lxSpan">
              <el-input v-model="res.min"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        placeholder=""
                        @focus="changeLX('min',res)"></el-input>
              <span>-</span>
              <el-input v-model="res.max"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        @focus="changeLX('max',res)"
                        placeholder=""></el-input>
            </span>
            <span>
              <el-button icon="el-icon-remove-outline"
                         @click="deleteLxList(res,index)"></el-button>
            </span>
          </div>
        </el-tab-pane>

      </el-tabs>
      <div slot="footer"
           class="dialog-footer">
        <!-- <el-button @click="queryShow = false">取 消</el-button> -->
        <el-button type="primary"
                   @click="sureButton">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import httpRequest from '@/assets/api/request'
export default {
  name: 'queryConditions',
  data () {
    return {
      activeName: 'first',
      queryShow: false,
      whValue: '',
      whoptions: [],
      whOPList: [],
      whList: [

      ],
      lxValue: '',
      lxoptions: [],
      lxOPList: [],
      lxList: [
      ]
    }
  },
  watch: {
    queryShow: {
      handler (val) {
        if (val) {
          this.getWH()
        }
      }
    }
  },
  mounted () {
    this.getWH()
  },
  methods: {
    // 删除
    deleteWhList (res, index) {
      let _this = this
      _this.whList.splice(index, 1)
      _this.whoptions = JSON.parse(JSON.stringify(_this.whOPList))
      _this.whoptions.forEach((res, index) => {
        _this.whList.forEach(item => {
          if (res.csId === item.csId) {
            _this.whoptions.splice(index, 1)
          }
        })
      })
    },
    // 删除 deleteLxList
    deleteLxList (res, index) {
      console.log('测试删除deleteLxList', res, index)
      let _this = this
      _this.lxList.splice(index, 1)
      _this.lxoptions = JSON.parse(JSON.stringify(_this.lxOPList))
      _this.lxoptions.forEach((res, index) => {
        _this.lxList.forEach(item => {
          if (res.csId === item.csId) {
            _this.lxoptions.splice(index, 1)
          }
        })
      })
    },
    // 标签点击
    handleClick (tab, event) {
      let _this = this
      console.log('测试这个tab', tab, event)
      console.log('测试这个', tab.name)
      console.log('测试这个tab点击', tab.label)
      switch (tab.name) {
        case 'first':
          _this.getWH()
          break;
        case 'second':
          _this.getLX()
          break
        default:
          break
      }
    },
    // 获取雾化性能
    getWH () {
      let _this = this
      httpRequest.get('material/cszd/listByWHXN', {}, res => {
        console.log('测试雾化性能', res)
        if (res.data.ok) {
          _this.whOPList = JSON.parse(JSON.stringify(res.data.data))
          _this.whoptions = res.data.data
          _this.whoptions.forEach((res, index) => {
            _this.whList.forEach(re => {
              if (res.csId === re.csId) {
                _this.whoptions.splice(index, 1)
              }
            })
          })
        }
      })
    },
    // 获取力学性能
    getLX () {
      let _this = this
      httpRequest.get('material/cszd/listByLXXN', {}, res => {
        console.log('测试雾化性能', res)
        if (res.data.ok) {
          _this.lxoptions = res.data.data
          _this.lxOPList = JSON.parse(JSON.stringify(res.data.data))
          _this.lxoptions.forEach((res, index) => {
            _this.lxList.forEach(re => {
              if (res.csId === re.csId) {
                _this.lxoptions.splice(index, 1)
              }
            })
          })
        }
      })
    },
    // 显示弹窗
    showQueryDialog () {
      this.queryShow = true
    },
    // 雾化选择
    whChange (val) {
      console.log('测试', val)
      let _this = this
      _this.whList.push({ name: `${val.csmc}(${val.csdw})`, equ: '', max: '', min: '', csId: val.csId, csPid: val.csPid })

      _this.whoptions.forEach((res, index) => {
        if (res.csId === val.csId) {
          console.log('测试这个res', res)
          _this.whoptions.splice(index, 1)
        }
      })
    },
    // 力学选择
    lxChange (val) {
      console.log('测试力学', val)
      let _this = this
      _this.lxList.push({ name: `${val.csmc}(${val.csdw})`, equ: '', max: '', min: '', csId: val.csId, csPid: val.csPid })
      _this.lxoptions.forEach((res, index) => {
        if (res.csId === val.csId) {
          console.log('测试这个res', res)
          _this.lxoptions.splice(index, 1)
        }
      })
    },
    // 关闭弹窗
    closeQueryShow () {
      this.queryShow = false
      let _this = this
      let options = []
      let wh = _this.whList.map(res => {
        return {
          "csName": res.name,
          "csId": res.csId,
          "csPid": res.csPid,
          "equ": res.equ,
          "max": res.max,
          "min": res.min
        }
      })
      let lx = _this.lxList.map(res => {
        return {
          "csName": res.name,
          "csId": res.csId,
          "csPid": res.csPid,
          "equ": res.equ,
          "max": res.max,
          "min": res.min
        }
      })
      options = [...wh, ...lx]
      _this.$emit('resoption', options)
    },
    // 获取用户保存的 material/userQuery/list
    getUserSave () {
      let _this = this
      _this.whList = []
      _this.lxList = []
      httpRequest.post('/material/userQuery/list', {}, res => {
        if (res.data.ok) {
          res.data.data.forEach(res => {
            if (res.csPid === 'XN_WHXN') {
              _this.whList.push({ name: res.csName, equ: res.equ, max: res.max, min: res.min, csId: res.csId, csPid: res.csPid })
            } else {
              _this.lxList.push({ name: res.csName, equ: res.equ, max: res.max, min: res.min, csId: res.csId, csPid: res.csPid })
            }
          })
        }
      })
    },
    // 确定按钮
    sureButton () {
      let _this = this
      let options = []
      let wh = _this.whList.map(res => {
        return {
          "csName": res.name,
          "csId": res.csId,
          "csPid": res.csPid,
          "equ": res.equ,
          "max": res.max,
          "min": res.min
        }
      })
      let lx = _this.lxList.map(res => {
        return {
          "csName": res.name,
          "csId": res.csId,
          "csPid": res.csPid,
          "equ": res.equ,
          "max": res.max,
          "min": res.min
        }
      })
      options = [...wh, ...lx]
      _this.$emit('resoption', options)
      httpRequest.post('material/userQuery/saveQueryParam', options, res => {
        console.log('测试保存', res)
        if (res.data.ok) {
          _this.closeQueryShow()
        }
      })
    },
    // 重置按钮
    restList () {
      let _this = this
      _this.whList = []
      _this.lxList = []
      _this.whoptions = JSON.parse(JSON.stringify(_this.whOPList))
      _this.lxoptions = JSON.parse(JSON.stringify(_this.lxOPList))
    },
    // 显示保存的数据
    showSaveData () {
      this.getUserSave()
    },
    changeWH (word, event) {
      console.log('测试这个', word, event)
      if (word === 'equ') {
        event.min = ''
        event.max = ''
      } else {
        event.equ = ''
      }
    },
    changeLX (word, event) {
      console.log('测试这个', word, event)
      if (word === 'equ') {
        event.min = ''
        event.max = ''
      } else {
        event.equ = ''
      }
    },
  }
}
</script>
<style lang="scss" scoped>
#whSpan /deep/ .el-input {
  width: 46%;
}
#lxSpan /deep/ .el-input {
  width: 46%;
}
#queryConditions {
  .restButton {
    float: right;
  }
  .showLastData {
    float: right;
    margin-right: 20px;
  }
  .querySelect {
    width: 100%;
  }
  .queryTitle {
    width: 100%;
    height: 30px;
    line-height: 30px;
    span {
      display: block;
    }
    .standardValue {
      float: right;
      margin-right: 210px;
    }
    .scopeValue {
      float: right;
      margin-right: 140px;
    }
  }
  .inputShow {
    width: 100%;
    margin-top: 20px;
    span {
      display: inline-block;
    }
    .name {
      width: 120px;
    }
    .standardSpan {
      width: 130px;
    }
    .scopeSpan {
      margin-left: 10px;
      width: 280px;
    }
  }
}
</style>