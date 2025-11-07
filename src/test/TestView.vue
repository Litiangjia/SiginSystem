<template>
  <div class="course-table-view">
    <!-- 表选择和创建区域 -->
    <div class="table-header">
      <select class="table-select">
        <option value="">指定班级</option>
        <option value="">不指定</option>
        <option value="1">1班</option>
        <option value="2">2班</option>
        <option value="3">3班</option>
      </select>

      <!-- 表选择下拉框 -->
      <select
        v-if="savedTables.length > 0"
        v-model="selectedTableId"
        @change="handleTableChange"
        class="table-select"
      >
        <option value="">创建新表或选择已有表</option>
        <option
          v-for="table in savedTables"
          :key="table.id"
          :value="table.id"
        >
          {{ table.courseTableName }}
        </option>
      </select>

      <!-- 表名输入 -->
      <input
        v-model="currentTableName"
        placeholder="请输入表名"
        class="table-name-input"
        :disabled="!!selectedTableId"
      />

      <!-- 创建/保存表按钮 -->
      <button
        class="save-btn"
        @click="saveTable"
      >
        {{ selectedTableId ? '保存表' : '创建表' }}
      </button>

      <!-- 删除表按钮 -->
      <button
        v-if="selectedTableId"
        class="reset-btn"
        @click="deleteTable"
      >
        删除表
      </button>
    </div>

    <!-- 课程表数据操作区域（仅在有表时显示） -->
    <div v-if="selectedTableId" class="table-actions">
      <button class="add-btn" @click="addRow">添加课程</button>
      <button class="edit-btn" @click="batchEdit">批量编辑</button>
      <button class="delete-btn" @click="deleteSelected">删除选中</button>
    </div>

    <!-- 课程表展示区域（仅在有表时显示） -->
    <div v-if="selectedTableId" class="table-container">
      <div class="week-tabs">
        <button
          v-for="(day, index) in currentWeekdays"
          :key="index"
          :class="['week-tab', { active: activeDay === index }]"
          @click="activeDay = index"
        >
          {{ day }}
        </button>

        <!-- 星期控制按钮 -->
        <div class="week-control-buttons">
          <button
            v-if="currentWeekdays.length < 7"
            class="control-btn add-day-btn"
            @click="addWeekday"
            title="添加一天"
          >
            +
          </button>
          <button
            v-if="currentWeekdays.length > 1"
            class="control-btn remove-day-btn"
            @click="removeWeekday"
            title="删除最后一天"
          >
            -
          </button>
        </div>
      </div>

      <div class="mobile-table" v-if="isMobile">
        <!-- 手机端展示 -->
        <transition-group name="list" tag="div">
          <div
            v-for="(row, index) in getDayCourses(activeDay)"
            :key="row.id"
            class="mobile-row"
          >
            <div class="mobile-row-header">
              <input
                type="checkbox"
                :checked="selectedRows.includes(row.id)"
                @change="toggleSelection(row.id)"
              />
              <span>第{{ index + 1 }}行</span>
            </div>
            <div class="mobile-row-content">
              <div class="form-group">
                <label>课程名称:</label>
                <input v-model="row.courseFkId" placeholder="课程名称" />
              </div>
              <div class="form-group">
                <label>授课教师:</label>
                <input v-model="row.teacherFkId" placeholder="教师姓名" />
              </div>
              <div class="form-group">
                <label>上课时间:</label>
                <input
                  v-model="row.courseScheduleFkId"
                  type="time"
                  placeholder="上课时间"
                />
              </div>
              <div class="form-group">
                <label>教室:</label>
                <input v-model="row.classFkId" placeholder="教室" />
              </div>
              <div class="form-group">
                <label>学分:</label>
                <input
                  v-model.number="row.credit"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="学分"
                />
              </div>
              <div class="mobile-row-actions">
                <button class="save-btn-small" @click="saveRow(row)">保存</button>
                <button class="delete-btn-small" @click="deleteRow(row)">删除</button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="desktop-table" v-else>
        <!-- 桌面端表格展示 -->
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" /></th>
              <th>课程名称</th>
              <th>授课教师</th>
              <th>第几节课</th>
              <th>学分</th>
              <th>操作</th>
            </tr>
          </thead>
          <transition-group tag="tbody" name="list">
            <tr v-for="row in getDayCourses(activeDay)" :key="row.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(row.id)"
                  @change="toggleSelection(row.id)"
                />
              </td>
              <td><input v-model="row.courseFkId" placeholder="课程名称" /></td>
              <td>
                <select class="table-select" v-model="row.teacherFkId">
                  <option value="">请选择</option>
                  <option value="1">xx教授</option>
                  <option value="2">xx教授</option>
                  <option value="3">xx教授</option>
                  <option value="4">xx教授</option>
                </select>
              </td>
              <td>
                <select class="table-select" v-model="row.courseScheduleFkId">
                  <option value="">请选择</option>
                  <option value="1">xx班级</option>
                  <option value="2">xx班级</option>
                  <option value="3">xx班级</option>
                  <option value="4">xx班级</option>
                </select>
              </td>
              <td><input v-model.number="row.credit" type="number" min="0" max="10" /></td>
              <td>
                <button class="save-btn-small" @click="saveRow(row)">保存</button>
                <button class="delete-btn-small" @click="deleteRow(row)">删除</button>
              </td>
            </tr>
          </transition-group>
        </table>
      </div>
    </div>

    <!-- 批量编辑区域 -->
    <transition name="slide-fade">
      <div v-if="showBatchEdit && selectedTableId" class="batch-edit-panel">
        <h3>批量编辑 ({{ currentWeekdays[activeDay] }})</h3>
        <div class="batch-edit-form">
          <div class="form-group">
            <label>课程名称:</label>
            <input v-model="batchEditForm.courseFkId" placeholder="课程名称" />
          </div>
          <div class="form-group">
            <label>授课教师:</label>
            <input v-model="batchEditForm.teacherFkId" placeholder="教师姓名" />
          </div>
          <div class="form-group">
            <label>上课时间:</label>
            <input v-model="batchEditForm.courseScheduleFkId" type="time" />
          </div>
          <div class="form-group">
            <label>学分:</label>
            <input
              v-model.number="batchEditForm.credit"
              type="number"
              min="0"
              max="10"
              placeholder="学分"
            />
          </div>
          <div class="batch-edit-actions">
            <button class="save-btn" @click="confirmBatchEdit">确定</button>
            <button class="cancel-btn" @click="cancelBatchEdit">取消</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 无表提示 -->
    <div v-if="!selectedTableId" class="empty-state">
      <p v-if="savedTables.length === 0">请先创建表名以开始管理课程表数据</p>
      <p v-else>请选择一个已创建的表或创建新表</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

