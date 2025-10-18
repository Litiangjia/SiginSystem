<template>
  <div id="signView">
     <div class="animation-boxs col-24">
        <router-link to="/signViewsImg">
          <div class="animation-boxs-item animation-boxs-item--1 col-12" :class="{ 'active':isActive }">
            <div class="animation-container">图形签到:适合性能低端设备，快速签到，简单易用</div>
          </div>
        </router-link>
        <div class="animation-boxs-item animation-boxs-item--2 col-12" :class="{ 'active':isActive }">
          <div class="animation-container">选择签到方式:支持更加低端的设备。更快更准确的签到体验。</div>
        </div>
        <router-link to="/signViews">
          <div class="animation-boxs-item animation-boxs-item--3 col-12" :class="{ 'active':isActive }">
            <div class="animation-container">场景签到：适合高性能设备，体验更加流畅，更加直观。</div>
          </div>
        </router-link>
        <div class="animation-boxs-item animation-boxs-item--4 col-12" :class="{ 'active':isActive }">
          <div class="animation-container">扫脸签到：更加安全，更加便捷。</div>
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

<style lang="less" scoped>
  @import '@/assets/commonLess/componentsLess/box.less';
  @import '@/assets/commonLess/componentsLess/boxAnim.less';
</style>

