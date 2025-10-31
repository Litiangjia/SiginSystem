<template>
  <div class=" $ TM_FILENAME_BASE $ ">
    <!-- 编写你的html 代码 -->
  </div>
</template>

<script setup  lang="ts">


//测试请求接口
import { http } from '@/ajax/send'

http.get('/admin/courseTableData/get').then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})


 //编写代码
</script>

<style scoped>
/* Add your styles here */
</style>