// 定义表结构接口
interface CourseTable {
  id: string
  courseTableName: string
  data: CourseTableRow[]
  weekdays: string[]
}

// 定义课程表行数据接口
interface CourseTableRow {
  id: number
  courseFkId: number
  teacherFkId: number
  courseScheduleFkId:number
  classFkId: number
  credit: number
  weekDay: number // 0-6 表示周一到周日
}

// 定义批量编辑表单接口
interface BatchEditForm {
  courseFkId: number
  teacherFkId: number
  courseScheduleFkId:number
  credit: number
}

// 表相关状态
const currentTableName = ref('') // 当前选中表名
const selectedTableId = ref('')
const savedTables = ref<CourseTable[]>([]) // 已保存的表数据

// 表格数据相关
const tableData = ref<CourseTableRow[]>([])  // 课程表数据
const selectedRows = ref<number[]>([])
const showBatchEdit = ref(false)
const activeDay = ref(0) // 0=周一, 1=周二, ..., 6=周日

// 批量编辑相关
const batchEditForm = reactive<BatchEditForm>({
  courseFkId: -1,
  teacherFkId: -1,
  courseScheduleFkId: -1,
  credit: 0
})

// 当前表的星期数组
const currentWeekdays = ref(['周一', '周二', '周三', '周四', '周五'])

// 设备检测
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

