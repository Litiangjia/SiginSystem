<!-- src/components/EditView.vue -->
<template>
  <div class="add-view-overlay" v-if="visible" @click="closeOverlay">
    <div class="add-view-container" @click.stop :class="{ 'show': visible }">
      <div class="add-view-header">
        <h2>添加数据</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="add-view-content">
        <form v-if="dataType==='student'" @submit.prevent="add">
          <div class="form-group" v-for="(v,atr) in Data" :key="atr">
            <label>{{atr==='name'? '姓名'
            :atr==='studentNumber'? '学号'
            :atr==='gender'? '性别'
            :atr==='age'? '年龄'
            :atr==='major'? '专业'
            :atr==='active'? '激活状态'
            :atr==='class'? '班级'
            :atr==='phoneNumber'? '联系电话'
            :atr==='email'? '邮箱'
            :atr==='enrollmentDate'? '入学时间'
            :atr==='studentPassword'? '密码'
            :atr}}</label>

            <select v-if="atr==='active'" id="active" v-model="Data[atr]">
              <option value="0">未激活(禁用)</option>
              <option value="1">激活(启用)</option>
            </select>

            <select v-else-if="atr==='gender'" id="gender" v-model="Data[atr]">
              <option value="1">男</option>
              <option value="2">女</option>
              <option value="0">未知</option>
            </select>

             <input
              v-else
              :id="atr"
              v-model="Data[atr]"
              :type="atr==='age'? 'number' : atr==='enrollmentDate'? 'date' : atr==='phoneNumber'? 'tel' : 'text'"
              required
            />
            <!-- {{atr}} -->
          </div>
        </form>

        <form v-else-if="dataType==='teachers'" @submit.prevent="add">
          <div class="form-group" v-for="(v,atr) in Data" :key="atr">
            <label>{{atr==='name'? '教师姓名'
            :atr==='gender'? '性别'
            :atr==='age'? '年龄'
            // :atr==='major'? '专业'
            // :atr==='active'? '激活状态'
            // :atr==='phoneNumber'? '联系电话'
            // :atr==='email'? '邮箱'
            :atr==='hireDate'? '入职时间'
            :atr}}</label>

            <!-- <select v-if="atr==='active'" id="active" v-model="Data[atr]">
              <option value="0">未激活(禁用)</option>
              <option value="1">激活(启用)</option>
            </select> -->

            <select v-if="atr==='gender'" id="gender" v-model="Data[atr]">
              <option value="1">男</option>
              <option value="2">女</option>
              <option value="0">未知</option>
            </select>

             <input
              v-else
              :id="atr"
              v-model="Data[atr]"
              :type="atr==='age'? 'number' : atr==='hireDate'? 'date' : atr==='phoneNumber'? 'tel' : 'text'"
              required
            />
            <!-- {{atr}} -->
          </div>
        </form>

        <form v-else-if="dataType==='course'" @submit.prevent="add">
          <div class="form-group" v-for="(v,atr) in Data" :key="atr">
            <label :for="atr">{{atr==='courseName'? '课程名称'
            :atr}}</label>

            <select v-if="atr==='active'" id="active" v-model="Data[atr]">
              <option value="0">未激活(禁用)</option>
              <option value="1">激活(启用)</option>
            </select>

            <!-- <select v-else-if="atr==='gender'" id="gender" v-model="Data[atr]">
              <option value="1">男</option>
              <option value="2">女</option>
              <option value="0">未知</option>
            </select> -->

             <input
              v-else
              :id="atr"
              v-model="Data[atr]"
              :type="atr==='age'? 'number' : atr==='enrollmentDate'? 'date' : atr==='phoneNumber'? 'tel' : 'text'"
              required
            />
            <!-- {{atr}} -->
          </div>
        </form>
        <form v-else-if="dataType==='classes'" @submit.prevent="add">
          <div class="form-group" v-for="(v,atr) in Data" :key="atr">
              <label :for="atr">{{atr==='className'? '班级名称'
              :atr==='classNumber'? '班级'
              :atr==='grade'? '年级'
              :atr}}</label>
              <select v-if="atr==='classNumber'" id="classNumber" v-model="Data[atr]">
                <option value="1">(1)班</option>
                <option value="2">(2)班</option>
                <option value="3">(3)班</option>
                <option value="4">(4)班</option>
                <option value="5">(5)班</option>
                <option value="6">(6)班</option>
              </select>
              <select v-else-if="atr==='grade'" id="grade" v-model="Data[atr]">
                <option value="1">一年级</option>
                <option value="2">二年级</option>
                <option value="3">三年级</option>
                <option value="4">四年级</option>
                <option value="5">五年级</option>
                <option value="6">六年级</option>
              </select>
              <input
                v-else
                :id="atr"
                v-model="Data[atr]"
                required
              />
          </div>
        </form>
        <form v-else-if="dataType==='courseSchedule'" @submit.prevent="add">
          <div class="form-group" v-for="(v,atr) in Data" :key="atr">
            <label :for="atr">{{atr==='scheduleId'? 'ID'
            :atr==='startTime'? '开始时间'
            :atr==='endTime'? '结束时间'
            :atr==='createdAt'? '创建时间'
            :atr==='updatedAt'? '更新时间'
            :atr==='numberOfLessons'? '节数'
            :atr}}</label>
            <select v-if="atr==='numberOfLessons'" id="numberOfLessons" v-model="Data[atr]">
              <option value="0">未指定</option>
              <option value="1">第一节</option>
              <option value="2">第二节</option>
              <option value="3">第三节</option>
              <option value="4">第四节</option>
              <option value="5">第五节</option>
              <option value="6">第六节</option>
              <option value="7">第七节</option>
              <option value="8">第八节</option>
              <option value="9">第九节</option>
              <option value="10">第十节</option>
              <option value="11">第十一节</option>
              <option value="12">第十二节</option>
              <option value="13">第十三节</option>
              <option value="14">第十四节</option>
            </select>
            <input
              v-else
              :id="atr"
              v-model="Data[atr]"
              :type="atr==='startTime' || atr==='endTime'? 'time' : atr==='createdAt' || atr==='updatedAt' ? 'date' : 'text'"
              required
            />
          </div>
        </form>

        <form v-else-if="dataType==='courseTableNames'" @submit.prevent="add">
          <div class="form-group" v-for="(v,atr) in Data" :key="atr">
            <label :for="atr">{{atr==='courseTableName'? '课程表名称'
            :atr}}</label>
            <input
              :id="atr"
              v-model="Data[atr]"
              type="text"
              required
            />
          </div>
        </form>
      </div>

      <div class="add-view-footer">
        <button class="action-btn secondary" @click="close">取消</button>
        <button class="action-btn primary" @click="add">添加</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  dataType:{
    type: String,
    default: 'student'
  }
})

let Data = ref({});
if(props.dataType === 'student'){
   Data = ref({
    name: '',
    studentNumber: '',
    gender: '',
    age: 0,
    major: '',
    active: 1,
    enrollmentDate: '',
    phoneNumber: '',
    email: '',
    studentPassword:'123456'
  })
}else if(props.dataType === 'course'){
   Data = ref({
     courseName: '',
   });
}else if(props.dataType === 'classes'){
  Data = ref({
  className: '',
  classNumber: 1,
  grade:1
  });
}else if(props.dataType === 'courseSchedule'){
  Data = ref({
    startTime: '00:00:00',
    endTime: '00:00:00',
    numberOfLessons:0,
  });
}else if(props.dataType === 'courseTableNames'){
  Data = ref({
   courseTableName:''
  });
}else if(props.dataType === 'teachers'){
  Data = ref({
    name: '',
    gender: '',
    age: 0,
    hireDate: '',
  });
}


  // interface CourseSchedule{
  //   scheduleId?: number;
  //   startTime: Date;
  //   endTime: Date;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   numberOfLessons: number;
  // }

// console.log(Data);
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
const add = () => {
  emit('add', Data.value) // 发射事件 传递数据
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
  z-index: 1006;
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
