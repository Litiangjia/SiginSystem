<template>
  <div class="sign-views-one">
    <div id="map" style="width:100%;height:80vh"></div>

    <div class="map-controls">
      <button @click="start">开始绘制区域</button>
      <button @click="getDrawnAreaData">获取绘制区域数据</button>
      <button @click="checkPositionInArea">判定是否在区域内</button>
      <button @click="clearAll">清除绘制</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// import { Geolocation } from '@capacitor/geolocation';
import D from "@/assets/ts/newMessageDialog"
import AMapLoader from "@amap/amap-jsapi-loader";
import { ref } from 'vue';

const isPositionInArea = ref<boolean | null>(null);



let AMap;
let map;
let mouseTool;
let drawnOverlays= []; // 存储绘制的覆盖物

window._AMapSecurityConfig = {
  securityJsCode: "3424d034f5bc70377a280750db150919", // 高德地图安全密钥
};

// const getCurrentPosition = async () => {
//   try {
//     const position = await Geolocation.getCurrentPosition();
//     const { latitude, longitude } = position.coords;
//     D.success("定位成功" + "纬度：" + latitude + "经度：" + longitude);
//     return position;
//   } catch (error) {
//     D.error("定位失败!请使用移动设备，并且授予位置权限");
//     console.error('获取位置失败:', error);
//     return null;
//   }
// };

// 判定当前位置是否在绘制区域内
const checkPositionInArea = async () => {
  if (drawnOverlays.length === 0) {
    D.error("请先绘制区域");
    return;
  }

  // const position = await getCurrentPosition();
  // if (!position) {
  //   D.error("无法获取当前位置");
  //   return;
  // }

  // const { latitude, longitude } = position.coords;
  const currentPoint = new AMap.LngLat(116.084475,22.930681); // 创建点

  // 检查是否在任何一个绘制的区域内
  let isInAnyArea = false;

  for (let i = 0; i < drawnOverlays.length; i++) {
    const overlay = drawnOverlays[i];
    // 修正类名判断为 AMap.Polygon
    if (overlay.type === "AMap.Overlay") {
      // 确保 contains 方法存在
      if (overlay.contains && typeof overlay.contains === 'function') {
        if (overlay.contains(currentPoint)) {
          isInAnyArea = true;
          break;
        }
      }
    }
  }

  isPositionInArea.value = isInAnyArea;

  if (isInAnyArea) {
    D.success("当前位置在绘制区域内");
  } else {
    D.error("当前位置不在绘制区域内");
  }

  // 在地图上标记当前位置
  const marker = new AMap.Marker({
    map: map,
    position: [longitude, latitude],
    icon: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    offset: new AMap.Pixel(-13, -30),
  });

  console.log(marker);
};

// 清除所有绘制内容
const clearAll = () => {
  if (mouseTool) {
    mouseTool.close(true); // 关闭鼠标工具并清除临时覆盖物
  }

  // 清除已保存的覆盖物
  drawnOverlays.forEach(overlay => {
    overlay.setMap(null);
  });

  drawnOverlays = [];
  D.info("已清除所有绘制内容",2000);
};

// 开始绘制区域
const start = () => {
  if (!mouseTool) {
    D.error("地图工具未初始化完成");
    return;
  }

  // 清除之前绘制的内容
  clearAll();

  // 设置为多边形绘制模式
  mouseTool.polygon({
    strokeColor: "#FF33FF",
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillColor: '#1791fc',
    fillOpacity: 0.4
  });

  D.success("请点击地图绘制区域，双击结束绘制");
};

const getDrawnAreaData = () => {
  if (drawnOverlays.length === 0) {
    D.error("请先绘制区域");
    return;
  }

  console.log(drawnOverlays);

  const areaData= [];

  drawnOverlays.forEach((overlay, index) => {
    console.log(overlay.type);

    // 修正类名判断为 AMap.Polygon
    if (overlay.type === "AMap.Overlay") {
      // 获取多边形路径
      const path = overlay.getPath();
      const coordinates = path.map((point) => [point.lng, point.lat]);

      areaData.push({
        type: "Polygon",
        index: index,
        coordinates: coordinates,
        area: overlay.getArea() // 获取面积
      });
    }
  });

  if (areaData.length > 0) {
    // 显示区域数据
    console.log("绘制的区域数据:", areaData);
    D.success(`成功获取${areaData.length}个区域数据，详情请查看控制台`);

    // 这里可以将数据发送到服务器或做其他处理
    return areaData;
  } else {
    D.error("没有找到有效的区域数据");
    return null;
  }
};

onMounted(async () => {
  try {
    // 获得高德地图实例
    AMap = await AMapLoader.load({
      key: "7523bfb97b7cc5afccea7c4a5860898c", // 高德地图API key
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.MouseTool"], // 需要使用的的插件列表
    })

    map = new AMap.Map("map", {
      viewMode: "2D", //默认使用 2D 模式
      zoom: 15, //地图级别
      center: [116.084475,22.930681], //地图中心点
    })

    const marker = new AMap.Marker({
      map: map,
      position: [116.084475,22.930681],
      icon: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      offset: new AMap.Pixel(-13, -30),//设置图标偏移量
    });

    marker.setMap(map); //在地图上添加 marker

    mouseTool = new AMap.MouseTool(map);//创建鼠标工具对象

    // 监听绘制完成事件
    mouseTool.on("draw", (e) => {
      // 将绘制完成的覆盖物保存起来
      drawnOverlays.push(e.obj);
      D.success("区域绘制完成，可继续绘制或获取数据" + drawnOverlays.length);
    });

  } catch (e) {
    console.log(e);
  }
});

const meta = {
  title:'sssssd'
}

defineExpose({meta});

</script>

<style scoped>
.map-controls {
  position: absolute;
  top: 6rem;
  left: 5%;
  z-index: 100;
}

.map-controls button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.map-controls button:hover {
  background-color: #f0f0f0;
}
</style>
