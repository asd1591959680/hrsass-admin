<!--  -->
<template>
  <div>
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
import { importEmployee } from '@/api/employees'
export default {
  components: { UploadExcel },
  data() {
    return {
      type: this.$route.query.type,
    }
  },
  created() {},
  computed: {},
  methods: {
    async success({ header, results }) {
      if (this.type === 'user') {
        let userRelations = {
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber',
        }
        let arr = []
        results.forEach(item => {
          // 需要将每一个条数据里面的中文都换成英文

          const userInfo = {}
          //返回由对象属性组成的字符串数组
          Object.keys(item).forEach(key => {
            // key是当前的中文名 找到对应的英文名
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
              return
            }
            userInfo[userRelations[key]] = item[key]
          })
          // 最终userInfo变成了全是英文
          arr.push(userInfo)
        })
        await importEmployee(arr) //调用导入接口
        this.$message.success('导入成功')
        this.$router.back()
      }
    },
    //当excel中有日期格式的时候，实际转化的值为一个数字，我们需要一个方法进行转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
  },
}
</script>
<style lang="scss" scoped></style>
