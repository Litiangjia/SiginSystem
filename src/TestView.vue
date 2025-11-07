<template>
  <div class=" $ TM_FILENAME_BASE $ ">
    <!-- 编写你的html 代码 -->
  </div>
</template>

<script setup  lang="ts">
// import { ref } from "vue"
import { http } from "./ajax/send";

http.get('/admin/courseTableData/get').then(res => {
   console.log(res);
});



</script>

<style scoped>
/* Add your styles here */
</style>
