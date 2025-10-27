<!-- 编写404页面 -->
<!-- ErrorView.vue -->
<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <div class="number four">4</div>
        <div class="number zero">
          <div class="eye">
            <div class="pupil"></div>
          </div>
        </div>
        <div class="number four">4</div>
      </div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="error-actions">
        <button @click="goHome" class="btn-home">返回首页</button>
        <button @click="goBack" class="btn-back">返回上页</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ErrorView',
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
}

.error-container {
  text-align: center;
  color: white;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.error-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.number {
  font-size: 8rem;
  font-weight: bold;
  margin: 0 1rem;
  animation: float 3s ease-in-out infinite;
}

.four:first-child {
  animation-delay: 0s;
}

.zero {
  position: relative;
  animation-delay: 0.5s;
}

.four:last-child {
  animation-delay: 1s;
}

.zero .eye {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
}

.zero .pupil {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15px;
  height: 15px;
  background: #667eea;
  border-radius: 50%;
  animation: look-around 5s infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes look-around {
  0%, 100% {
    transform: translate(-50%, -50%);
  }
  25% {
    transform: translate(calc(-50% + 5px), calc(-50% - 5px));
  }
  50% {
    transform: translate(calc(-50% - 5px), calc(-50% + 5px));
  }
  75% {
    transform: translate(calc(-50% + 5px), calc(-50% + 5px));
  }
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-home, .btn-back {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.btn-home {
  background: white;
  color: #667eea;
}

.btn-back {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-home:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .number {
    font-size: 5rem;
    margin: 0 0.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  .error-container {
    padding: 1.5rem;
  }
}
</style>
