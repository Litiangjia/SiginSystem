<template>
  <LookView v-if="visible" :visible="visible" dataType="course" :Data="course" @close="close"></LookView>
  <EditView v-if="editVisible" :dataType="'course'" :visible="editVisible" :Data="course" @save="saveCourse" @close="closeEdit"></EditView>
  <AddView v-if="addVisible" :dataType="'course'" :visible="addVisible" @add="addCourse" @close="closeAdd"></AddView>
  <div id="courseData">
     <div class="admin-list-container">
      <!-- 标题区域 -->
      <div class="list-header">
        <h2>课程管理</h2>
        <div class="header-actions">
          <input type="text" class="search-input" v-model="search" placeholder="搜索...">
          <button class="add-btn" @click="openAddCourse">+ 新增</button>
        </div>
      </div>

      <!-- 列表内容 -->
      <div class="list-content">
        <table class="data-list">
          <thead>
            <tr>
              <th>课程ID</th>
              <th>课程名</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if=" courseList.length > 0">
              <tr v-for="(item,index) in  courseList" :key="index">
                <td><span class="item-id">{{item.courseId}}</span></td>
                <td>{{item.courseName}}</td>
                <!-- <td>
                  <span v-if="item.active==1" class="item-status status-active">激活</span>
                  <span v-else-if="item.active==0" class="item-status status-active">未激活</span>
                </td> -->
                <!-- <td>
                  <span class="item-phone">{{item.phoneNumber}}</span>
                </td> -->
                <!-- <td>
                  <span class="item-id">{{item.studentNumber}}</span>
                </td> -->
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-view" @click="lookInfo(item)">查看</button>
                    <button class="btn btn-edit" @click="editInfo(item)">编辑</button>
                    <button class="btn btn-delete" @click="del(item.courseId as number)">删除</button>
                  </div>
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination">
        <div class="page-info">共 {{pages.total}} 条记录</div>
        <div class="page-controls">
          <div class="page-btn disabled" @click="prevPage()">‹</div>
          <div class="page-btn" @click="pageGet(index,pages.size)" :class="{active:pages.current===index}" v-for="index in pages.pages" :key="index">{{ index }}</div>
          <div class="page-btn" @click="nextPage()">›</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup  lang="ts">
  import { ref,onMounted, watch } from 'vue'
  import http from "@/ajax/send";
  import LookView from '@/components/LookView.vue';
  import EditView from '@/components/EditView.vue';
  import AddView from '@/components/AddView.vue';
  import D from "@/assets/ts/newMessageDialog"
  import type { Course ,PageRequest} from "@/assets/ts/interfaceManager";
  const addVisible = ref(false); // 添加弹窗
  const visible = ref(false); // 查看弹窗
  const editVisible = ref(false);

  const course = ref<Course>({
    courseName: ''
  }); // 课程单个信息

  const courseList = ref<Course[]>([]); // 课程列表
  const search = ref(''); // 搜索关键字
  const timer = ref(0);
  const nomalCurrent = ref(1); // 默认分页
  //分页数据
    const pages = ref({
    current: 1, // 当前页码
    size: 50, // 每页显示的记录数
    total: 0, // 全部数 默认为0 等待获取数据
    pages: 0 // 总页数
  });

  //监听搜索框输入变化
  watch(() => search.value, async () => {
    if (timer.value!=0) {
      clearTimeout(timer.value);
    }
    timer.value = setTimeout(async () => {
      if (search.value === ''){
        pages.value.current = nomalCurrent.value; // 重置当前页码
        return pageGet(pages.value.current,pages.value.size);
      }
      nomalCurrent.value = pages.value.current; // 保存当前页码
      pageGet(1,pages.value.size);
    }, 800);

  });

    // 删除课程信息
  const del = async (id: number) => {
    D.warning("确定要删除吗？").enter(async()=>{
      try{
        await http.delete('/admin/courseData/delete/'+id);
        D.success("删除成功");
        // 删除成功，从 studentsList 中删除该学生
        courseList.value = courseList.value.filter(item => item.courseId !== id);
        pages.value.total--;
      }catch(err){
        D.error(""+err);
      }
    });

  }

  // 打开添加课程信息弹窗
  const openAddCourse = () => {
    addVisible.value = true;
    // this.$router.push('/admin/courseData/add');
  }
  // 关闭添加课程信息弹窗
  const closeAdd = () => {
    addVisible.value = false;
  }
 //添加课程
 const addCourse = async (newCourse: Course)=>{
  try{
      await http.post('/admin/courseData/add', newCourse);
      D.success("添加成功");
      // 添加成功，将新课程信息添加到 courseList 中
      courseList.value.push(newCourse);
      pages.value.total++;
    }catch(err){
      D.error(""+err);
    }
  console.log(newCourse);
 }

 //打开查看课程信息
  const lookInfo = (nowCourse: Course) => {
    visible.value = true;
    course.value = nowCourse;
  }
  // 关闭查看课程信息弹窗
  const close = () => {
    visible.value = false;
  }

  //打开编辑课程信息
  const editInfo = (nowData: Course) => {
    editVisible.value = true;
    course.value = nowData;
  }
  // 关闭编辑课程信息弹窗
  const closeEdit = () => {
    editVisible.value = false;
  }

  // 保存课程信息
  const saveCourse = async (newCourse: Course) => {
    try{
      await http.put('/admin/courseData/update', newCourse);
      D.success("修改成功");
      // 修改成功，将修改后的课程信息更新到 courseList 中
      const index = courseList.value.findIndex(item => item.courseId === newCourse.courseId);
      courseList.value[index] = newCourse;
    }catch(err){
      D.error(""+err);
    }
    editVisible.value = false;
  }




  onMounted(async() => {
    // http.get('/admin/couresData/get').then(res => {
    //    console.log(res);
    // });
    pageGet(pages.value.current,pages.value.size);//加载数据
  })


    const pageGet = async (current: number ,size: number) => {
    let res:PageRequest<Course>;
    if (search.value !== '') {
       res = await http.get(`/admin/courseData/search/${search.value}/${current}/${size}`) as PageRequest<Course>;
    }else{
       res = await http.get(`/admin/courseData/page/${current}/${size}`) as PageRequest<Course>;
    }
  //  console.log(res);
    courseList.value = res.records;
    pages.value.current = res.current;
    pages.value.size = res.size;
    pages.value.pages = res.pages;
    pages.value.total = res.total;
  }

  const prevPage = async () => {
    if (pages.value.current > 1) {
      pageGet(pages.value.current - 1,pages.value.size);
    }
  }

  const nextPage = async () => {
    if (pages.value.current < pages.value.pages) {
      pageGet(pages.value.current + 1,pages.value.size);
    }
  }

 //编写代码
</script>

<style scoped>
/* Add your styles here */
@import "@componentsLess/list.less";

/* Add your styles here */
.list-content{
  height:calc(100vh - 245px);
  overflow-y:auto;
}
</style>
