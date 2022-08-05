<!--  -->
<template>
  <div>
    <page-tools :show-before="true">
      <span slot="before">共16条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="goImport">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>

        <el-button icon="plus" size="small" type="primary" @click="showFlag = true"
          >新增员工</el-button
        >
      </template>
    </page-tools>
    <el-card class="box-card">
      <el-table :data="list" border style="width: 100%">
        <el-table-column type="index" sortable label="序号"> </el-table-column>
        <el-table-column prop="username" sortable label="姓名"> </el-table-column>
        <el-table-column prop="workNumber" sortable label="工号"> </el-table-column>
        <el-table-column sortable label="聘用形式" :formatter="formatEmployment"> </el-table-column>
        <el-table-column prop="departmentName" sortable label="部门"> </el-table-column>
        <el-table-column prop="timeOfEntry" sortable label="入职时间">
          <template slot-scope="{ row }">
            <!-- formatDate是全局注册filters的一个方法 -->
            {{ row.timeOfEntry | formatDate }}
          </template></el-table-column
        >
        <el-table-column prop="enableState" sortable label="用户状态">
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column prop="amount3" label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!checkPermission('POINT-USER-UPADTE')"
              @click="goDetail(row.id)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="_delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page="page.page"
          :total="page.total"
          @current-change="changePage"
        >
        </el-pagination
      ></el-row>
    </el-card>
    <add-employee :show-flag.sync="showFlag"></add-employee>
    <assign-role
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    ></assign-role>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import checkPermission from '@/mixin/checkPermission'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
      showFlag: false,
      userId: '',
      showRoleDialog: false,
    }
  },
  created() {
    this._getEmployeeList()
  },
  computed: {},
  mixins: [checkPermission],
  methods: {
    async _getEmployeeList() {
      this.loading = true
      let { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this._getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值

      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async _delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工？')
        await delEmployee(id)
        this._getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    addEmployees() {
      this.showFlag = true
    },
    goImport() {
      this.$router.push({
        path: '/import',
        query: {
          type: 'user',
        },
      })
    },
    goDetail(id) {
      this.$router.push({
        name: 'detail',
        params: {
          id,
        },
      })
    },
    async editRole(id) {
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole._getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    },
  },
}
</script>
<style lang="scss" scoped></style>
