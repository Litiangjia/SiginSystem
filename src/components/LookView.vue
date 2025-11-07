<template>
  <div class="look-view-overlay" v-if="visible" @click="closeOverlay">
    <div class="look-view-container" @click.stop :class="{ 'show': visible }">
      <div class="look-view-header">
        <h2>信息详情</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="look-view-content" >
        <div class="student-avatar">
          <!-- <img :src="student.avatar || defaultAvatar" :alt="student.name" /> -->
        </div>
        <!-- 学生数据 -->
        <div class="look-info" v-if="dataType==='student'">
          <div class="info-row" v-for="(v,atr) in Data" :key="atr">
            <span class="label">
              {{ atr==='studentId'?'Id'
              :atr==='name'?'姓名'
              :atr==='age'?'年龄'
              :atr==='classId'?'班级Id'
              :atr==='phoneNumber'?'手机号'
              :atr==='email'?'邮箱'
              :atr==='enrollmentDate'?'入学时间'
              :atr==='avatar'?'头像'
              :atr==='major'?'专业'
              :atr==='gender'?'性别'
              :atr==='studentNumber'?'学号'
              :atr==='grade'?'年级'
              :atr==='active'?'是否激活'
              :atr==='createTime'?'创建时间'
              :atr==='studentPassword'?'密码'
              :atr==='avatarUrl'?'头像Url'
              :atr
              }}
            </span>
            <span class="value">
              {{atr==='active'?v==1?'激活':'未激活'
                :atr==='gender'?v==1?'男':v==2?'女':'未知':v
              }}
            </span>
          </div>

        </div>
        <!-- 课程数据 -->
        <div class="look-info" v-if="dataType==='course'">
          <div class="info-row" v-for="(v,atr) in Data" :key="atr">
            <span class="label">
              {{ atr==='courseId'?'Id'
              :atr==='courseName'?'课程名'
              :atr
              }}
            </span>
            <span class="value">
              {{v}}
            </span>
          </div>
        </div>
        <!-- 班级数据 -->
        <div class="look-info" v-if="dataType==='classes'">
          <div class="info-row" v-for="(v,atr) in Data" :key="atr">
            <span class="label">
              {{ atr==='classId'?'Id'
              :atr==='className'?'班级名'
              :atr==='classNumber'?'班级'
              :atr==='grade'?'年级'
              :atr
              }}
            </span>
            <span class="value">
              {{v}}
            </span>
          </div>
        </div>

        <div class="look-info" v-if="dataType==='courseSchedule'">
          <div class="info-row" v-for="(v,atr) in Data" :key="atr">
            <span class="label">{{atr==='scheduleId'? 'ID'
                  :atr==='startTime'? '开始时间'
                  :atr==='endTime'? '结束时间'
                  :atr==='createdAt'? '创建时间'
                  :atr==='updatedAt'? '更新时间'
                  :atr==='numberOfLessons'? '节数'
                  :atr}}
            </span>
            <span class="value">{{atr==='numberOfLessons'?'第'+v+'节':v}}</span>
          </div>
        </div>

        <!-- 教师数据 -->
        <div class="look-info" v-if="dataType==='teachers'">
          <div class="info-row" v-for="(v,atr) in Data" :key="atr">
            <span class="label">
              {{ atr==='teacherId'?'Id'
              :atr==='name'?'教师名称'
              :atr==='age'?'年龄'
              :atr==='classId'?'班级Id'
              :atr==='phoneNumber'?'手机号'
              :atr==='email'?'邮箱'
              :atr==='enrollmentDate'?'入学时间'
              :atr==='avatar'?'头像'
              :atr==='major'?'专业'
              :atr==='gender'?'性别'
              :atr==='studentNumber'?'学号'
              :atr==='grade'?'年级'
              :atr==='active'?'是否激活'
              :atr==='createTime'?'创建时间'
              :atr==='hireDate'?'入职时间'
              :atr==='studentPassword'?'密码'
              :atr==='avatarUrl'?'头像Url'
              :atr
              }}
            </span>
            <span class="value">
              {{atr==='active'?v==1?'激活':'未激活'
                :atr==='gender'?v==1?'男':v==2?'女':'未知':v
              }}
            </span>
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

// 定义组件属性
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dataType: {
    type: String,
    default: 'student'
  },
  Data: {
    type: Object,
    default: () => ({})
  },
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
  z-index: 1006;
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

.look-info {
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
