<template>
  <div id="homePagePictures">
    <el-row class="topShow">

      <div class="topLeft">
        <el-button icon="el-icon-plus"
                   class="createMaterial"
                   type="primary"
                   @click="createForm">新建</el-button>
      </div>
      <div class="topRight">
        <el-upload class="upload-demo"
                   action=""
                   :http-request="uploadFile"
                   :show-file-list="false">
          <el-button type="primary">导入</el-button>
        </el-upload>
        <!-- <el-button type="primary">导入</el-button> -->
        <el-button plain
                   type="primary"
                   @click="download">下载模板</el-button>
        <el-button plain
                   type="danger"
                   @click="deleteAll(ids)">批量删除</el-button>
      </div>
    </el-row>
    <el-row>
      <componentsTable :tableSelection="showSelection"
                       :tableData="tableData"
                       :operation='operation'
                       :operationWidth="operationWidth"
                       :tableIndex="tableIndex"
                       :tableHead="tableHead"
                       :border="true"
                       :pageTotal="pageTotal"
                       :maxHeight="maxHeight"
                       :operationArr="operationArr"
                       @choseselection="selctionChose"
                       @buttonclick="clickButton"
                       @changnum='changeNumber'
                       @changpage="changePage"></componentsTable>
    </el-row>
    <formDialog ref="fromDialog"
                :ruleForm="ruleForm"
                @submit="createImport"
                @editform="edit"
                :rulesNow='rules'
                :isCreate="isCreate"></formDialog>
  </div>
