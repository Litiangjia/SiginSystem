<template>
  <div class="sign-views-one">
    <button @click="getCurrentPosition">获取当前位置</button>
    <div v-if="coordinates">
      <p>纬度: {{ coordinates.latitude }}</p>
      <p>经度: {{ coordinates.longitude }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';

const coordinates = ref<{latitude: number, longitude: number} | null>(null);

const getCurrentPosition = async () => {
  try {
    const position = await Geolocation.getCurrentPosition();
    coordinates.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (error) {
    console.error('获取位置失败:', error);
  }
};
</script>
