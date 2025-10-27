<template>
  <div class="look-view-overlay" v-if="visible" @click="closeOverlay">
    <div class="look-view-container" @click.stop :class="{ 'show': visible }">
      <div class="look-view-header">
        <h2>学生信息详情</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="look-view-content">
        <div class="student-avatar">
          <!-- <img :src="student.avatar || defaultAvatar" :alt="student.name" /> -->
        </div>

        <div class="student-info">
          <div class="info-row">
            <span class="label">姓名:</span>
            <span class="value">{{ student.name }}</span>
          </div>

          <div class="info-row">
            <span class="label">学号:</span>
            <span class="value">{{ student.studentNumber }}</span>
          </div>

          <div class="info-row">
            <span class="label">性别:</span>
            <span class="value">{{ student.gender===0?"未知":student.gender===1?"男":"女" }}</span>
          </div>

          <div class="info-row">
            <span class="label">年龄:</span>
            <span class="value">{{ student.age }}</span>
          </div>

          <div class="info-row">
            <span class="label">专业:</span>
            <span class="value">{{ student.major===null?"未知":student.major }}</span>
          </div>

          <div class="info-row">
            <span class="label">班级:</span>
            <span class="value">{{ student.classId }}</span>
          </div>

          <div class="info-row">
            <span class="label">联系电话:</span>
            <span class="value">{{ student.phoneNumber }}</span>
          </div>

          <div class="info-row">
            <span class="label">邮箱:</span>
            <span class="value">{{ student.email===null?"未知":student.email }}</span>
          </div>

          <div class="info-row">
            <span class="label">入学时间:</span>
            <span class="value">{{ student.enrollmentDate===null?"未填":student.enrollmentDate }}</span>
          </div>
        </div>
      </div>

      <div class="look-view-footer">
        <button class="action-btn primary" @click="printInfo">打印信息</button>
        <button class="action-btn secondary" @click="exportInfo">导出信息</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// 定义组件属性
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件发射器
const emit = defineEmits(['update:visible', 'close'])

// 默认头像
// const defaultAvatar = ref('https://via.placeholder.com/150')

// 关闭弹窗
const close = () => {
  emit('update:visible', false)
  emit('close')
}

// 点击遮罩层关闭
const closeOverlay = () => {
  close()
}

// 打印信息
const printInfo = () => {
  window.print()
}

// 导出信息
const exportInfo = () => {
  alert('导出功能待实现')
}
</script>

<style scoped>
.look-view-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1003;
  animation: fadeIn 0.3s ease-out;
}

.look-view-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.3s ease-out;
}

.look-view-container.show {
  transform: scale(1);
  opacity: 1;
}

.look-view-header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.look-view-header h2 {
  margin: 0;
  color: white;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.look-view-content {
  padding: 30px;
  background: white;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.student-avatar {
  margin-bottom: 20px;
}

.student-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.student-info {
  width: 100%;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s;
}

.info-row:hover {
  background: #f8f9fa;
}

.label {
  font-weight: bold;
  width: 100px;
  color: #555;
}

.value {
  flex: 1;
  color: #333;
}

.look-view-footer {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.primary {
  background: #409eff;
  color: white;
}

.secondary {
  background: #67c23a;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .look-view-container {
    width: 95%;
    max-height: 95vh;
  }

  .look-view-content {
    padding: 20px;
  }

  .info-row {
    flex-direction: column;
  }

  .label {
    width: auto;
    margin-bottom: 5px;
  }
}
</style>
