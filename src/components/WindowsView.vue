<template>
  <!-- <transition name="wndows1"> -->
    <div v-if="visible" class="wndows1">
      <div class="wndows1-content">
        <button class="btn4 float-right " @click="closeModal">关闭</button>
        <!-- 弹窗内容 -->
        <h1 class="text-center">{{ title }}</h1>
        <div class="text-center">

          <div class="admin-list-container">
            <!-- 标题区域 -->
            <div class="list-header">
              <div class="header-actions">
                <!-- <input type="text" class="search-input" v-model="search" placeholder="搜索..."> -->

                <button class="add-btn" @click="openAdd">+ 新增</button>
              </div>
            </div>

            <!-- 列表内容 -->
            <div class="list-content">
              <table class="data-list">
                <thead>
                  <tr>
                    <th>班级ID</th>
                    <th>班级名称</th>
                    <th>班级</th>
                    <th>年级</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if=" DataList.length > 0">
                    <tr v-for="(item,index) in  DataList" :key="index">
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
      </div>
    </div>
  <!-- </transition> -->
</template>

<script setup lang="ts">
import { http } from '@/ajax/send';
import { ref, defineProps, defineEmits,onMounted } from 'vue'
import type { Classes , PageRequest} from '@/assets/ts/interfaceManager';
// 定义组件属性
const props =defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  dataType:{
    type: String,
    default: 'classes'

  },
  Data:{
    type: Object,
    default: () => ({})
  }
})

const DataList = ref<Classes[]>([]); //默认数据源

const pages = ref({
  current: 1, // 当前页码
  size: 50, // 每页显示的记录数
  total: 0, // 全部数 默认为0 等待获取数据
  pages: 0 // 总页数
});

// const DataList = ref([]) as Object[];

// if(props.dataType === 'classes'){
//   const
//   const data = props.Data;

// }


const title = ref('');

// const Visible = ref(false)
// 定义事件发射器
const emit = defineEmits(['update:Visible', 'close','newAdd','look','edit','del']);


const openAdd = () => {
  emit('newAdd'); // 触发父事件
}
const editInfo = (item: Classes) => {
  emit('edit',item); // 触发父事件
}
const lookInfo = (item: Classes) => {
  emit('look',item); // 触发父事件
}
const del = (classId: number) => {
  emit('del',classId); // 触发父事件
}

const closeModal = () => {
  emit('update:Visible', false)
  emit('close');
}


onMounted(async() => {
  if(props.dataType === 'classes'){
    pageGet(pages.value.current,pages.value.size);
  }
})


const pageGet = async(current: number, size: number) => {
    let class_name = props.Data.className;
    class_name = class_name==null?'':class_name;
    let class_name2 = props.Data.classNumber;
    class_name2 = class_name2==null?'':'('+class_name2+')班';
    title.value = class_name+class_name2;
    const url = `/admin/classesData/page/${current}/${size}/${props.Data.className}/${props.Data.classNumber}`;
    const res = await http.get(url) as PageRequest<Classes>;
    DataList.value = res.records;
    pages.value.current = res.current;
    pages.value.size = res.size;
    pages.value.total = res.total;
    pages.value.pages = res.pages;
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
</script>

<style scoped lang="less">
@import "@/assets/commonLess/componentsLess/window.less";
@import "@/assets/commonLess/componentsLess/btn.less";
@import "@componentsLess/list.less";
.list-content{
  height: calc(100vh - 310px);
}
</style>
