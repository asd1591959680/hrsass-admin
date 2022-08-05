<!--  -->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->

                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button size="small" type="primary" @click="_getRoleDetail(row.id)"
                    >编辑</el-button
                  >
                  <el-button size="small" type="danger" @click="_deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="分配权限" :visible="showPerDialog" @close="btnPerClose">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      ></el-tree>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="btnPerOK" size="small">确 定</el-button>
          <el-button @click="btnPerClose" size="small">取 消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
} from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
  components: {},
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0, //记录总数
      },
      formData: {},
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
      },

      showPerDialog: false,
      defaultProps: {
        label: 'name',
      },
      permData: [],
      selectCheck: [],
      roleId: null,
    }
  },
  created() {
    this._getRoleList()
    this._getCompanyInfo()
  },
  computed: {
    ...mapGetters['companyId'],
  },
  methods: {
    async _getRoleList() {
      let { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      //newPage当前点击页码
      this.page.page = newPage
      this._getRoleList()
    },
    async _getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async _deleteRole(id) {
      //提示
      try {
        await this.$confirm('确认删除该角色吗')
        //只有确定才会进入下面
        await deleteRole(id)
        this._getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async _getRoleDetail(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          //新增业务
          await addRole(this.roleForm)
        }
        this._getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: '',
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async assignPerm(id) {
      let res = await getPermissionList()
      this.permData = tranListToTreeData(res, '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)

      this.selectCheck = permIds
      this.showPerDialog = true
    },
    async btnPerOK() {
      let permIds = this.$refs.permTree.getCheckedKeys()
      let id = this.roleId
      await assignPerm(permIds, id)
      this.$message.success('分配权限成功')
      this.showPerDialog = false
    },
    btnPerClose() {
      this.selectCheck = []
      this.showPerDialog = false
    },
  },
}
</script>
<style lang="scss" scoped></style>
