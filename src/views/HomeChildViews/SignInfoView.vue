<template>
  <div id="signInfoView">
    <!-- 签到统计 -->
    <div class="sign-total-table-container">
      <div class="sign-total-table loaded">
        <!-- 表头 -->
        <div class="sign-table-header">
          <div class="sign-row-header"></div>
          <div class="sign-header-cell">2025-10-11</div>
          <!-- 更多日期... -->
        </div>

        <!-- 表体 -->
        <div class="sign-table-body">
          <div class="sign-table-row">
            <div class="sign-row-header">节数</div>
              <div class="sign-data-cell">
                <div class="sign-data-cell sign-status-indicator sign-present">1</div>
                <div class="sign-data-cell sign-status-indicator sign-present">2</div>
                <div class="sign-data-cell sign-status-indicator sign-present">3</div>
                <div class="sign-data-cell sign-status-indicator sign-present">4</div>
                <div class="sign-data-cell sign-status-indicator sign-present">5</div>
                <div class="sign-data-cell sign-status-indicator sign-present">6</div>
                <div class="sign-data-cell sign-status-indicator sign-present">7</div>
                <div class="sign-data-cell sign-status-indicator sign-present">8</div>
                <!-- <div class="sign-status-indicator sign-present">✓</div> -->
              </div>
          </div>
          <!-- 更多学生行... -->
        </div>

          <!-- 表体 -->
        <div class="sign-table-body">
          <div class="sign-table-row">
            <div class="sign-row-header">张三</div>
              <div class="sign-data-cell">
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-late">?</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-absent">x</div>
              </div>
          </div>
          <!-- 更多学生行... -->
        </div>
        <!--
        表头 -->
         <div class="sign-table-header">
          <div class="sign-row-header"></div>
          <div class="sign-header-cell">2025-10-12</div>
          <!-- 更多日期... -->
        </div>

        <!-- 表体 -->
        <div class="sign-table-body">
          <div class="sign-table-row">
            <div class="sign-row-header">节数</div>
              <div class="sign-data-cell">
                <div class="sign-data-cell sign-status-indicator sign-present">1</div>
                <div class="sign-data-cell sign-status-indicator sign-present">2</div>
                <div class="sign-data-cell sign-status-indicator sign-present">3</div>
                <div class="sign-data-cell sign-status-indicator sign-present">4</div>
                <div class="sign-data-cell sign-status-indicator sign-present">5</div>
                <div class="sign-data-cell sign-status-indicator sign-present">6</div>
                <div class="sign-data-cell sign-status-indicator sign-present">7</div>
                <div class="sign-data-cell sign-status-indicator sign-present">8</div>
                <!-- <div class="sign-status-indicator sign-present">✓</div> -->
              </div>
          </div>
          <!-- 更多学生行... -->
        </div>

          <!-- 表体 -->
        <div class="sign-table-body">
          <div class="sign-table-row">
            <div class="sign-row-header">张三</div>
              <div class="sign-data-cell">
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-late">?</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-present">✓</div>
                <div class="sign-data-cell sign-status-indicator sign-absent">x</div>
              </div>
          </div>
          <!-- 更多学生行... -->
        </div>
      </div>

      <!-- 统计摘要 -->
      <div class="sign-statistics-summary">
        <div class="statistic-card">
          <div class="statistic-label">总出席率</div>
          <div class="statistic-value">85%</div>
          <div class="sign-progress-container">
            <div class="sign-progress-bar progress-present" style="width: 85%"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 签到折线图 -->
    <div class="sign-chart-table loaded">
      <div class="chart-title">签到统计折线图</div>
      <div class="chart-container">
        <div class="chart-axis">
        </div>
        <!-- Y轴标签 -->
        <div class="y-axis-labels">
          <div class="y-axis-label">100%</div>
          <div class="y-axis-label">75%</div>
          <div class="y-axis-label">50%</div>
          <div class="y-axis-label">25%</div>
          <div class="y-axis-label">0%</div>
        </div>
        <!-- X轴标签 -->
        <div class="x-axis-labels">
          <template v-for="(item,index) in chartData" :key="index" >
            <div class="x-axis-label">{{item.day}}</div>
          </template>
        </div>
        <!-- 折线图SVG -->
        <svg class="chart-svg">
          <!-- 10-375 -->
          <path class="chart-line chart-line-path"></path>
          <template v-for="(item,index) in chartData" :key="index" >
          <circle class="chart-point" cx="0" cy="0" r="6" @mouseover="circleHover($event,item) "/>
          </template>
        </svg>
      </div>
      <!-- 图例 -->
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color legend-present"></div>
          <div class="legend-label">出席率</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  import {ref,onMounted} from 'vue';
  //折线数据
  const chartData = ref([
    {"day":"周一","attendance":100},
    {"day":"周二","attendance":90},
    {"day":"周三","attendance":100},
    {"day":"周四","attendance":0},
    {"day":"周五","attendance":50},
  ]);

  //鼠标悬停提示
  function circleHover(event: MouseEvent,item:{day:string,attendance:number}){
    const dom = document.createElement("div");
    dom.innerHTML = `${item.day}：考勤率为${item.attendance}%`;
    dom.style.position = "absolute";
    dom.style.top = `${event.clientY+window.scrollY-50}px`;
    dom.style.left = `${event.clientX-60}px`;
    dom.style.backgroundColor = "rgba(0,0,0,0.8)";
    dom.style.color = "#fff";
    dom.style.padding = "5px";
    dom.style.borderRadius = "5px";
    dom.style.zIndex = "9999";
    document.body.appendChild(dom);
    setTimeout(() => {
      document.body.removeChild(dom);
    }, 1500);

    // console.log(event,item.day,item.attendance);
    console.log(event,item.day,item.attendance);
  }

  //获取css样式计算
  function getCss(dom: Element) {
    if (document.defaultView&&dom) {
      return document.defaultView.getComputedStyle(dom);
    }
    return null
  }

  function initChart(){
      const chartAxis = document.querySelector('.chart-axis') as Element;
      const charWidth:number|null = parseInt(getCss(chartAxis)?.width as string);
      const charStartWidth:number = 30;
      const chartToWidth:number|null = (charWidth*0.96)/(chartData.value.length-1);
      const charHeight:number|null = parseInt(getCss(chartAxis)?.height as string); //终点高反转
      const charStartHeight:number = 10;  //起点高反转
      const charPoint = document.querySelectorAll(".chart-point") as NodeListOf<Element>;
      const chartLine = document.querySelector('.chart-line')as Element;
      let d = "";
      chartData.value.forEach((item,index) => { //横向点位置
        const attendance = 100 - item.attendance;
        const charPointY = charHeight/100*attendance+charStartHeight+10;
        if(index === 0){
          charPoint[index]?.setAttribute("cx",charStartWidth.toString());
          charPoint[index]?.setAttribute("cy",charPointY.toString());
          d+=` M${charStartWidth},${charPointY} `;
        }else if(index === chartData.value.length-1){
          charPoint[index]?.setAttribute("cx",(chartToWidth*index+charStartWidth).toString());
          charPoint[index]?.setAttribute("cy",charPointY.toString());
          d+=` L${chartToWidth*index+charStartWidth},${charPointY} `;
        }else{
          charPoint[index]?.setAttribute("cx",(chartToWidth*index+charStartWidth).toString());
          charPoint[index]?.setAttribute("cy",charPointY.toString());
          d+=` L${chartToWidth*index+charStartWidth},${charPointY} `;
        }
      });
      chartLine.setAttribute("d",d);
  }
  onMounted(() => {
    initChart();
    // 图表初始化
    window.addEventListener('resize', () => {
      initChart();
    });
  });



</script>

<style scoped lang="less">
  @import '@/assets/commonLess/componentsLess/table.less';

</style>
