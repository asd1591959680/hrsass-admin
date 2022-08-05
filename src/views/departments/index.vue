<!--  -->
<template>
  <div>
    <div v-loading="loading" class="dashboard-container"></div>
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <tree-tools :tree-node="company"></tree-tools>
    </el-card>
    <el-tree :data="departs" :props="defaultTxt" :default-expand-all="true">
      <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
      <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
      <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
      <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
      <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
      <tree-tools
        slot-scope="{ data }"
        :tree-node="data"
        :is-root="true"
        @delDept="_getDepartments"
        @addDept="addDepts"
        @editDept="editDepts"
      />
    </el-tree>
    <add-dept
      :show-dialog="showDiglog"
      :tree-node="node"
      @addDepte="_getDepartments"
      :showDialog.sync="showDiglog"
      ref="addDepts"
    ></add-dept>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: { TreeTools, AddDept },
  data() {
    return {
      company: {},
      defaultTxt: {
        lable: 'name',
      },
      departs: [],
      showDiglog: false,
      node: {},
      loading: false,
    }
  },
  computed: {},
  methods: {
    async _getDepartments() {
      this.loading = false
      let res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = true
    },
    addDepts(node) {
      this.showDiglog = true
      this.node = node
    },
    editDepts(node) {
      this.showDiglog = true
      this.node = node
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDepts._getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    },
  },
  created() {
    this._getDepartments()
  },
}
</script>
<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
.depart-box {
  height: 40px;
  width: 100%;
}
</style>
