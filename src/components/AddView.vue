<!-- src/components/EditView.vue -->
<template>
  <div class="add-view-overlay" v-if="visible" @click="closeOverlay">
    <div class="add-view-container" @click.stop :class="{ 'show': visible }">
      <div class="add-view-header">
        <h2>编辑学生信息</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="add-view-content">
        <form @submit.prevent="addStudent">
          <div class="form-group">
            <label for="studentName">姓名</label>
            <input
              id="studentName"
              v-model="student.name"
              type="text"
              required
            />
          </div>

           <div class="form-group">
            <label for="studentPassword">密码</label>
            <input
              id="studentPassword"
              v-model="student.studentPassword"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="studentId">学号</label>
            <input
              id="studentId"
              v-model="student.studentNumber"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="gender">性别</label>
            <select id="gender" v-model="student.gender">
              <option value="1">男</option>
              <option value="2">女</option>
              <option value="0">未知</option>
            </select>
          </div>

          <div class="form-group">
            <label for="age">年龄</label>
            <input
              id="age"
              v-model.number="student.age"
              type="number"
              min="10"
              max="100"
            />
          </div>

          <div class="form-group">
            <label for="major">专业</label>
            <input
              id="major"
              v-model="student.major"
              type="text"
            />
          </div>

           <div class="form-group">
            <label for="gender">激活状态</label>
            <select id="gender" v-model="student.active">
              <option value="0">未激活(禁用)</option>
              <option value="1">激活(启用)</option>
            </select>
          </div>

          <!-- <div class="form-group">
            <label for="class">班级</label>
            <input
              id="class"
              v-model="student.class"
              type="text"
            />
          </div> -->

          <div class="form-group">
            <label for="phone">联系电话</label>
            <input
              id="phone"
              v-model="student.phoneNumber"
              type="tel"
            />
          </div>

          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="student.email"
              type="email"
            />
          </div>

          <div class="form-group">
            <label for="enrollmentDate">入学时间</label>
            <input
              id="enrollmentDate"
              v-model="student.enrollmentDate"
              type="date"
            />
          </div>
        </form>
      </div>

      <div class="add-view-footer">
        <button class="action-btn secondary" @click="close">取消</button>
        <button class="action-btn primary" @click="addStudent">添加</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const student = ref({
  name: '',
  studentNumber: '',
  gender: '',
  age: 0,
  major: '',
  active: 1,
  enrollmentDate: '',
  phoneNumber: '',
  email: '',
  studentPassword:'123456' //默认密码
})

// 定义组件属性
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

// 定义事件发射器
const emit = defineEmits(['update:addVisible', 'close','add'])


// 关闭弹窗
const close = () => {
  emit('update:addVisible', false)
  emit('close')
}

// 点击遮罩层关闭
const closeOverlay = () => {
  close()
}

// 添加学生信息
const addStudent = () => {
  emit('add', student.value) // 发射事件 传递数据
  close()
}
</script>

<style scoped>
.add-view-overlay {
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

.add-view-container {
  background: white;
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

.add-view-container.show {
  transform: scale(1);
  opacity: 1;
}

.add-view-header {
  padding: 20px;
  background: #409eff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-view-header h2 {
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

.add-view-content {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.add-view-footer {
  padding: 20px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.primary {
  background: #409eff;
  color: white;
}

.secondary {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #dcdfe6;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
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
  .add-view-container {
    width: 95%;
    max-height: 95vh;
  }

  .add-view-content {
    padding: 20px;
  }
}
</style>
