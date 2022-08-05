<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" ref="deptForm" :model="formData" :rules="rules">
      <el-form-item label="部门名称">
        <el-input v-model="formData.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input v-model="formData.code" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="_getEmployeeSimple"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, upadteDeparts } from '@/api/departments'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    //   用来控制窗体是否显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null,
    },
  },
  components: {},
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts
          .filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid)
          .some(item => item.name === value)
      } else {
        isRepeat = depts
          .filter(item => item.pid === this.treeNode.id)
          .some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(i => i.id !== this.formData.id && i.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat, // 自定义函数的形式校验
          },
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat,
          },
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' },
        ],
      },
      peoples: [],
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    },
  },
  methods: {
    // 获取员工简单列表数据
    async _getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    //确定按钮
    btnOK() {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          //判断是编辑还是新增
          if (this.formData.id) {
            await upadteDeparts(this.formData)
          } else {
            // 表示可以提交了
            // 调用新增接口 添加父部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepte') //让父组件调接口更新数据
          this.$emit('update:showDialog', false) //关闭弹窗
        }
      })
    },
    //取消按钮
    btnCancel() {
      //重置非表单数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
      }
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    async _getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
  },
  created() {},
}
</script>
<style lang="scss" scoped></style>
