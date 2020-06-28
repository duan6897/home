/** 材料对比 */
<template>
  <div id="contrast">
    <el-row class="contrastTop">
      <span class="contrastForm">
        <el-form :inline="true"
                 ref="searchForm"
                 :model="searchForm">
          <el-form-item label="车辆品牌:">
            <el-input v-model="searchForm.clpp"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="零部件名称:">
            <el-input v-model="searchForm.lbjmc"
                      placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </span>

      <span class="contrastButton">
        <el-button type="primary"
                   @click="queryList"> 检索</el-button>
        <el-button plain
                   @click="reset">重置</el-button>
      </span>

    </el-row>
    <el-row>
      <div class="tableTitle">
        <span class="title_t">车辆列表</span>
        <span class="title_b">
          <el-button type=""
                     @click="showContrast">展开已选对比</el-button>
        </span>
      </div>
      <componentsTable :tableData="tableData"
                       :tableSelection="showSelection"
                       :operation='operation'
                       :tableIndex="tableIndex"
                       :tableHead="tableHead"
                       :maxHeight="maxHeight"
                       :pageTotal="pageTotal"
                       :operationArr="operationArr"
                       @changnum='changeNumber'
                       @changpage="changePage"
                       @choseselection="selctionChose"
                       @buttonclick="clickButton"></componentsTable>
    </el-row>
    <el-drawer title="我是标题"
               :visible.sync="drawer"
               :with-header="false"
               size="50%"
               :before-close="closeDrawer">
      <div class="drawerTop">
        <span class="leftTop">
          已选对比
        </span>
        <span class="rightTop"
              @click="closeDrawer">
          收起<i class="el-icon-arrow-right"></i>
        </span>
      </div>
      <div>
        <componentsTable :tableSelection="true"
                         :tableData="contrasData"
                         :operation='false'
                         :tableIndex="true"
                         :tableHead="contrastHead"
                         :maxHeight="400"
                         :pageTotal="contrasTotal"
                         @choseselection="contrasSelction"
                         @changnum='constrasNumber'
                         @changpage="constrasSize"></componentsTable>
      </div>
      <div class="footerShow">
        <el-button type="danger"
                   @click="deleteContrasData">删除</el-button>
        <el-button type="primary"
                   @click="openDetail">开始对比</el-button>
      </div>
    </el-drawer>
    <el-dialog title="对比详情"
               :visible.sync="detailShow"
               width="80%">
      <componentsTable :tableSelection="false"
                       :operation='false'
                       :tableIndex="false"
                       :tableData="detailsData"
                       :tableHead="detailsHead"
                       :pagination="false"></componentsTable>
    </el-dialog>
  </div>
</template>
<script>
import componentsTable from '@/components/table/componentsTable'
import httprequest from '@/assets/api/request'

