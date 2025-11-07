<template>
  <LookView v-if="visible" :visible="visible" dataType="courseTableNames" :Data="courseTableNames" @close="close"></LookView>
  <AddView v-if="addVisible" :dataType="'courseTableNames'" :visible="addVisible" @add="addCourseTableName" @close="closeAdd"></AddView>

  <EditCourseTable v-if="editCourseTableVisible"
  :Data="courseTableNames"
  :visible="editCourseTableVisible" @close="closeEditCourseTable"
  @look = "lookInfo"
  @edit = "editInfo"
  @del = "del"
  >
  </EditCourseTable>

  <CourseBindClass v-if="courseBindClassVisible"
  :visible="courseBindClassVisible"
  :Data="courseTableNames"
  @close="closeCourseBindClass"
  @del="del"
  @edit="editInfo"
  @look="lookInfo"
  >
  </CourseBindClass>

  <div id="coursesTableData">
     <div class="admin-list-container">
      <!-- 标题区域 -->
      <div class="list-header">
        <h2>课程表管理</h2>
        <div class="header-actions">
          <input type="text" class="search-input" v-model="search" placeholder="搜索...">
          <button class="add-btn" @click="openAddCourseTableName">+ 新增课程表</button>
        </div>
      </div>

      <!-- 列表内容 -->
      <div class="list-content">
        <table class="data-list">
          <thead>
            <tr>

              <th>
                <h1 class="float-left">课程表名称</h1>
                <h1>操作</h1>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if=" courseTableNamesList.length > 0">

              <tr v-for="(item,index) in  courseTableNamesList" :key="index">
                <td>
                  <h1 class="float-left">名称:{{item.courseTableName}}</h1>
                  <p>班级:{{item.classFkId?"已经关联":"未关联"}}</p>
                  <button class="btn3 col-4" @click="openCourseBindClass(item)">指定关联</button>
                  <div class="action-buttons">
                    <button class="btn btn-view" @click="lookInfo(item)">查看</button>
                    <button class="btn btn-edit" @click="editInfo(item)">编辑</button>
                    <button class="btn btn-delete" @click="del(item.id as number)">删除</button>
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
  import AddView from '@/components/AddView.vue';
  import D from "@/assets/ts/newMessageDialog"
  import type { CourseTableNames ,PageRequest} from "@/assets/ts/interfaceManager";
  import EditCourseTable from '@/components/EditCourseTable.vue';
  import CourseBindClass from '@/components/CourseBindClass.vue';
  const addVisible = ref(false); // 添加弹窗
  const visible = ref(false); // 查看弹窗
  const editCourseTableVisible = ref(false); // 编辑课程表弹窗

  const courseTableNames = ref<CourseTableNames>({
    courseTableName: '',
    classFkId: 0,
    id: 0
  }); // 课程表时间段信息

  const courseTableNamesList = ref<CourseTableNames[]>([]); // 课程表列表
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



    // 删除课程表信息
  const del = async (id: number) => {
    console.log(id);
    D.warning("会清除该表的所有课程数据!确定要操作吗?").enter(async()=>{
      try{
        await http.delete('/admin/courseTableData/deleteTable/'+id);
      D.success("删除成功");
        // 删除成功，从 studentsList 中删除该学生
        courseTableNamesList.value = courseTableNamesList.value.filter(item => item.id !== id);
        pages.value.total--;
      }catch(err){
        D.error(""+err);
      }
    });

  }

  // 打开添加课程表信息弹窗
  const openAddCourseTableName = () => {
    addVisible.value = true;
    // this.$router.push('/admin/courseTableData;
  }
  // 关闭添加课程表信息弹窗
  const closeAdd = () => {
    addVisible.value = false;
  }
 //添加课程表
 const addCourseTableName = async (newCourseTableNames: CourseTableNames)=>{
  try{
      await http.post('/admin/courseTableData/add', newCourseTableNames);
      D.success("添加成功");
      // 刷新数据
      pageGet(pages.value.current,pages.value.size);

      // courseTableNamesList.value.push(newCourseTableNames);
      pages.value.total++;
    }catch(err){
      D.error(""+err);
    }
  // console.log(newCourseTableNames);
 }

 //打开查看课程表信息
  const lookInfo = (nowCourseTableNames: CourseTableNames) => {
    visible.value = true;
    courseTableNames.value = nowCourseTableNames;
  }
  // 关闭查看课程表信息弹窗
  const close = () => {
    visible.value = false;
  }

  //打开编辑课程表信息
  const editInfo = (nowData: CourseTableNames) => {
    editCourseTableVisible.value = true;
    courseTableNames.value = nowData;
  }
   //关闭编辑课程表信息弹窗
  const closeEditCourseTable = () => {
    editCourseTableVisible.value = false;
  };


  onMounted(async() => {
    // http.get('/admin/courseTableData.then(res => {
    //    console.log(res);
    // });
    pageGet(pages.value.current,pages.value.size);//加载数据
  })


    const pageGet = async (current: number ,size: number) => {
    let res: PageRequest<CourseTableNames>;
    if (search.value !== '') {
       res = await http.get(`/admin/courseTableData/search/${search.value}/${current}/${size}`) as PageRequest<CourseTableNames>;
    }else{
       res = await http.get(`/admin/courseTableData/page/${current}/${size}`) as PageRequest<CourseTableNames>;
    }
  //  console.log(res);
    courseTableNamesList.value = res.records;
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


  //绑定班级和课程表弹窗
  const courseBindClassVisible = ref(false); // 绑定班级弹窗

  const openCourseBindClass = (nowData: CourseTableNames) => {
    courseBindClassVisible.value = true;
    courseTableNames.value = nowData;
  }

  //关闭绑定班级弹窗
  const closeCourseBindClass = () => {
    courseBindClassVisible.value = false;
  };

 //编写代码
</script>

<style scoped>
/* Add your styles here */
@import "@componentsLess/list.less";
@import "@componentsLess/btn.less";

/* Add your styles here */
.list-content{
  height:calc(100vh - 245px);
  overflow-y:auto;
}
</style>
