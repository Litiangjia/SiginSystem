<template>
  <!-- 课程表绑定班级与解绑班级弹窗 -->
  <div v-if="visible" class="wndows1">
    <div class="wndows1-content">
      <button class="btn4 float-right" @click="closeModal">关闭</button>
      <h3>课程绑定班级 - 当前课程表名:<span style="color: green;font-weight: bold">{{ Data.courseTableName }}</span>
        <button class="btn5">查看课程表信息</button>
      </h3>
      <p>请选择需要绑定的班级，点击“绑定”按钮即可完成绑定。只能绑定一个班级。
        如果已绑定班级，请先解绑该班级。才可以进行新的绑定。
        绑定成功后，该班级拥有该课程的课程信息。每个班级都有一个课程表。
        如有没有绑定的班级，请完成绑定
      </p>
      <div class="bindList">
        <!-- 左侧：未绑定班级列表 -->
        <div class="bindList-left">
          <h4>可绑定班级</h4>
          <div class="list-content">
            <div
              v-for="item in unboundClasses"
              :key="item.classId"
              class="class-item"
              :class="{'select-active':item.classId===selectedClass?.classId}"
              @click="selectClass(item)"
            >
              <span>{{ item.className }} ({{ item.classNumber }}班{{  item.grade }}年级)</span>
              <button class="btn-small" @click.stop="bindClass(item)">绑定 ></button>
            </div>
          </div>
        </div>

        <!-- 中间：操作按钮区 -->
        <div class="bindList-center">
          <button class="btn-small" @click="bindSelected" :disabled="!selectedClass">绑定 ></button>
          <button class="btn-small" @click="unbindSelected" :disabled="!selectedBoundClass">解绑{{ '<' }}</button>
        </div>

        <!-- 右侧：已绑定班级列表 -->
        <div class="bindList-right">
          <h4>已绑定班级</h4>
          <div class="list-content">
            <div
              v-for="item in boundClasses"
              :key="item.classId"
              class="class-item"
              @click="selectBoundClass(item)"
            >
              <span>{{ item.className }} ({{ item.classNumber }}班)</span>
              <button class="btn-small" @click.stop="unbindClass(item)">解绑 <</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="pages.current === 1">上一页</button>
        <span>{{ pages.current }} / {{ pages.pages }}</span>
        <button @click="nextPage" :disabled="pages.current === pages.pages">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { http } from '@/ajax/send';
import { ref,onMounted } from 'vue'
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


const pages = ref({
  current: 1, // 当前页码
  size: 7, // 每页显示的记录数
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
const emit = defineEmits(['update:Visible', 'close']);

const closeModal = () => {
  emit('update:Visible', false)
  emit('close');
}

// 添加响应式数据
const unboundClasses = ref<Classes[]>([]); // 未绑定班级列表
const boundClasses = ref<Classes[]>([]);   // 已绑定班级列表
const selectedClass = ref<Classes | null>(null); // 选中的未绑定班级
const selectedBoundClass = ref<Classes | null>(null); // 选中的已绑定班级

// 选择班级
const selectClass = (item: Classes) => {
  selectedClass.value = item;
  selectedBoundClass.value = null;
};

// 选择已绑定班级
const selectBoundClass = (item: Classes) => {
  selectedBoundClass.value = item;
  selectedClass.value = null;
  alert('sdfsdf')
};
// 绑定班级
const bindClass = async (item: Classes) => {
  console.log(props.Data);
};

// 解绑班级
const unbindClass = async (item: Classes) => {
  // 发送解绑请求
  const res = await http.delete(`/admin/course/unbind/${props.Data.courseId}/${item.classId}`);
  if (res.success) {
    // 更新列表
    unboundClasses.value.push(item);
    boundClasses.value = boundClasses.value.filter(cls => cls.classId !== item.classId);
    selectedBoundClass.value = null;
  }
};

// 绑定选中项
const bindSelected = () => {
  if (selectedClass.value) {
    bindClass(selectedClass.value);
  }
};

// 解绑选中项
const unbindSelected = () => {
  if (selectedBoundClass.value) {
    unbindClass(selectedBoundClass.value);
  }
};

onMounted(() => {
  // 获取更新未绑定班级列表
  getUnbindClasses(pages.value.current);
})

const getUnbindClasses = async (current:number) => {
  const res = await http.get('/admin/classesData/getUnbindClasses/'+current+'/'+pages.value.size) as PageRequest<Classes>;
  unboundClasses.value = res.records;
  pages.value.current = res.current;
  pages.value.size = res.size;
  pages.value.total = res.total;
  pages.value.pages = res.pages;
  // console.log(unboundClasses.value)
}

const prevPage = async () => {
  if (pages.value.current > 1) {
    getUnbindClasses(pages.value.current - 1);
  }

}

const nextPage = async () => {
  if (pages.value.current < pages.value.pages) {
    getUnbindClasses(pages.value.current + 1);
  }
}
</script>

<style scoped lang="less">
@import "@/assets/commonLess/componentsLess/window.less";
@import "@/assets/commonLess/componentsLess/btn.less";

.select-active {
  background-color: #2bff0073;
}

.list-content{
  height: calc(100vh - 310px);
}
.bindList {
  display: flex;
  height: 400px;
  margin: 20px 0;

  &-left, &-right {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;

    h4 {
      margin-top: 0;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
  }

  &-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 15px;

    button {
      margin: 5px 0;
    }
  }
}

.list-content {
  height: calc(100% - 30px);
  overflow-y: auto;
}

.class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background-color:#2bff0073;
  }
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;

  button {
    margin: 0 5px;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
