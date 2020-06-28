<template>
  <div id="componentsTable">
    <el-table :data="tableData"
              :height="tableHeight"
              :max-height="maxHeight"
              :stripe="stripe"
              :border="border"
              @selection-change="choseSelection"
              class="table">
      <el-table-column v-if="tableSelection"
                       type="selection"
                       align="center"
                       width="30"></el-table-column>
      <el-table-column v-if="tableIndex"
                       label="序号"
                       type="index"
                       width="50">
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHead"
                       :key="index"
                       show-overflow-tooltip
                       :width="item.width"
                       :label="item.label"
                       :prop="item.prop"
                       align="center">

        <!-- <template slot-scope="scope"> -->
        <!-- <span style="display:inline-block" -->
        <!-- v-if="item.children"> -->
        <el-table-column v-show="item.children"
                         show-overflow-tooltip
                         v-for="(res,cindex) in item.children"
                         :label="res.label"
                         :prop="res.prop"
                         :key="cindex"
                         align="center"></el-table-column>
        <!-- </span> -->
        <!-- <span v-else>{{scope.row[item.prop]}}</span> -->

      </el-table-column>
      <el-table-column v-if="operation"
                       :width="operationWidth"
                       label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button v-for="(res,indexB) in operationArr"
                     :key="indexB"
                     :size="res.size"
                     :icon="res.icon"
                     :title="res.title"
                     @click.native.prevent="handleClick(res.name,res.title,scope.$index, scope.row)">{{res.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="pagination"
                   @size-change="handleSizeChange"
                   background
                   @current-change="handleCurrentChange"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="10"
                   layout="sizes, prev, pager, next"
                   :total="pageTotal">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'componentsTable',
  props: {
    tableData: { //数据
      type: Array,
      default: () => []
    },
    tableSelection: { //是都显示操作按钮
      type: Boolean,
      default: () => false
    },
    operation: { // 显示操作
      type: Boolean,
      default: () => false
    },
    operationWidth: {
      type: Number,
      default: () => 80
    },
    operationArr: {
      type: Array,
      default: () => []
    },
    tableHead: {
      type: Array,
      default: () => []
    },
    tableHeight: {
      type: Number,
      default: () => null
    },
    maxHeight: {
      type: Number,
      default: () => null
    },
    stripe: {
      type: Boolean,
      default: () => true
    },
    border: {
      type: Boolean,
      default: () => true
    },
    pageTotal: {
      type: Number,
      default: () => 0
    },
    pagination: {
      type: Boolean,
      default: () => true
    },
    tableIndex: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {}
  },
  methods: {
    choseSelection (val) {
      this.$emit('choseselection', val)
    },
    handleClick (name, title, index, row) {
      this.$emit('buttonclick', name, title, index, row)
    },
    handleSizeChange (val) {
      this.$emit('changnum', val)
    },
    handleCurrentChange (val) {
      this.$emit('changpage', val)
    }
  }
}
</script>
<style lang="scss" scoped>
#componentsTable {
  width: 96%;
  margin: auto;
}
</style>