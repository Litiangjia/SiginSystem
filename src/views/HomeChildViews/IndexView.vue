<template>
  <div class="center-box col-24">
      <div class="anim-box col-23">
        <h3 class="anim-box__title">欢迎使用</h3>
        <p class="anim-box__content">这是一个具有动画效果的展示箱体，标题和内容会自动播放入场动画。</p>
      </div>
      <div class="animation-boxs col-24">
        <div class="animation-boxs-item animation-boxs-item--1 col-12" :class="{ 'active':isActive }">
          <div class="animation-container"></div>
        </div>
        <div class="animation-boxs-item animation-boxs-item--2 col-12" :class="{ 'active':isActive }">
          <div class="animation-container"></div>
        </div>
        <div class="animation-boxs-item animation-boxs-item--3 col-12" :class="{ 'active':isActive }">
          <div class="animation-container"></div>
        </div>
        <div class="animation-boxs-item animation-boxs-item--4 col-12" :class="{ 'active':isActive }">
          <div class="animation-container"></div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
  import { ref,onMounted } from 'vue';
  const isActive = ref(false);

  onMounted(()=>{
    // isActive.value = true;
    setTimeout(()=>{
      isActive.value = true;
    },500);
  })
</script>



<style scoped lang="less">
  @import '@/assets/commonLess/componentsLess/box.less';
  @import '@/assets/commonLess/componentsLess/boxAnim.less';
</style>
