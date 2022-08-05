<!-- 弹窗组件 -->
<template>
  <div>
    <el-dialog :visible="showFlag" title="新增员工" :show-close="false">
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="formData.username"
            style="width: 50%"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            style="width: 50%"
            placeholder="请输入手机"
            type="tel"
          ></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            style="width: 50%"
            placeholder="请选择日期"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择">
            <el-option
              v-for="item in EmployeeEnum.hireType"
              :key="item.id"
              :lable="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="formData.workNumber"
            style="width: 50%"
            placeholder="请输入工号"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input
            v-model="formData.departmentName"
            style="width: 50%"
            placeholder="请输入部门"
            @focus="_getDepartments"
          ></el-input>
          <el-tree
            v-if="showTree"
            v-loading="loading"
            default-expand-all
            :data="treeData"
            :props="{ label: 'name' }"
            @node-click="selectNode"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker style="width: 50%" placeholder="请选择日期" prefix-icon="el-icon-date" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOK">确 定</el-button>
            <el-button size="small" @click="btnCancel">取 消</el-button></el-col
          >
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EmployeeEnum, // 在data中定义数据
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: '',
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位',
          },
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur',
          },
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
      },
    }
  },
  created() {},
  computed: {},
  methods: {
    async _getDepartments() {
      this.showTree = true
      this.loading = true
      let { depts } = await getDepartments()
      //depts是数组，但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOK() {
      try {
        await this.$refs.form.validate()
        await addEmployee(this.formData)
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        // this.$emit
        this.$parent._getDepartments()
        this.$parent.showFlag = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: '',
      }
      this.$refs.form.resetFields()
      this.$emit('update:showFlag', false)
    },
  },
}
</script>
<style lang="scss" scoped></style>
