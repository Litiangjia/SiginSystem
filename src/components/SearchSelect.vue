<template>
  <div class="search-select">
    <div class="search-box" @click.stop="openAndShow">
      {{ selectName }}
      <div class="search-icon" :class="{'search-icon-active':isActive}"></div>
    </div>

    <div v-if="active" class="search-content" @click.stop>
      <input class="search-input" type="text"  placeholder="请输入搜索内容" v-model="searchText" />
      <ul @scrollend="isScrollend" v-if="dataType==='course'">
        <li v-for="(item ,index) in (dataList as Course[])" :key="index" @click="selectData(item.courseName, item.courseId as number)">
          {{ item.courseName }}
        </li>
      </ul>
      <ul @scrollend="isScrollend" v-else-if="dataType==='teachers'">
        <li v-for="(item ,index) in (dataList as Teacher[])" :key="index" @click="selectData(item.name, item.teacherId)">
          {{ item.name }}
        </li>
      </ul>
      <ul @scrollend="isScrollend" v-else-if="dataType==='courseSchedule'">
        <li v-for="(item ,index) in (dataList as CourseSchedule[])" :key="index" @click="selectData(item.numberOfLessons, item.scheduleId as number)">
          {{"第" + item.numberOfLessons+"节" }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup  lang="ts">
import { http } from '@/ajax/send';
import { ref, onMounted,watch } from 'vue';
import type { Course,CourseSchedule,Teacher,PageRequest} from "@/assets/ts/interfaceManager";
  //事件接收器 接收父组件的事件
  const emit = defineEmits(['updateId']);

  const searchText = ref('');
  const active = ref(false);
  const isActive = ref(false);

  const timer = ref(0); //搜索内容改变时候的定时器
  const selectName = ref<string|number>(''); //选中的名称
  const selectId = ref(0); //选中的id
  //分页数据 不用分页用于累加数据 配合滚动懒加载
  const pages = ref({
    current: 1, // 当前页码
    size: 5, // 每页显示的记录数
    total: 0, // 全部数 默认为0 等待获取数据
    pages: 0 // 总页数
  });
  const props = defineProps({
    Data: {
      type: Array,
      default: () => []
    },
    dataUrl:{
      type: String,
      default: '/admin/courseData'
    },
    nowValue:{
      type: Number,
      default: 0
    },
    dataType:{
      type: String,
      default: 'course'
    }
  });
  const dataList = ref<unknown[]>([]);
  function openAndShow(event: MouseEvent){
    event.stopPropagation(); //阻止事件冒泡
    active.value = !active.value;
    isActive.value = !isActive.value;
    if(active.value){
      window.addEventListener('click',closeAndHide); //监听点击事件
    }
  }
  function closeAndHide(){
    active.value = false;
    isActive.value = false;
    window.removeEventListener('click',closeAndHide); //移除监听
  }

  function selectData(name:string|number,id:number){
    selectName.value = name;
    selectId.value = id;
    emit('updateId',selectId.value);
    closeAndHide();
  }


  //搜索内容发生改变时候
  watch(searchText,()=>{
     if (timer.value!=0) {
      clearTimeout(timer.value);
    }
    timer.value = setTimeout(async () => {
      dataList.value = [];
      pages.value.current = 1;
      getUrl();
    }, 800);
    // active.value = false;
    // isActive.value = false;

  });


  //滚动到底部触发
  const isScrollend = () => {
    pages.value.current += 1;
    getUrl();
    //触发底部继续加载数据累加到这里
  };

  onMounted(() => {
    getNowName();
    getUrl();
  });

  watch(() => props.nowValue, () => {
    getNowName();
  });

  //获取数据
  const getUrl = async()=>{
    try {
      let res;
      if(searchText.value){
        res = await http.get(`${props.dataUrl}/search/${searchText.value}/${pages.value.current}/${pages.value.size}`) as PageRequest<unknown>;
      }else{
        res = await http.get(`${props.dataUrl}/page/${pages.value.current}/${pages.value.size}`) as PageRequest<unknown>;
      }
      // courseList.value (res.records);
      dataList.value.push(...res.records);
      pages.value.current = res.current;
      pages.value.size = res.size;
      pages.value.total = res.total;

    } catch (error) {
      console.log(error);
    }

  }

  //获取初始选中的数据名称
  const getNowName = async()=>{
    if(props.nowValue){
      // console.log("now"+props.nowValue);
      try {
        const res = await http.get(`${props.dataUrl}/getName/${props.nowValue}`);
        const name = res as string|number;
        selectName.value = res as string|number;
        return name;
      } catch (error) {
        console.log(error);
      }
    }else{
      selectName.value = '';
      return '';
    }
  }


 //编写代码
</script>

<style scoped lang="less">
.search-select {
  position: relative;
  width: 13rem;
  padding:0.5rem 0.1rem;
  .search-box{
    position: relative;
    text-align: center;
    margin:0.5rem 0;
    height: 30px;
    line-height: 30px;
    border: 1px solid #83cdff;
    border-radius: 5px;
    box-sizing: border-box;
    width: 100%;
    .search-icon{
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(0deg);
      right: 0.5rem;
      width: 20px;
      height: 20px;
      background-image: url("@/assets/icon/select.svg") ;
      // background: url("@/assets/icon/search.svg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      transition: all 0.5s ease-in-out;
      &:hover{
        cursor: pointer;
      }


    }
    .search-icon-active{
      //保持原点旋转180度
      background-image: url("@/assets/icon/selectActive.svg") ;
      transform: translateY(-50%) rotate(180deg);
    }

    &:hover{
      box-shadow: 0 0 5px #39617b;
      border: 1px solid #138fe2;

    }
  }
  .search-content{
    background-color: rgb(250, 255, 255);
    border-radius: 5px;
    z-index: 999;
    box-shadow: inset 0 0 5px #dfdfdf;
    position: absolute;
    width:13rem;
    padding:0.5rem 0.3rem;
    .search-input{
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 5px;
      box-sizing: border-box;
    }

    ul{
      list-style: none;
      padding:0;
      margin:0;
      overflow-y: auto;
      max-height:13rem;
      width: 100%;
      li{
        margin-bottom:0.5rem;
        height: 2.5rem;
        box-sizing: border-box;
        padding:0.5rem;
        border-radius: 5px;
        cursor: pointer;
        background-color: rgb(250, 239, 223);
        &:hover{
          background-color: rgb(161, 171, 208);
        }
      }
    }
  }


}
/* Add your styles here */
</style>
