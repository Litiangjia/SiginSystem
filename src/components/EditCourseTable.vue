<template>
  <!-- <transition name="wndows1"> -->
<div v-if="visible" class="wndows1">
  <div class="wndows1-content">
    <button class="btn4 float-right " @click="closeModal">关闭</button>
    <!-- 数据显示区域 -->
    <div class="course-table-view">
      <div class="table-header">
        表名:{{ Data.courseTableName }}
      </div>

      <div class="table-actions">
          <button class="add-btn" @click="addRow">添加课程</button>
          <button class="edit-btn" @click="batchEdit">批量编辑</button>
          <button class="delete-btn" @click="deleteSelected">删除选中</button>
          <button class="save-btn" @click="saveAll">全部保存</button>
          <button class="delete-btn" @click="deleteAll">全部删除</button>
      </div>

      <!-- 课程表展示区域（仅在有表时显示） -->
      <div v-if="Data.courseTableName&&!showBatchEdit" class="table-container">
        <div class="week-tabs">
          <button
            v-for="(day, index) in currentWeekdays"
            :key="index"
            :class="['week-tab', { active: activeDay === index+1 }]"
            @click="()=>{activeDay = index+1;}"
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
              v-if="currentWeekdays.length > 5"
              class="control-btn remove-day-btn"
              @click="removeWeekday"
              title="删除最后一天"
            >
              -
            </button>
          </div>
        </div>
        <!-- 数据显示区域 手机端-->
        <!-- <div class="mobile-table" v-if="isMobile">

          </div> -->
        <div class="desktop-table">
          <!-- 桌面端表格展示 -->
          <table>
            <thead>
              <tr>
                <th><input type="checkbox"
                  :checked="selectedRows.length!=0"
                  @change="toggleSelectAll"
                 /></th>
                <th>课程名称</th>
                <th>授课教师</th>
                <th>第几节课</th>
                <th>学分</th>
                <th>操作</th>
              </tr>
            </thead>
            <transition-group tag="tbody" name="list">
              <tr v-for="(row, index) in getDayCourses(activeDay)" :key="index">
                <td>
                  <input
                    type="checkbox"
                    :checked="selectedRows.includes(row.courseTableId as number)"
                    @change="toggleSelection(row.courseTableId as number)"
                  />
                </td>
                <td>
                  <SearchSelect
                    @updateId = "(Id:number) => row.courseFkId = Id"
                    :nowValue="row.courseFkId"
                    :dataType="'course'"
                    :dataUrl="'/admin/courseData'"
                  />
                </td>
                <td>
                  <SearchSelect
                    @updateId = "(Id:number) => row.teacherFkId = Id"
                    :nowValue="row.teacherFkId"
                    :dataType="'teachers'"
                    :dataUrl="'/admin/teachersList'"
                  />
                </td>
                <td>
                  <SearchSelect
                    @updateId = "(Id:number) => row.courseScheduleFkId = Id"
                    :nowValue="row.courseScheduleFkId"
                    :dataType="'courseSchedule'"
                    :dataUrl="'/admin/courseScheduleData'"
                  />

                </td>
                <td><input v-model="row.credit" type="number" min="0" max="10" /></td>
                <td>
                  <button class="save-btn-small" @click="saveRow(row)">保存</button>
                  <button class="delete-btn-small" @click="deleteRow(index,row.courseTableId as number)">删除</button>
                </td>
              </tr>
            </transition-group>
          </table>
        </div>
      </div>

        <!-- 批量编辑区域 -->
        <transition name="slide-fade">
          <div v-if="showBatchEdit" class="batch-edit-panel">
            <h3>批量编辑 ({{ currentWeekdays[activeDay-1] }})</h3>
            <div class="batch-edit-form">
              <div class="form-group">
                <label>课程名称:</label>
                <SearchSelect
                    @updateId = "(Id:number) => batchEditForm.courseFkId = Id"
                    :nowValue="batchEditForm.courseFkId"
                    :dataType="'course'"
                    :dataUrl="'/admin/courseData'"
                />
              </div>
              <div class="form-group">
                <label>授课教师:</label>
                <SearchSelect
                    @updateId = "(Id:number) => batchEditForm.teacherFkId = Id"
                    :nowValue="batchEditForm.teacherFkId"
                    :dataType="'teachers'"
                    :dataUrl="'/admin/teachersList'"
                />
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
        <div v-if="WeekDays.length === 0" class="empty-state">
          <p>请添加数据</p>
        </div>
      </div>
  </div>
</div>
  <!-- </transition> -->
</template>

<script setup lang="ts">
// import { http } from '@/ajax/send';
import { ref,onMounted } from 'vue'
import type {CourseTableRow,WeekDay} from '@/assets/ts/interfaceManager';
import { http } from '@/ajax/send';
import D from '@/assets/ts/newMessageDialog';
import SearchSelect from '@/components/SearchSelect.vue';


// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  Data:{
    type: Object,
    default: () => ({})
  }
})
// const pages = ref({
//   current: 1, // 当前页码
//   size: 50, // 每页显示的记录数
//   total: 0, // 全部数 默认为0 等待获取数据
//   pages: 0 // 总页数
// });
// 定义事件发射器
const emit = defineEmits(['update:Visible', 'close','newAdd','look','edit','del']);