// 全选状态
const isAllSelected = computed(() => {
  const dayCourses = getDayCourses(activeDay.value)
  return selectedRows.value.length > 0 &&
         selectedRows.value.length === dayCourses.length &&
         dayCourses.every(course => selectedRows.value.includes(course.id))
})

// 获取指定星期几的课程
const getDayCourses = (dayIndex: number) => {
  return tableData.value.filter(row => row.weekDay === dayIndex)
}

// 初始化数据
onMounted(() => {
  loadSavedTables()
})

// 加载已保存的表
const loadSavedTables = () => {
  const stored = localStorage.getItem('courseTables')
  if (stored) {
    try {
      savedTables.value = JSON.parse(stored)
    } catch (e) {
      console.error('解析存储的表数据失败:', e)
      savedTables.value = []
    }
  }
}

// 保存表到本地存储
const saveTablesToStorage = () => {
  localStorage.setItem('courseTables', JSON.stringify(savedTables.value))
}

// 处理表切换
const handleTableChange = () => {
  if (!selectedTableId.value) {
    // 清空当前表数据
    currentTableName.value = ''
    tableData.value = []
    currentWeekdays.value = ['周一', '周二', '周三', '周四', '周五']
    activeDay.value = 0
    selectedRows.value = []
    return
  }

  // 加载选中的表
  const selectedTable = savedTables.value.find(table => table.id === selectedTableId.value) // 根据id查找表
  if (selectedTable) { // 如果找到表
    currentTableName.value = selectedTable.courseTableName // 显示表名
    tableData.value = [...selectedTable.data]
    currentWeekdays.value = [...selectedTable.weekdays]
    activeDay.value = 0
    selectedRows.value = []
  }
}

// 保存/创建表
const saveTable = () => {
  if (!currentTableName.value.trim()) {
    alert('请输入表名')
    return
  }

  if (selectedTableId.value) { //执行保存操作
    // 更新现有表
    const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value);
    if (tableIndex !== -1 && savedTables.value[tableIndex]!== undefined) {
      savedTables.value[tableIndex].data = [...tableData.value]
      savedTables.value[tableIndex].weekdays = [...currentWeekdays.value]
      saveTablesToStorage()
      alert('表保存成功')
    }
    console.log('保存表:', savedTables.value[tableIndex])
  } else {
    // 创建新表
    // 检查表名是否已存在
    if (savedTables.value.some(table => table.courseTableName === currentTableName.value)) {
      alert('表名已存在，请使用其他名称')
      return
    }

    const newTable: CourseTable = {
      id: Date.now().toString(),
      courseTableName: currentTableName.value,  // 表名
      data: [...tableData.value],
      weekdays: [...currentWeekdays.value]
    }

    savedTables.value.push(newTable)
    saveTablesToStorage()

    // 设置为当前选中表
    selectedTableId.value = newTable.id
    alert(`表 "${currentTableName.value}" 创建成功`)
  }
}

// 删除表
const deleteTable = () => {
  if (!selectedTableId.value) return

  if (confirm(`确定要删除表 "${currentTableName.value}" 吗？`)) {
    const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
    if (tableIndex !== -1) {
      savedTables.value.splice(tableIndex, 1)
      saveTablesToStorage()

      // 重置状态
      selectedTableId.value = ''
      currentTableName.value = ''
      tableData.value = []
      currentWeekdays.value = ['周一', '周二', '周三', '周四', '周五']
      activeDay.value = 0
      selectedRows.value = []
    }
  }
}

// 添加行
const addRow = () => {
  const newRow: CourseTableRow = {
    id: Date.now(), // 简单生成唯一ID
    courseFkId: -1,
    teacherFkId: -1,
    courseScheduleFkId: -1,
    classFkId: -1,
    credit: 0,
    weekDay: activeDay.value // 默认添加到当前选中的星期
  }
  tableData.value.push(newRow)
}

// 保存行数据
const saveRow = (row: CourseTableRow) => {
  // 更新表数据
  console.log(row,currentTableName.value);

  const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
  if (tableIndex !== -1 && savedTables.value[tableIndex]!== undefined) {
    const rowIndex = savedTables.value[tableIndex].data.findIndex(item => item.id === row.id)
    if (rowIndex !== -1) {
      savedTables.value[tableIndex].data[rowIndex] = {...row}
    } else {
      savedTables.value[tableIndex].data.push({...row})
    }
    saveTablesToStorage()
  }
  alert(`"${row.courseFkId || '课程'}" 保存成功`)
}

