<!--  -->
<template>
  <div class="detail-container">
    <div class="detail-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form ref="detailFrom" :model="userInfo" label-width="80px" :rules="rules">
            <el-form-item label="姓名" prop="username">
              <el-input style="width: 300px" v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input style="width: 300px" v-model="userInfo.password2"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUser">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <component :is="componentTag" />
        </el-tab-pane>
        <el-tab-pane label="岗位职责" name="third"><component :is="componentTag1" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from '../components/user-info.vue'
import JobInfo from '../components/job-info.vue'

export default {
  components: { userInfo, JobInfo },
  data() {
    return {
      activeName: 'first',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: '',
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' },
        ],
      },
      componentTag: 'userInfo',
      componentTag1: 'JobInfo',
    }
  },
  created() {
    this._getUserDetailById()
  },
  computed: {},
  methods: {
    handleClick() {
      console.log('handleClick')
    },

    async _getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser() {
      try {
        //校验
        await this.$refs.detailFrom.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.detail-container {
  .detail-tabs {
    background: #fff;
    height: 80%;
    position: relative;
    top: 3%;
    left: 0%;
    margin: 0 1%;
    box-shadow: 0px 0px 5px 2px #b9b9b9;
  }
}

.detail-input {
}
</style>
