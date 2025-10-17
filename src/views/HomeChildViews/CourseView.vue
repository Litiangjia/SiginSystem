<template>
  <div id="courseView">
    <!-- 课程表 -->
    <div class="course-table-container">
      <div class="course-table" :class="{ 'loaded': isLoaded }">
        <!-- 课表头部 - 星期 -->
        <div class="table-header">
          <div class="time-column"></div>
          <div v-for="(day, index) in days" :key="index" class="day-header">
            {{ day }}
          </div>
        </div>

        <!-- 课表主体 -->
        <div class="table-body">
          <div v-for="(timeSlot, timeIndex) in timeSlots" :key="timeIndex" class="table-row">
            <div class="time-column">{{ timeSlot }}</div>
            <!-- 每天的课程格子 -->
            <div v-for="(day, dayIndex) in days" :key="dayIndex" class="course-cell">
              <div
                v-if="getCourse(dayIndex, timeIndex)"
                class="course-item"
                :style="{ backgroundColor: getCourse(dayIndex, timeIndex)?.color }"
              >
                <div class="course-name">{{ getCourse(dayIndex, timeIndex)?.name }}</div>
                <div class="course-room">{{ getCourse(dayIndex, timeIndex)?.room }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="course-item-box">

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义星期几
const days = ['周一', '周二', '周三', '周四', '周五']
// 定义时间槽
const timeSlots = [
  '08:00\n08:45',
  '09:05\n09:50',
  '10:10\n10:55',
  '11:05\n11:50',
  '14:30\n15:15',
  '15:35\n16:20',
  '16:25\n17:10',
  '17:20\n18:05',
]

// 控制初始动画
const isLoaded = ref(false)

// 更加充实的课程数据
const courses = [
  // 周一
  { day: 0, time: 0, name: '高等数学', room: 'A101', color: '#FF6B6B' },
  { day: 0, time: 1, name: '高等数学', room: 'A101', color: '#FF6B6B' },
  { day: 0, time: 2, name: '高等数学', room: 'A101', color: '#FF6B6B' },
  { day: 0, time: 3, name: '英语', room: 'B202', color: '#4ECDC4' },
  { day: 0, time: 4, name: '计算机基础', room: 'D404', color: '#96CEB4' },
  { day: 0, time: 5, name: '计算机基础', room: 'D404', color: '#96CEB4' },

  // 周二
  { day: 1, time: 0, name: '物理', room: 'C303', color: '#45B7D1' },
  { day: 1, time: 1, name: '物理', room: 'C303', color: '#45B7D1' },
  { day: 1, time: 2, name: '化学', room: 'E105', color: '#FFA07A' },
  { day: 1, time: 3, name: '化学', room: 'E105', color: '#FFA07A' },
  { day: 1, time: 6, name: '体育', room: '操场', color: '#98FB98' },
  { day: 1, time: 7, name: '体育', room: '操场', color: '#98FB98' },

  // 周三
  { day: 2, time: 1, name: '英语', room: 'B202', color: '#4ECDC4' },
  { day: 2, time: 2, name: '物理实验', room: '实验室C', color: '#87CEEB' },
  { day: 2, time: 3, name: '物理实验', room: '实验室C', color: '#87CEEB' },
  { day: 2, time: 4, name: '语文', room: 'F301', color: '#DDA0DD' },
  { day: 2, time: 5, name: '语文', room: 'F301', color: '#DDA0DD' },

  // 周四
  { day: 3, time: 0, name: '计算机基础', room: 'D404', color: '#96CEB4' },
  { day: 3, time: 1, name: '计算机基础', room: 'D404', color: '#96CEB4' },
  { day: 3, time: 2, name: '数学', room: 'A101', color: '#FF6B6B' },
  { day: 3, time: 3, name: '数学', room: 'A101', color: '#FF6B6B' },
  { day: 3, time: 5, name: '班会', room: 'G202', color: '#F0E68C' },

  // 周五
  { day: 4, time: 0, name: '化学', room: 'E105', color: '#FFA07A' },
  { day: 4, time: 1, name: '化学', room: 'E105', color: '#FFA07A' },
  { day: 4, time: 4, name: '美术', room: 'H101', color: '#FFB6C1' },
  { day: 4, time: 5, name: '美术', room: 'H101', color: '#FFB6C1' },
  { day: 4, time: 6, name: '自习', room: '自习室', color: '#D3D3D3' },
  { day: 4, time: 7, name: '自习', room: '自习室', color: '#D3D3D3' }
]

// 获取指定时间槽的课程
const getCourse = (dayIndex: number, timeIndex: number) => {
  return courses.find(course => course.day === dayIndex && course.time === timeIndex)
}

// 页面加载后触发动画
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>
<style scoped lang="less">
   @import '@/assets/commonLess/componentsLess/table.less';
   @media (max-width: 900px) {
      .course-table{
        min-width:768px;
      }
      .time-column{
        position:flex;
        left:0;
        top:0;
      }
      .course-table-container{
        overflow: hidden;
        padding:0;
        overflow-x: auto;
      }
    }
</style>