// 删除行
const deleteRow = (row: CourseTableRow) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    tableData.value.splice(index, 1)
    // 从选中列表中移除
    const selectedIndex = selectedRows.value.indexOf(row.id)
    if (selectedIndex > -1) {
      selectedRows.value.splice(selectedIndex, 1)
    }

    // 更新存储的数据
    const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
    if (tableIndex !== -1 && savedTables.value[tableIndex]!== undefined) {
      const savedRowIndex = savedTables.value[tableIndex].data.findIndex(item => item.id === row.id)
      if (savedRowIndex !== -1) {
        savedTables.value[tableIndex].data.splice(savedRowIndex, 1)
        saveTablesToStorage()
      }
    }
    alert('删除成功')
  }
}

// 切换选择
const toggleSelection = (id: number) => {
  const index = selectedRows.value.indexOf(id)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(id)
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  const dayCourses = getDayCourses(activeDay.value)
  if (isAllSelected.value) {
    // 取消全选
    selectedRows.value = selectedRows.value.filter(
      id => !dayCourses.some(course => course.id === id)
    )
  } else {
    // 全选当前天的课程
    dayCourses.forEach(course => {
      if (!selectedRows.value.includes(course.id)) {
        selectedRows.value.push(course.id)
      }
    })
  }
}

// 批量编辑
const batchEdit = () => {
  if (selectedRows.value.length === 0) {
    alert('请先选择要编辑的行')
    return
  }
  showBatchEdit.value = true
}

// 确认批量编辑
const confirmBatchEdit = () => {
  selectedRows.value.forEach(id => {
    const row = tableData.value.find(item => item.id === id)
    if (row) {
      Object.assign(row, batchEditForm)
    }
  })

  // 更新存储的数据
  const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
  if (tableIndex !== -1) {
    selectedRows.value.forEach(id => {
      const row = tableData.value.find(item => item.id === id)
      if (row && savedTables.value[tableIndex]!== undefined) {
        const savedRowIdx = savedTables.value[tableIndex].data.findIndex(item => item.id === id)
        if (savedRowIdx !== -1) {
          savedTables.value[tableIndex].data[savedRowIdx] = {...row}
        }
      }
    })
    saveTablesToStorage()
  }

  showBatchEdit.value = false
  alert('批量编辑成功')
}

// 取消批量编辑
const cancelBatchEdit = () => {
  showBatchEdit.value = false
}

// 删除选中行
const deleteSelected = () => {
  if (selectedRows.value.length === 0) {
    alert('请先选择要删除的行')
    return
  }

  // 过滤掉选中的行
  const selectedIds = [...selectedRows.value]
  tableData.value = tableData.value.filter(
    item => !selectedIds.includes(item.id)
  )

  // 更新存储的数据
  const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
  if (tableIndex !== -1 && savedTables.value[tableIndex] !== undefined) {
    savedTables.value[tableIndex].data = savedTables.value[tableIndex].data.filter(
      item => !selectedIds.includes(item.id)
    )
    saveTablesToStorage()
  }

  alert(`成功删除 ${selectedRows.value.length} 条记录`)
  selectedRows.value = []
}

// 添加星期几
const addWeekday = () => {
  const weekdayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  if (currentWeekdays.value.length < 7) {
    currentWeekdays.value.push(weekdayNames[currentWeekdays.value.length] as string)

    // 更新存储的数据
    const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
    if (tableIndex !== -1 && savedTables.value[tableIndex] !== undefined) {
      savedTables.value[tableIndex].weekdays = [...currentWeekdays.value]
      saveTablesToStorage()
    }
  }
}

