<!--  -->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="list" row-key="id" border>
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" v-if="row.type === 1" @click="addPermission(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text" @click="_editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="_delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnClose">
      <el-form ref="Perform" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" active-color="0" inactive-color="1"> </el-switch>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确 定</el-button>
          <el-button size="small" @click="btnClose">取 消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail,
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  components: {},
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0', // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
      },
      showDialog: false,
    }
  },
  created() {
    this._getPermissionList()
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    },
  },
  methods: {
    async _getPermissionList() {
      let res = await getPermissionList()
      this.list = tranListToTreeData(res, '0')
    },
    async _delPermission(id) {
      try {
        await this.$confirm('确定删除该数据吗？')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOK() {
      this.$refs.Perform.validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }
          return addPermission(this.formData)
        })
        .then(() => {
          this.$message.success('新增成功')
          this.getPermissionList()
          this.showDialog = false
        })
    },
    btnClose() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0', // 开启
      }
      this.$refs.Perform.resetFields()
      this.showDialog = false
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async _editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
  },
}
</script>
<style lang="scss" scoped></style>