</template>
<script>
import httprequest from '@/assets/api/request'
import componentsTable from '@/components/table/componentsTable'
// import formDialog from '@/components/dialog/formDialog'
import formDialog from '@/components/dialog/form'
export default {
  components: { componentsTable, formDialog },
  data () {
    return {
      tableData: [],
      showSelection: true,
      operation: true,
      operationWidth: 130,
      tableIndex: true,
      maxHeight: 400,
      pageTotal: 0,
      pageSize: 10,
      pageNum: 1,
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

      operationArr: [
        { icon: "el-icon-edit-outline", title: '编辑', size: 'small' },
        { icon: "el-icon-delete", title: '删除', size: 'small' }
      ],
      ruleForm: [
        {
          show: true,
          type: '1',
          label: '车辆品牌',
          name: 'vehicleBrand',
          value: '',
          rules: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        },
        {
          show: true,
          type: '1',
          label: '车辆名称',
          name: 'vehicleName',
          value: ''
        },
        {
          show: true,
          type: '2',
          label: '车辆类型',
          name: 'vehicleType',
          value: '',
          data: [
            { label: '轿车', value: '轿车' },
            { label: 'SUV', value: 'SUV' },
            { label: 'MPV', value: 'MPV' }
          ]
        },
        {
          show: true,
          type: '1',
          label: '燃料类型',
          name: 'fuelType',
          value: '',
          data: [
            { label: '燃油', value: '燃油' },
            { label: '纯电', value: '纯电' },
            // { label: 'MPV', value: 'MPV' }
          ]
        },
        {
          show: true,
          type: '2',
          label: '车辆级别',
          name: 'vehicleLevel',
          value: '',
          data: [
            { label: 'AO', value: 'AO' },
            { label: 'A', value: 'A' },
            { label: 'B', value: 'B' },
            { label: 'C', value: 'C' },
            { label: 'D', value: 'D' }
          ]
        },
        {
          show: true,
          type: '1',
          label: '总成名称',
          name: 'assemblyName',
          value: ''
        },
        {
          show: true,
          type: '1',
          label: '零部件名称',
          name: 'sparePartsName',
          value: ''
        },
        {
          show: true,
          type: '1',
          label: '零部件供应商',
          name: 'sparePartsSupplier',
          value: ''
        },
        {
          show: true,
          type: '1',
          label: '零部件重量',
          name: 'sparePartsWeight',
          value: ''
        },
        {
          show: true,
          type: '1',
          label: '零部件用材',
          name: 'sparePartsMaterial',
          value: ''
        }
      ],
      rules: {
        vehicleBrand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }],
        vehicleName: [{ required: true, message: '请输入车辆名称', trigger: 'blur' }],
        vehicleType: [{ required: true, message: '请输入车辆类型', trigger: 'blur' }],
        fuelType: [{ required: true, message: '请输入燃料类型', trigger: 'blur' }],
        vehicleLevel: [{ required: true, message: '请输入车辆级别', trigger: 'blur' }],
        assemblyName: [{ required: true, message: '请输入总成名称', trigger: 'blur' }],
        sparePartsName: [{ required: true, message: '请输入零部件名称', trigger: 'blur' }],
        sparePartsSupplier: [{ required: true, message: '请输入零部件供应商', trigger: 'blur' }],
        sparePartsWeight: [{ required: true, message: '请输入零部件重量', trigger: 'blur' }],
        sparePartsMaterial: [{ required: true, message: '请输入零部件用材', trigger: 'blur' }]
      },
      ids: [],
      isCreate: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.getData()

    }, 1000)
  },
  methods: {
    download () {
      // 192.168.144.210:8007
      location.href = 'http://192.168.144.210:8160/api/material/vehicleMaterial/download'
      // location.href = 'http://10.10.10.12:8007/api/material/vehicleMaterial/download'

      // httprequest.get('/material/vehicleMaterial/download', {}, res => {
      //   console.log('测试下载', res)
      // })
    },
    // 选择
    selctionChose (val) {
      console.log('测试这个val', val)
      let _this = this
      // val.forEach(res => {
      //   if (_this.ids === '') {
      //     _this.ids = res.id
      //   } else {
      //     _this.ids += `,${res.id}`
      //   }
      // })
      _this.ids = val.map(res => {
        return res.id
      })
    },
    // 点击按钮
    clickButton (name, title, index, row) {
      console.log('测试这个name,index，row', name, title, index, row)
      switch (title) {
        case '编辑':
          this.isCreate = false
          this.getinformation(row.id)
          this.showFormDialog()
          break
        case '删除':
          this.deleteAll([row.id])
          break
        default:
          break
      }
    },

    // delete删除
    deleteAll (res) {
      let _this = this
      let option = res
      // {
      //   ids: res
      // }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httprequest.delete('/material/vehicleMaterial', option, res => {
          if (res.data.ok) {
            _this.$message.success('删除成功')
            _this.getData()
          } else {
            _this.$message.error(res.data.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    createForm () {
      this.isCreate = true
      this.showFormDialog()
    },
    // 编辑
    edit (val) {
      let _this = this
      let options = val
      let reg = /^\d+(\.\d+)?$/
      if (!reg.test(options.sparePartsWeight)) {
        _this.$message.error('零部件重量必须为数字')
      } else {
        //  {
        //   vehicleMaterialCompar: 
        // }
        httprequest.put('/material/vehicleMaterial', options, res => {
          if (res.data.ok) {
            _this.$message.success('修改成功')
            _this.$refs.fromDialog.closeDialog()
            _this.getData()

          } else {
            _this.$message.error(res.message)
          }
        })
      }
    },
    // 获取详情
    getinformation (id) {
      let _this = this  // material/vehicleMaterial/{id}
      _this.ruleForm.id = {
        show: false,
        type: '1',
        label: 'id',
        name: 'id',
        value: ''
      }
      _this.$nextTick(() => {

        httprequest.get(`/material/vehicleMaterial/${id}`, {}, res => {
          if (res.data.ok) {
            Object.keys(res.data.data).forEach(item => {
              Object.keys(_this.ruleForm).forEach(response => {
                if (item === response) {
                  _this.ruleForm[response].value = res.data.data[response]
                }
              })

            })

          }
        })
      })
    },
    // 新增
    create (val) {
      let _this = this
      let option = val
      let reg = /^\d+(\.\d+)?$/
      if (!reg.test(option.sparePartsWeight)) {
        _this.$message.error('零部件重量必须为数字')
      } else {
        httprequest.post('/material/vehicleMaterial', option, res => {
          if (res.data.ok) {
            _this.$message.success('添加成功')
            _this.$refs.fromDialog.closeDialog()
            _this.getData()
          } else {
            _this.$message.error(res.data.message)
          }
        })
      }
      // /^\d$/
      //  {
      //   vehicleMaterialCompar:      }

    },
    // 显示新建
    showFormDialog () {
      this.$refs.fromDialog.showDialog()
    },
    // 查询分页
    getData () {
      // /material/vehicleMaterial/page
      let _this = this
      let options = {
        "current": _this.pageNum,
        "size": _this.pageSize
      }
      httprequest.post('/material/vehicleMaterial/page', options, res => {
        console.log('测试res', res)
        if (res.data.ok) {
          console.log('测试数据', res.data.data.records)
          if (res.data.data.records.length === 0) {
            if (_this.pageNum > 1) {
              _this.pageNum - 1
              _this.getData()
            } else if (_this.pageNum === 1) {
              _this.pageNum = 1
            } else {
              _this.pageNum = 1
              _this.getData()
            }

          }
          _this.tableData = res.data.data.records
          _this.pageTotal = res.data.data.total
        }
      })
    },
    // 切换条数
    changeNumber (val) {
      let _this = this
      _this.pageSize = val
      _this.getData()
    },
    // 切换页码
    changePage (val) {
      let _this = this
      _this.pageNum = val
      _this.getData()
    },
    createImport (val) {
      let _this = this
      console.log('测试保存按钮', val)
      _this.create(val)
    },
    // 上传文件
    uploadFile (parment) {
      let file = new FormData()
      file.append('file', parment.file)
      httprequest.postFile('/material/vehicleMaterial/importExcel', file, res => {
        if (res.data.ok) {
          this.$message.success("上传成功")
          this.pageSize = 10
          this.pageNum = 1
          this.getData()
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#homePagePictures {
  width: 96%;
  height: 96%;
  background: #ffffff;
  margin: 0.5% auto;
  .topShow {
    height: 80px;
    .topLeft {
      float: left;
      margin-left: 24px;
      margin-top: 20px;
    }
    .topRight {
      float: right;
      margin-right: 24px;
      margin-top: 20px;
      .upload-demo {
        float: left;
        margin-right: 10px;
      }
    }
  }
}
</style>