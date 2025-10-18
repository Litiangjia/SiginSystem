<template>
  <div id="sign-views-two">
    <div class="progress-container" v-show="progress < 100" >
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress-text">加载进度{{ Math.round(progress) }}%...</div>
    </div>
    <canvas v-show="progress === 100" class="mycanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue";
  import * as THREE from 'three';
  import {T,Dl,Pl,loaderModel} from "@/assets/threeTs/threeTs";
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { ref } from "vue";
  const progress = ref(0);
  onMounted(() => {
    // 创建场景，相机，渲染器
    const t = new T(".mycanvas");
    const { scene, camera, renderer } = t;  //引入了场景，相机，渲染器
    const loader = new THREE.LoadingManager(); //创建加载管理器
    loader.onProgress = (url, itemsLoaded, itemsTotal) => { //加载进度
      progress.value = (itemsLoaded / itemsTotal) * 100;
    };

    scene.background = 0xFF9900; //设置场景颜色

    camera.position.set(0,0.2,1);  //x,y,z
    camera.lookAt(0,0,0); //设置相机方向

    //渲染器渲染,并设置渲染大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true; //开启阴影
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //添加一个全局关照
    //const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    //开启投影
    // scene.add(ambientLight);
    //创建灯光
    const light = new THREE.AmbientLight(0x404040,10); //全局关照
    scene.add(light);

    // 灯光
    const dl = new Dl(0xFF9900,5).addHelper(5).openShadow();  //创建方向灯并添加辅助光
    // dl.shadow.camera.near = 0.1; //距离阴影最近距离
    // dl.shadow.camera.far = 50; //距离阴影最远距离
    // dl.shadow.camera.left = -80; //设置阴影范围
    // dl.shadow.camera.right = 60; //设置阴影范围
    dl.position.set(-2,0.5,1); //设置位置
    dl.lookAt(0,0,0);   //设置方

    scene.add(dl);

     //点灯光1
    const pl = new Pl(0x404040,25,4,1).openShadow();  //实现点光源并开启投影
    pl.position.set(0,0.8,-2);
    pl.castShadow =true; //点光源开启投影
    scene.add(pl);
    //点灯光2
    const pl2 = new Pl(0x404040,25,4,1).openShadow();  //实现点光源并开启投影
    pl2.position.set(0,0.8,1.6);
    pl2.castShadow =true; //点光源开启投影
    scene.add(pl2);




    //添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; //开启阻尼
   // controls.dampingFactor = 0.25; //阻尼系数

    // 加载模型
    const texture = t.createLinearTexture([[0,"RGB(0, 206, 209)"],[0.18,"RGB(0, 206, 209)"],[0.22,"white"],[1,"white"]]);
    loaderModel("/public/models/001.glb",loader).then((gltf)=>{
      gltf.scene.scale.set(0.1,0.1,0.1); //缩放模型
      //设置材质
      gltf.scene.traverse((child)=>{

        if(child.isMesh){
          child.castShadow = true; //开启阴影
           child.receiveShadow = true; //接受投影
        }

        if(child.isMesh&&child.name === "左墙体"
          ||child.isMesh&&child.name === "右墙体"
          ||child.isMesh&&child.name === "正面墙体"
          ||child.isMesh&&child.name === "后面墙体"
        ){
          child.material = new THREE.MeshStandardMaterial({map:texture}); //设置材质颜色
        }

        if(child.isMesh&&child.name === "右墙体"
          ||child.isMesh&&child.name === "房顶"
          ||child.isMesh&&child.name === "正面墙体"
          ||child.isMesh&&child.name === "后面墙体"
          ||child.isMesh&&child.name === "平面"
          ||child.isMesh&&child.name === "黑板-材质6"
          ||child.isMesh&&child.name === "黑板-材质7"
          ||child.isMesh&&child.name === "讲台工程"
          ||child.isMesh&&child.name === "教室台阶"
        ){
          child.receiveShadow = true; //接受投影
          child.castShadow = true; //开启阴影
        }







        // if(child.isMesh&&child.name === "New_Mesh_3"){
        //    //接受投影
        //    child.receiveShadow = true;
        // }

        // if(child.isMesh&&child.name === "New_Mesh"){///正面墙
        //    child.material = new THREE.MeshStandardMaterial({map:texture}); //设置材质颜色
        // }
        // if(child.isMesh&&child.name === "New_Mesh_6"){//右侧墙
        //   child.material = new THREE.MeshStandardMaterial({map:texture});
        //   //接受投影
        //   child.receiveShadow = true;
        // }
        // if(child.isMesh&&child.name === "New_Mesh_2"){ //后面墙
        //   child.material = new THREE.MeshStandardMaterial({map:texture});
        // }

        // if(child.isMesh&&child.name === "New_Mesh_13"){//左侧墙
        //   child.material = new THREE.MeshStandardMaterial({map:texture});
        //   //接受投影
        //   child.receiveShadow = true;
        //   //添加阴影
        //   child.castShadow = true;
        // }

      });
      scene.add(gltf.scene);
    });
    //加载模型桌子椅子
    const deskAndChiarArr:Array<THREE.Object3D> = [];
    loaderModel("/public/models/deskAndChiar.glb",loader).then((gltf)=>{
      //放大
      gltf.scene.scale.set(0.1,0.1,0.1);
      gltf.scene.position.set(1.58,0,-3); //初始位置

      gltf.scene.traverse((child)=>{
        if(child.isMesh) {
          child.castShadow = true; //开启阴影
          //接受投影
          child.receiveShadow =true;
          // //添加阴影
        }
      })
      //添加到场景

      const v3 = new THREE.Vector3(); //创建向量
      v3.copy(gltf.scene.position); //获取位置
      const c = 7;   //设置列数
      const r = 10;   //设置行数
      //行间距
      const rowSpace = 0.528;
      //列间距
      const columnSpace = 0.575;
      //设置位置
      for(let i=0;i<c;i++){ //列数
        for(let j=0;j<r;j++){ //行数
          const deskAndChiar = gltf.scene.clone();
          deskAndChiar.position.set(v3.x+i*-rowSpace,v3.y,v3.z+j*columnSpace);
          scene.add(deskAndChiar);
          deskAndChiarArr.push(deskAndChiar);// 存入数组

        }
      }

      // scene.add(gltf.scene);
    });

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update(); //更新轨道控制器
    }

    animate(); //开始动画
  });


</script>

<style scoped lang="less">
.progress-container {
  position: absolute;
  top: 50%;
  left:5%;
  transform: translateX(0%,-50%);
  width: 90%;
  z-index: 100;
}

.progress-bar {
  width: 100%;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
  position: relative;
  animation: shimmer 2s infinite;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: progress-glow 2s infinite;
}

.progress-text {
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
  color: #333;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

@keyframes progress-glow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

</style>