// 删除最后一个星期几
const removeWeekday = () => {
  if (currentWeekdays.value.length > 1) {
    // 删除前需要清理 tableData 中属于被删天的数据
    const dayToRemoveIndex = currentWeekdays.value.length - 1
    tableData.value = tableData.value.filter(row => row.weekDay !== dayToRemoveIndex)
    // 清理选中状态
    selectedRows.value = selectedRows.value.filter(id => {
      const row = tableData.value.find(r => r.id === id)
      return row && row.weekDay !== dayToRemoveIndex
    })

    currentWeekdays.value.pop()

    // 如果当前激活的天被删除了，则切换到新的最后一天
    if (activeDay.value >= currentWeekdays.value.length) {
      activeDay.value = currentWeekdays.value.length - 1
    }

    // 更新存储的数据
    const tableIndex = savedTables.value.findIndex(table => table.id === selectedTableId.value)
    if (tableIndex !== -1 && savedTables.value[tableIndex] !== undefined) {
      savedTables.value[tableIndex].data = [...tableData.value]
      savedTables.value[tableIndex].weekdays = [...currentWeekdays.value]
      saveTablesToStorage()
    }
  }
}
</script>

<style scoped>
.course-table-view {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.table-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.table-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  min-width: 150px;
  background-color: white;
}

.table-name-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 300px;
  min-width: 200px;
}

.table-name-input:disabled {
  background-color: #f5f5f5;
  color: #666;
}

.table-actions {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.table-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.table-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
}

.edit-btn {
  background-color: #ff9800;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.save-btn {
  background-color: #2196F3;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background-color: #0b7dda;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.reset-btn {
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.cancel-btn {
  background-color: #9E9E9E;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #757575;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

/* 星期标签页 */
.week-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
}

.week-tab {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.week-tab:hover {
  background-color: #e0e0e0;
}

.week-tab.active {
  background-color: #2196F3;
  color: white;
  border-color: #2196F3;
}

/* 控制按钮样式 */
.week-control-buttons {
  display: flex;
  align-items: end;
}

.control-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background-color: #e0e0e0;
}

.add-day-btn {
  color: #4CAF50;
}

.remove-day-btn {
  color: #f44336;
}

/* 桌面端表格样式 */
.desktop-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  min-width: 800px;
}

.desktop-table th,
.desktop-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.desktop-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  white-space: nowrap;
}

.desktop-table input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.desktop-table input[type="time"] {
  width: 100%;
}

.desktop-table input[type="number"] {
  width: 80px;
}

.save-btn-small,
.delete-btn-small {
  padding: 4px 8px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.save-btn-small {
  background-color: #2196F3;
  color: white;
}

.save-btn-small:hover {
  background-color: #0b7dda;
  transform: scale(1.05);
}

.delete-btn-small {
  background-color: #f44336;
  color: white;
}

.delete-btn-small:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}

/* 手机端样式 */
.mobile-row {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  background-color: white;
}

.mobile-row:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.mobile-row-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.mobile-row-header input {
  margin-right: 10px;
}

.mobile-row-content .form-group {
  margin-bottom: 12px;
}

.mobile-row-content label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 14px;
}

.mobile-row-content input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.mobile-row-content input[type="time"] {
  width: 100%;
}

.mobile-row-content input[type="number"] {
  width: 100px;
}

.mobile-row-actions {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

/* 批量编辑面板 */
.batch-edit-panel {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.batch-edit-panel h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.batch-edit-form .form-group {
  margin-bottom: 15px;
}

.batch-edit-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.batch-edit-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.batch-edit-form input[type="time"] {
  width: 100%;
}

.batch-edit-form input[type="number"] {
  width: 100px;
}

.batch-edit-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

/* 空状态提示 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.empty-state p {
  margin: 0;
}

/* 动画效果 */
/* 列表项动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 滑动淡入动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-table-view {
    padding: 10px;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-select {
    width: 100%;
    margin-bottom: 10px;
  }

  .table-name-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .table-actions {
    flex-direction: column;
  }

  .table-actions button {
    width: 100%;
    margin-bottom: 5px;
    margin-right: 0;
  }

  .week-tabs {
    flex-wrap: wrap;
  }

  .week-tab {
    flex: 1 0 auto;
    margin-bottom: 5px;
    text-align: center;
  }

  .batch-edit-actions {
    flex-direction: column;
  }

  .cancel-btn {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