export default {
  components: { componentsTable },
  name: 'contrast',
  data () {
    return {
      tableData: [],
      showSelection: true,
      operation: true,
      tableIndex: true,
      pageTotal: 0,
      maxHeight: 300,
      pageNum: 1,
      pageSize: 10,
      tableHead: [
        { label: '车辆品牌', prop: 'vehicleBrand' },
        { label: '车辆名称', prop: 'vehicleName' },
        { label: '车辆类型', prop: 'vehicleType' },
        { label: '燃料类型', prop: 'fuelType' },
        { label: '车型级别', prop: 'vehicleLevel' },
        { label: '总成名称', prop: 'assemblyName' },
        { label: '零部件名称', prop: 'sparePartsName' },
        { label: '零部件供应商', width: '120px', prop: 'sparePartsSupplier' },
        { label: '零部件重量', prop: 'sparePartsWeight' },
        { label: '零部件用材', prop: 'sparePartsMaterial' },
      ],
      contrasData: [],
      contrastHead: [
        { label: '车辆品牌', prop: 'vehicleBrand' },
        { label: '车辆名称', prop: 'vehicleName' },
        { label: '零部件供应商', width: '120px', prop: 'sparePartsSupplier' },
        { label: '零部件重量', prop: 'sparePartsWeight' },
        { label: '零部件用材', prop: 'sparePartsMaterial' },
      ],
      operationArr: [
        { icon: "el-icon-edit-outline", title: '加入对比', name: '加入对比' },
      ],
      contrasSize: 10,
      contrasNum: 1,
      contrasTotal: 0,
      searchForm: {
        clpp: '',
        lbjmc: ''
      },
      drawer: false,
      detailShow: false,
      detailsHead: [
        { label: '零部件【车型名称】', width: '160px', prop: 'optionTitle' },
      ],
      detailsData: [
        {
          optionTitle: '零部件供应商'
        },
        {
          optionTitle: '零部件重量'
        },
        {
          optionTitle: '零部件用材'
        },
      ],
      contrasChoseData: [],
      isQuery: false, //是否为检索
      ids: []
    }
  },
  mounted () {
    this.paging()
  },
  methods: {
    // 切换条数
    changeNumber (val) {
      let _this = this
      _this.pageSize = val
      // if (_this.isQuery) {
      //   _this.queryList()
      // } else {
      _this.paging()
      // }
    },
    // 切换页数
    changePage (val) {
      let _this = this
      _this.pageNum = val
      // if (_this.isQuery) {
      //   _this.queryList()
      // } else {
      _this.paging()
      // }
    },
    // constrasNum
    constrasNumber (val) {
      let _this = this
      _this.contrasSize = val
      _this.showContrast()
    },
    constrasSize (val) {
      let _this = this
      _this.contrasNum = val
      _this.showContrast()
    },
    // 重置按钮
    reset () {
      this.searchForm.clpp = ''
      this.searchForm.lbjmc = ''
    },
    // 检索按钮
    queryList () {
      let _this = this
      _this.pageNum = 1
      _this.pageSize = 10
      _this.paging()
      // let option = {
      //   "current": _this.pageNum,
      //   "entity": {
      //     "vehicleBrand": _this.searchForm.clpp === '' ? null : _this.searchForm.clpp,
      //     "sparePartsName": _this.searchForm.lbjmc === '' ? null : _this.searchForm.lbjmc
      //   },
      //   "size": _this.pageSize
      // }
      // httprequest.post('/material/vehicleMaterial/list', option, res => {
      //   if (res.data.ok) {
      //     console.log(res)
      //     _this.tableData = res.data.data
      //     _this.isQuery = true
      //   } else {
      //     _this.$message.error(res.data.message)
      //   }
      // })
    },
    // 分页查询
    paging () {
      let _this = this
      let options = {
        "entity": {
          "vehicleBrand": _this.searchForm.clpp === '' ? null : _this.searchForm.clpp,
          "sparePartsName": _this.searchForm.lbjmc === '' ? null : _this.searchForm.lbjmc
        },
        current: _this.pageNum,
        size: _this.pageSize
      }
      httprequest.post('/material/vehicleMaterial/page', options, res => {
        if (res.data.ok) {
          _this.isQuery = false
          _this.tableData = res.data.data.records
          _this.pageTotal = res.data.data.total
        } else {
          _this.$message.error(res.data.message)
        }
      })
    },
    // 选择
    selctionChose (val) {
      console.log('测试选择', val)
    },
    // 对比按钮
    clickButton (name, title, index, row) {
      console.log('测试这个按钮', name, title, index, row)
      let _this = this
      // let option = {
      //   id: row.id
      // }
      httprequest.post(`material/vehicleMaterial/addCompare/${row.id}`, {}, res => {
        console.log('加入比对', res)
        if (res.data.ok) {
          _this.$message.success('对比加入成功')
        } else {
          _this.$message.error(res.data.message)
        }
      })
      // _this.ids.push(row.id)
      // _this.contrasData.push(row)
    },
    // 打开中间对比详情
    async openDetail () {
      let _this = this
      // let options = ids
      await httprequest.post('material/vehicleMaterialCompar/compare', _this.ids, res => {
        console.log('ceshi', res)
        if (res.data.ok) {
          _this.contrasChoseData = res.data.data
          _this.closeDrawer()
          _this.addCenterHead()
          _this.centerData()
          _this.detailShow = true
          // _this.contrasData = 
          // _this.contrasTotal = res.data.data.total
        }
      })

    },
    deleteContrasData () {
      let _this = this
      // let ids = _this.contrasChoseData.map(res => {
      //   return res.id
      // })
      httprequest.delete('/material/vehicleMaterialCompar', _this.ids, respons => {
        if (respons.data.ok) {
          _this.$message.success('删除成功')
          _this.showContrast()
        } else {
          _this.$message.error(respons.data.message)
        }
      })
    },
    // 打开遮罩
    showContrast () {
      let _this = this
      _this.drawer = true
      let options = {
        current: _this.contrasNum,
        size: _this.contrasSize,
      }
      // material/vehicleMaterialCompar/page  material/vehicleMaterialCompar/compare
      httprequest.post('material/vehicleMaterialCompar/page', options, res => {
        console.log('ceshi', res)
        if (res.data.ok) {
          _this.contrasData = res.data.data.records
          _this.contrasTotal = res.data.data.total
        }
      })
      //_this.contrasData
    },
    // 关闭drawer
    closeDrawer () {
      this.drawer = false
    },
    // 对比弹窗选择
    contrasSelction (val) {
      let _this = this
      console.log('对比弹窗选择', val)
      _this.ids = val.map(res => {
        return res.id
      })


    },
    // 添加中心标题
    addCenterHead () {
      let _this = this
      let cc = _this.contrasChoseData.map((res, index) => {
        return {
          label: `零部件【${res.vehicleName}】`,
          width: '160px',
          prop: `che${index}`
        }
      })
      _this.detailsHead = [..._this.detailsHead, ...cc]
      // _this.detailsHead = new Set(_this.detailsHead)
      let hash = {};
      _this.detailsHead = _this.detailsHead.reduce((item, next) => {
        hash[next.label] ? '' : hash[next.label] = true && item.push(next);
        return item
      }, [])

    },
    // 中心数据处理
    centerData () {
      let _this = this
      _this.detailsData.forEach(item => {
        _this.contrasChoseData.forEach((res, index) => {
          if (item.optionTitle === '零部件供应商') {
            item[`che${index}`] = res.sparePartsSupplier
          } else if (item.optionTitle === '零部件重量') {
            item[`che${index}`] = res.sparePartsWeight
          } else if (item.optionTitle === '零部件用材') {
            item[`che${index}`] = res.sparePartsMaterial
          }
        })
      })

    }

  }
}
</script>
<style lang="scss" scoped>
#contrast /deep/ .el-drawer__container {
  bottom: 0;
}
#contrast {
  .contrastTop {
    width: 96%;
    height: 80px;
    margin: 20px auto;
    background-color: #ffffff;
    .contrastForm {
      display: block;
      float: left;
      margin-left: 24px;
      margin-top: 20px;
    }
    .contrastButton {
      display: block;
      float: right;
      margin-right: 24px;
      margin-top: 20px;
    }
  }
  .tableTitle {
    width: 96%;
    height: 50px;
    background: #ffffff;
    margin: 0px auto 4px;
    .title_t {
      display: block;
      float: left;
      line-height: 40px;
      margin-left: 8px;
    }
    .title_b {
      display: block;
      float: right;
      margin-right: 6px;
    }
  }
  .drawerTop {
    width: 100%;
    height: 40px;
    line-height: 40px;
    .leftTop {
      display: block;
      float: left;
      margin-left: 20px;
    }
    .rightTop {
      display: block;
      float: right;
      cursor: pointer;
      margin-right: 20px;
    }
  }
  .footerShow {
    width: 100%;
    position: absolute;
    bottom: 10px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: nowrap;
  }
}
</style>