//关闭弹窗
const closeModal = () => {
  emit('update:Visible', false)
  emit('close');
}


onMounted(async() => {
  // if(props.dataType === 'classes'){
  //   pageGet(pages.value.current,pages.value.size);
  // }
})





//-----------------------------------


const activeDay = ref(1);  //当前星期索引
const nowWeekDaysIndex = ref(0);  //当前周期对应数据下标
const WeekDays = ref<WeekDay[]>([]);  //课程表各个星期数据总数据
const currentWeekdays = ref(['周一', '周二','周三', '周四', '周五'])//默认当前周期数据
const selectedRows = ref<number[]>([]) //选中的行索引
const showBatchEdit = ref(false)  //是否显示批量编辑面板
const batchEditForm = ref({} as CourseTableRow);  //批量编辑表单数据
//添加课程表行
const addRow = async() => {
  if(!props.Data.id) return D.warning("课程表名称未正确引用！");

  try{
    //这里需要请求添加课程表行数据 向后端发送请求
    await http.post('/admin/courseTableData/saveOrUpdateTableRow',{weekDay:activeDay.value,courseTableNameFkId:props.Data.id}); //添加课程表行数据以为当前星期
    //刷新当前星期的课程表数据
    getCourseTableDataNowWeek();  //重新获取当前星期的课程表数据
  }catch(err){
    console.log(err);
  }
}

//添加星期
const addWeekday = () => {
  const weekdayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  if (currentWeekdays.value.length < 7) {
    currentWeekdays.value.push(weekdayNames[currentWeekdays.value.length] as string)
  }
}

//批量编辑
const batchEdit = () => {
  if (selectedRows.value.length === 0) {
    D.warning("请先选择要批量编辑的行！");
    return;
  }
  //显示批量编辑面板
  showBatchEdit.value = true
}
//批量编辑确定
const confirmBatchEdit = async () => {
  const courseDataRows: CourseTableRow[] = [];
  selectedRows.value.forEach(id => {
    courseDataRows.push({
      courseTableId:id ,
      courseFkId: batchEditForm.value.courseFkId,
      teacherFkId: batchEditForm.value.teacherFkId,
      courseTableNameFkId: props.Data.id,
      credit: batchEditForm.value.credit,
      weekDay: activeDay.value,
    });
  });

  // try{
  //   // console.log(selectedRows.value);
  //   // console.log(batchEditForm.value);
  //   // //这里需要请求批量编辑课程表行数据 向后端发送请求
  //   // await http.post('/admin/courseTableData/saveOrUpdateTableRow',{weekDay:activeDay.value,courseTableNameFkId:props.Data.id}); //添加课程表行数据以为当前星期
  //   // //刷新当前星期的课程表数据
  //   // getCourseTableDataNowWeek(activeDay.value);  //重新获取当前星期的课程表数据
  // }catch(err){
  //   console.log(err);
  // }
};
//批量编辑取消
const cancelBatchEdit = () => {
  showBatchEdit.value = false
  batchEditForm.value = {} as CourseTableRow;
}

//删除星期
const removeWeekday = () => {
  if (currentWeekdays.value.length > 5) {
    //删除前需要清除对应星期的课程表数据
    const weekdayIndex = currentWeekdays.value.length - 1
    //先判断是否有对应星期的课程表数据
    if(WeekDays.value.find(row => row.weekDay === weekdayIndex)){
      //这里需要请求删除对应星期的课程表数据 向后端发送请求
      //预留
      //有对应星期的课程表数据，则删除
      WeekDays.value = WeekDays.value.filter(row => row.weekDay !== weekdayIndex)
    }
    // if(WeekDays.value.fill(row=>row.weekDay!== weekdayIndex))
    if(activeDay.value === weekdayIndex) activeDay.value--;

    currentWeekdays.value.pop()
  }
}

//获取当前星期的课程表数据 渲染展示当前星期的课程表数据
const getDayCourses = (day: number) => {
  const weekdayIndex = day;
  //查找当前星期的课程表数据
  let weekdayRows: CourseTableRow[] = [];

  for(let i = 0; i < WeekDays.value.length; i++) {
    const row = WeekDays.value[i];
    if (row?.weekDay === weekdayIndex) {
      //有对应星期的课程表数据，则返回
      nowWeekDaysIndex.value = i;
      weekdayRows =  row.courseTableRows;
      //终止循环
      break;
    }else{
      weekdayRows = [];
    }
  }

  return weekdayRows;

}
//删除当前星期的指定行数据
const deleteRow = async (index: number,courseTableId:number) => {
  try{
      //查找当前星期的课程表数据
    const rows = WeekDays.value[nowWeekDaysIndex.value];
    if(rows){
      //这里需要请求删除对应星期的课程表数据 向后端发送请求
      //预留
      if(rows.courseTableRows[index]){
        //有数据，则删除， 删除前判断是否已经存在数据库中有则需要请求删除数据库数据
        if(rows.courseTableRows[index].courseTableId){
          alert("删除数据库数据");
          //有id，则请求删除数据库数据 有id的数据都是数据库中已存在的数据，需要同步删除
          const res = await http.delete('/admin/courseTableData/deleteTableRow/'+courseTableId);

          D.success("删除成功"+res,500);
          //预留
        }
        rows.courseTableRows.splice(index,1);  //删除指定数据
      }


    }
  }catch(err){
    console.log(err);
  }

}

