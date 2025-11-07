<template>
  <LookView v-if="visible" :visible="visible" dataType="classes" :Data="classes" @close="close"></LookView>

  <EditView v-if="editVisible" :dataType="'classes'" :visible="editVisible" :Data="classes" @save="saveClasses" @close="closeEdit"></EditView>

  <AddView v-if="addVisible" :dataType="'classes'" :visible="addVisible" @add="addClasses" @close="closeAdd"></AddView>

  <WindowsView v-if="windowsVisible" :dataType="'classes'"
  :Data="classes" :title="windowTitle"
  :visible="windowsVisible" @close="closeWindows"
  @look = "lookInfo"
  @edit = "editInfo"
  @del = "del"
  @newAdd="openAddClasses"
  >
  </WindowsView>
  <div id="ClassData">
    <div class="admin-list-container">
      <!-- 标题区域 -->
      <div class="list-header">
        <h2>班级管理</h2>
        <div class="header-actions">
          <input type="text" class="search-input" v-model="search" placeholder="搜索...">
           <div class="group-checkbox-container">
            <span class="group-label">细分:</span>
            <label class="checkbox-item">
              <input
                type="checkbox"
                value="class_name"
                v-model="selectedGroups"
                @change="handleGroupChange"
              >
              名称
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                value="class_number"
                v-model="selectedGroups"
                @change="handleGroupChange"
              >
              班级
            </label>
          </div>
          <button class="add-btn" @click="openAddClasses">+ 新增</button>
        </div>
      </div>

      <!-- 列表内容 -->
      <div class="list-content">
        <table class="data-list">
          <thead>
            <tr  v-if = "selectedGroups.length === 0">
              <th>班级ID</th>
              <th>班级名称</th>
              <th>班级</th>
              <th>年级</th>
              <th>操作</th>
            </tr>
            <tr v-else>
              <th v-if="classList[0]?.className!=null">班级名称</th>
              <th v-if="classList[0]?.classNumber!=null">班级</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody  v-if = "selectedGroups.length === 0">
            <template v-if=" classList.length > 0">
              <tr v-for="(item,index) in  classList" :key="index">
                <td><span class="item-id">{{item.classId}}</span></td>
                <td>{{item.className}}</td>
                <td>{{item.classNumber===0?'未分班':'('+item.classNumber+')班'}}</td>
                <td>{{item.grade===0?'未分年级':item.grade+'年级'}}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-view" @click="lookInfo(item)">查看</button>
                    <button class="btn btn-edit" @click="editInfo(item)">编辑</button>
                    <button class="btn btn-delete" @click="del(item.classId as number)">删除</button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <template v-if=" classList.length > 0">
              <tr @click="openWindows(item)" class="expand-table-row" v-for="(item,index) in  classList" :key="index">
                <td v-if="item.className!=null">{{item.className}}</td>
                <td v-if="item.classNumber!=null">{{item.classNumber===0?'未分班':'('+item.classNumber+')班'}}</td>
                <td>
                  <button class="expand-btn">
                    {{ expandedRow === index ? '收起' : '展开' }}
                  </button>
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
  import WindowsView from '@/components/WindowsView.vue';
  import D from "@/assets/ts/newMessageDialog"
  import type {Classes,PageRequest} from "@/assets/ts/interfaceManager";  //使用接口规范
  const expandedRow = ref<number | null>(null); // 添加展开行状态


  const addVisible = ref(false); // 添加弹窗
  const visible = ref(false); // 查看弹窗
  const editVisible = ref(false); // 编辑弹窗
    // 打开窗口
  const windowsVisible = ref(false);
  const windowTitle = ref(''); // 窗口标题



  const classes = ref<Classes>({
    className: '',
    classNumber:0,
    grade:0
  }); // 班级单个信息

  const classList = ref<Classes[]>([]); // 班级列表
  const search = ref(''); // 搜索关键字
  const timer = ref(0);
  const nomalCurrent = ref(1); // 默认分页
  const selectedGroups = ref<string[]>([]);// 分组
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

const handleGroupChange = () => {
  pageGet(1,pages.value.size);
  // 分组逻辑已在 computed 属性中处理
}

    // 删除班级信息
  const del = async (id: number) => {
    D.warning("确定要删除吗？").enter(async()=>{
      try{
        await http.delete('/admin/classesData/delete/'+id);
        D.success("删除成功");
        // 删除成功，从 列表 中删除该数据
        classList.value = classList.value.filter(item => item.classId !== id);
        pages.value.total--;
      }catch(err){
        D.error(""+err);
      }
    });

  }

  // 打开添加班级信息弹窗
  const openAddClasses = () => {
    addVisible.value = true;
  }
  // 关闭添加班级信息弹窗
  const closeAdd = () => {
    addVisible.value = false;
  }
 //添加班级
 const addClasses = async (newClasses: Classes)=>{
  try{
      await http.post('/admin/classesData/add', newClasses);
      D.success("添加成功");
      // 添加成功，将新班级信息添加到 classList 中
      classList.value.push(newClasses);
      pages.value.total++;
    }catch(err){
      D.error(""+err);
    }
 }

 //打开查看班级信息
  const lookInfo = (nowClasses: Classes) => {
    console.log(nowClasses);
    visible.value = true;
    classes.value = nowClasses;
  }
  // 关闭查看班级信息弹窗
  const close = () => {
    visible.value = false;
  }

  //打开编辑班级信息
  const editInfo = (nowData: Classes) => {
    editVisible.value = true;
    classes.value = nowData;
  }
  //关闭编辑班级信息弹窗
  const closeEdit = () => {
    editVisible.value = false;
  }
  //保存编辑班级信息
  const saveClasses = async (newData: Classes) => {
    try{
      await http.put('/admin/classesData/update', newData);
      D.success("修改成功");
      // 修改成功，将修改后的班级信息更新到 classList 中
      const index = classList.value.findIndex(item => item.classId === newData.classId);
      classList.value[index] = newData;
    }catch(err){
      D.error(""+err);
    }
  }


  const openWindows = (item:Classes) => {
    classes.value = item;
    windowsVisible.value = true;
  }
  // 关闭窗口
  const closeWindows = () => {
    windowsVisible.value = false;
  }



  onMounted(async() => {
    // http.get('/admin/couresData/get').then(res => {
    //    console.log(res);
    // });
    pageGet(pages.value.current,pages.value.size);//加载数据
  })


    const pageGet = async (current: number ,size: number) => {
    let res:PageRequest<Classes>;
    if (search.value !== '') {
       res = await http.get(`/admin/classesData/search/${search.value}/${current}/${size}`) as PageRequest<Classes>;
    }else{
      if(selectedGroups.value.length > 0){
        res = await http.get(`/admin/classesData/page/${current}/${size}/${selectedGroups.value.join('|')}`) as PageRequest<Classes>;
      }else{
         res = await http.get(`/admin/classesData/page/${current}/${size}`) as PageRequest<Classes>;
      }
    }

    classList.value = res.records;
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

.expand-table {
  width: 100%;
  height: 100%;
  background-color:red;
  left: 0;
  right: 0;
}
</style>
