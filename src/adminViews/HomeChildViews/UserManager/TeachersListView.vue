<template>
  <LookView :dataType="'teachers'" v-if="visible" :visible="visible" :Data="teacher" @close="close"></LookView>
  <EditView :dataType="'teachers'" v-if="editVisible" :visible="editVisible" :Data="teacher" @save="saveTeacher" @close="closeEdit"></EditView>
  <AddView  :dataType="'teachers'" v-if="addVisible" :visible="addVisible" @add="addTeacher" @close="closeAdd"></AddView>
  <div class="admin-list-container">
    <!-- 标题区域 -->
    <div class="list-header">
      <h2>教师管理</h2>
      <div class="header-actions">
        <input type="text" class="search-input" v-model="search" placeholder="搜索...">
        <button class="add-btn" @click="addTeacherInfo">+ 新增</button>
      </div>
    </div>

    <!-- 列表内容 -->
    <div class="list-content">
      <table class="data-list">
        <thead>
          <tr>
            <th>ID</th>
            <th>教师名</th>
            <!-- <th>状态</th> -->
            <!-- <th>手机号</th> -->
            <!-- <th>学号</th> -->
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="teachersList.length > 0">
            <tr v-for="(item,index) in teachersList" :key="index">
              <td><span class="item-id">{{item.teacherId}}</span></td>
              <td>{{item.name}}</td>
              <!-- <td>
                <span v-if="item.active==1" class="item-status status-active">激活</span>
                <span v-else-if="item.active==0" class="item-status status-active">未激活</span>
              </td> -->
              <!-- <td>
                <span class="item-phone">{{item.phoneNumber}}</span>
              </td>
              <td>
                <span class="item-id">{{item.studentNumber}}</span>
              </td> -->
              <td>
                <div class="action-buttons">
                  <button class="btn btn-view" @click="lookInfo(item)">查看</button>
                  <button class="btn btn-edit" @click="editInfo(item)">编辑</button>
                  <button class="btn btn-delete" @click="del(item.teacherId)">删除</button>
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
</template>

<script setup  lang="ts">
  import { ref,onMounted, watch } from 'vue'
  import http from "@/ajax/send";
  import LookView from '@/components/LookView.vue';
  import EditView from '@/components/EditView.vue';
  import AddView from '@/components/AddView.vue';
  import D from "@/assets/ts/newMessageDialog"
  import type{ PageRequest,Teacher} from "@/assets/ts/interfaceManager";
  const visible = ref(false); // 是否显示查看框
  const editVisible = ref(false); // 是否显示编辑框
  const addVisible = ref(false); //显示添加框
  const nomalCurrent = ref(1); // 默认分页



  const search = ref(''); // 搜索关键字
  const timer = ref(0);

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


  const teachersList = ref([] as Teacher[]);
  const teacher = ref({} as Teacher); // 选中的学生信息
  // const total = ref(0); // 总记录数
  const pages = ref({
    current: 1, // 当前页码
    size: 50, // 每页显示的记录数
    total: 0, // 全部数 默认为0 等待获取数据
    pages: 0 // 总页数
  });

  // 关闭查看框
  const close = () => {
    visible.value = false;
  }

  // 关闭编辑框
  const closeEdit = () => {
    editVisible.value = false;
  }

 //关闭添加框
  const closeAdd = () => {
    addVisible.value = false;
  }

  // 打开查看框信息
  const lookInfo = (item: Teacher) => {
    visible.value = true;
    teacher.value = item;
  }
  // 打开编辑学生信息
  const editInfo = (item: Teacher) => {
    editVisible.value = true;
    teacher.value = item;
  }

  //打开添加学生信息
  const addTeacherInfo = () => {
    addVisible.value = true;
  }


  //保存编辑信息
  const saveTeacher = async (newStudent: Teacher)=>{
    try{
      await http.put('/admin/teachersList/update', newStudent);
      console.log(newStudent);
      D.success("保存成功");
        // 更新 teacher.value
      teacher.value = newStudent;

      // 同时更新 teachersList 中的数据
      const index = teachersList.value.findIndex(item => item.teacherId === newStudent.teacherId);
      if (index !== -1) {
        teachersList.value[index] = {...newStudent};
      }
      }catch(err){
        D.error(""+err);
      }

  //  alert('保存成功');
  }

  //保存新增学生信息
  const addTeacher = async (newTeacher: Teacher)=>{
    try{
      await http.post('/admin/teachersList/add', newTeacher);
      D.success("添加成功");
      // 添加成功，将新学生信息添加到 teachersList 中
      teachersList.value.push(newTeacher);
      pages.value.total++;
    }catch(err){
      D.error(""+err);
    }
    console.log(newTeacher);
  }


  // 删除学生信息
  const del = async (id: number) => {
    D.warning("确定要删除吗？").enter(async()=>{
      try{
        await http.delete('/admin/teachersList/delete/'+id);
        D.success("删除成功");
        // 删除成功，从 teachersList 中删除该学生
        teachersList.value = teachersList.value.filter(item => item.teacherId !== id);
        pages.value.total--;
      }catch(err){
        D.error(""+err);
      }
    });

  }



  onMounted(async() => {
    pageGet(pages.value.current,pages.value.size);//加载数据
  })


  const pageGet = async (current: number ,size: number) => {
    let res: PageRequest<Teacher>;
    if (search.value !== '') {
       res = await http.get(`/admin/teachersList/search/${search.value}/${current}/${size}`) as PageRequest<Teacher>;
    }else{
       res = await http.get(`/admin/teachersList/page/${current}/${size}`) as PageRequest<Teacher>;
    }

    teachersList.value = res.records;
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

<style scoped lang="less">
@import "@componentsLess/list.less";

/* Add your styles here */
.list-content{
  height:calc(100vh - 245px);
  overflow-y:auto;
}
</style>
