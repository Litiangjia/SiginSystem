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



    camera.position.set(0,0,20); //设置相机位置
    camera.lookAt(0,0,0); //设置相机方向

    //渲染器渲染,并设置渲染大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true; //开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //添加一个全局关照
    //const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    //开启投影
    // scene.add(ambientLight);

    // 灯光
    const dl = new Dl(0xffffff,5,100,5).addHelper(5);  //创建方向灯并添加辅助光
    //const pl = new Pl(0xffffff,30000,100000,50).addHelper(5);  //创建点光源并添加辅助光
    //创建点光源
    const pl = new THREE.PointLight(0xffffff,30000,100000,50);

    dl.position.set(60,35,30); //设置方向灯位置
    dl.lookAt(0,0,0); //设置方向光方向
    pl.position.set(0,10,20); //
    pl.lookAt(0,0,0);
    //添加投影
    dl.castShadow = true;//开启投影
    pl.castShadow = true;//开启投影
    scene.add(pl);
    //scene.add(dl,pl);//添加
    scene.add(dl.helper,pl.helper) //添加辅助光

    //添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; //开启阻尼
   // controls.dampingFactor = 0.25; //阻尼系数

    // 加载模型
    const texture = t.createLinearTexture([[0,"orange"],[0.18,"orange"],[0.22,"white"],[1,"white"]]);
    loaderModel("/public/models/001_kebbpo.glb",loader).then((gltf)=>{
      //设置材质
      gltf.scene.traverse((child)=>{
        // if(child.isMesh){
        //   console.log(child);
        // }
        if(child.isMesh&&child.name === "New_Mesh_3"){///地面
           //接受投影
           child.receiveShadow = true;
        }

        if(child.isMesh&&child.name === "New_Mesh"){///正面墙
           child.material = new THREE.MeshStandardMaterial({map:texture}); //设置材质颜色
        }
        if(child.isMesh&&child.name === "New_Mesh_6"){//右侧墙
          child.material = new THREE.MeshStandardMaterial({map:texture});
          //接受投影
          child.receiveShadow = true;
        }
        if(child.isMesh&&child.name === "New_Mesh_2"){ //后面墙
          child.material = new THREE.MeshStandardMaterial({map:texture});
        }

        if(child.isMesh&&child.name === "New_Mesh_13"){//左侧墙
          child.material = new THREE.MeshStandardMaterial({map:texture});
          //接受投影
          child.receiveShadow = true;
          //添加阴影
          child.castShadow = true;
        }

      });
      scene.add(gltf.scene);
    });
    //加载模型桌子椅子
    const deskAndChiarArr:Array<THREE.Object3D> = [];
    loaderModel("/public/models/deskAndChiar.glb",loader).then((gltf)=>{
      //放大
      gltf.scene.scale.set(1.2,1.2,1.2);
      gltf.scene.position.set(15.5,0,-29); //初始位置

      gltf.scene.traverse((child)=>{
        if(child.isMesh) {
          //接受投影
          child.receiveShadow =true;
          //添加阴影
          child.castShadow = true;
        }
      })
      //添加到场景

      const v3 = new THREE.Vector3(); //创建向量
      v3.copy(gltf.scene.position); //获取位置
      const c = 6;   //设置列数
      const r = 10;   //设置行数
      //行间距
      const rowSpace = 6.2;
      //列间距
      const columnSpace = 5.6;
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