//保存或者更新行数据
const saveRow = async (row: CourseTableRow) => {
  // const courseDataRows: CourseTableRow[] = [];
  // WeekDays.value.forEach(rows => {
  //   rows.courseTableRows.forEach(row => {
  //     courseDataRows.push(row);
  //   })
  // })

  // console.log(courseDataRows);
  try{
    const res = await http.post('/admin/courseTableData/saveOrUpdateTableRow',row);
    D.success("保存成功"+res,500);
    //刷新当前星期的课程表数据
  }catch(err){
    console.log(err);
    D.warning("保存失败，可能同课同节数段冲突!或者其它表相同教师授课冲突！");
  }
  //查找当前星期的课程表数据
  // console.log(row,props.Data.id,props.Data.classFkId)
}


//保存课程表数据
// const saveCourseTable = () => {

// }
  //查找当前星期的课程表数据

//选中多选操作
const toggleSelection = (courseTableId: number) => {
  if (selectedRows.value.includes(courseTableId)) { //如果已经选中，则取消选中
    selectedRows.value = selectedRows.value.filter(id => id !== courseTableId)  //取消选中 过滤掉当前选中的id
  } else {
    selectedRows.value.push(courseTableId)  // 否则，则添加到选中列表 选中
  }

}
//全选操作
const toggleSelectAll = () => {
  if (selectedRows.value.length === 0) { //如果没有选中，则全选
    selectedRows.value = getDayCourses(activeDay.value).map(row => row.courseTableId as number)  // 否则，则添加到选中列表 全选
  } else {
    selectedRows.value = []  // 否则，则清空选中列表
  }
  // console.log(selectedRows.value)
}






 //编写代码


 //初始化数据
 onMounted(() => {
    getCourseTableDataNowWeek();
 })

 //获取当前所有星期课程表数据也就是课程表数据
 const getCourseTableDataNowWeek = async () => {
  try{
    const res = await http.get(`/admin/courseTableData/getCourserTableData/${props.Data.id}`) as CourseTableRow[];
    if(res.length >0){
      //先清除原有数据
      WeekDays.value = [];
      res.forEach(row => {
        updateRow(row);  //数据加载更新到课程表数据
      });
      // const weekDays: WeekDay[] = [];
    }else{
      WeekDays.value = [];
    }
  }catch(err){
    console.log(err);
  }


 }

 const updateRow = (newRow: CourseTableRow) => {
  //判断WeekDays是否有对应星期的课程表数据
  const weekdayRows = WeekDays.value.find(row => row.weekDay === newRow.weekDay);
  //如果有对应星期的课程表数据，则增加数据行
  if(weekdayRows){
    weekdayRows.courseTableRows.push(newRow);  //有对应星期的课程表数据，则再次增加数据行
  }else{
    //没有对应星期的课程表数据，则创建新的数据行
    WeekDays.value.push({weekDay:newRow.weekDay, courseTableRows:[newRow]});
  }
  // console.log(WeekDays.value);
}


//删除选中数据
const deleteSelected = async () => {
  try{
    const res = await http.delete('/admin/courseTableData/deleteTableRows/'+selectedRows.value);
    D.success("删除成功"+res,500);
    //刷新当前星期的课程表数据
    getCourseTableDataNowWeek();  //重新获取课程表数据
    selectedRows.value = [];  //清空选中列表
  }catch(err){
    console.log(err);
  }
}


//保存课程表数据
const saveAll = async () => {
  const courseDataRowsAll: CourseTableRow[] = [];

  WeekDays.value.forEach(rows => {
    rows.courseTableRows.forEach(row => {
      courseDataRowsAll.push(row);
    })
  })
  try{
    await http.post('/admin/courseTableData/saveOrUpdateTableRows',courseDataRowsAll);
    D.success("已保存",500);
    //刷新当前星期的课程表数据
    getCourseTableDataNowWeek();  //重新获取课程表数据
  }catch(err){
    console.log(err);
  }
}
//全部删除
const deleteAll = () => {
  D.warning("确定删除全部数据？").enter(async() => {
        try{
          const res = await http.delete('/admin/courseTableData/deleteCourseTable/'+props.Data.id);
          D.success("删除成功"+res,500);
          //刷新当前星期的课程表数据
          getCourseTableDataNowWeek();  //重新获取课程表数据
          selectedRows.value = [];  //清空选中列表
        }catch(err){
          console.log(err);
        }
    }
  )
};

</script>

<style scoped lang="less">
@import "@/assets/commonLess/componentsLess/window.less";
@import "@/assets/commonLess/componentsLess/btn.less";
@import '@componentsLess/courserTable.less';
.list-content{
  height: calc(100vh - 310px);
}
</style>
