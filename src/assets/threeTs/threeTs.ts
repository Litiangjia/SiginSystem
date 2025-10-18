
import { Vector3,PointLight, PointLightHelper,Scene,PerspectiveCamera,WebGLRenderer, DirectionalLight, DirectionalLightHelper, CanvasTexture, Clock, AnimationMixer, type ColorRepresentation, Mesh} from "three";

import { LoadingManager ,type AnimationClip,type AnimationAction } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//点光灯
export class Pl extends PointLight{
  helper:PointLightHelper|null = null;
  diffusion: number;
  distance: number;

    constructor(color: ColorRepresentation | undefined,intensity: number | undefined,distance: number,diffusion: number | undefined){
        super(color,intensity,distance,diffusion); //调用父构造类
        // this.color = color;
        this.intensity =intensity as number;// 强度
        this.distance = distance;// 距离
        this.diffusion = diffusion as number; // 衰减
    }
    //添加辅助光
    addHelper(intensity: number | undefined):Pl{
        this.helper = new PointLightHelper(this,intensity);
        return this;
    }
    //开启阴影还回对象
    openShadow(){
        this.castShadow = true;
        return this;
    }
    //关闭阴影还回对象
    closeShadow(){
        this.castShadow =false;
        return this;
    }
}
//方向灯
export class Dl extends DirectionalLight{
  helper: DirectionalLightHelper | null= null;
  distance: number|string;
  diffusion: number|string;
    constructor(color: ColorRepresentation | undefined,intensity: number | undefined,distance:number|string,diffusion:number|string){
        super(color,intensity); //调用父构造类
        // this.color = color;
        this.intensity =intensity as number;
        this.distance = distance;
        this.diffusion = diffusion;
    }
    //添加辅助光
    addHelper(intensity: number | undefined){
        this.helper = new DirectionalLightHelper(this,intensity); //创建辅助光
        return this;
    }
    //开启阴影还回对象
    openShadow(){
        this.castShadow = true;
        return this;
    }
    //关闭阴影还回对象
    closeShadow(){
        this.castShadow =false;
        return this;
    }
}

//创建场景、相机、渲染器 初始化操作
export class T{   //
    scene:Scene;
    camera:PerspectiveCamera;
    renderer :WebGLRenderer;
    constructor(domName:string){
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
            45,window.innerWidth/window.innerHeight,0.01,100000
         );
        this.renderer = new WebGLRenderer({
            canvas:document.querySelector(domName) as HTMLCanvasElement,
            antialias:true, //抗锯齿
        })

        console.log(this.renderer);
    }
    //createDirectionalLight 创建方向光
    // 创建文本纹理函数
    createTextTexture(text:string) {//返回纹理图
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        // 设置画布尺寸
        canvas.width = 400;
        canvas.height = 200;

        // 绘制背景
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制文字
        context.font = 'Bold 40px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

        // 创建纹理
        const texture = new CanvasTexture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    // 创建渐变纹理 垂直
    createLinearTexture(ColorStopArray:Array<Array<number|string>>){
        // 创建一个 Canvas 并在其上绘制渐变色
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        // 绘制垂直线性渐变
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);

        ColorStopArray.forEach((Colors)=>{
             gradient.addColorStop(Colors[0]as number,Colors[1]as string);   // 起点颜色
        })
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // 使用 Canvas 创建纹理
        return new CanvasTexture(canvas);

    }
}

//加载模型方法

export function loaderModel(url:string,loadingManager:LoadingManager){
    const gltgLoader = new GLTFLoader(loadingManager);
    return new Promise((resolve)=>{
        gltgLoader.load(url,(object)=>{
            resolve(object);
        })
    })
}


//元素控制
export class ModelControl{
    model:Mesh
    camera:PerspectiveCamera
    controls:OrbitControls
    isCameraToModel = false //是否开启摄像机跟随物体
    isCameraLookAtModel = false // 是否开启摄像机看向物体以物体为中心
    walkSpeed = 0.01;  //速度
    animations:Array<AnimationClip>|boolean=false;
    action:AnimationAction|boolean=false;  //切片动画
    mixer:AnimationMixer|boolean=false;
    clock = new Clock();
    constructor(model:Mesh,camera:PerspectiveCamera,controls:OrbitControls,animations:Array< AnimationClip>){  //模型和摄像机和控制器
        this.model = model;
        this.camera = camera;
        this.controls = controls;

        if(animations && animations.length>0){  //如果有动画参数
            this.animations = animations;
            this.mixer = new AnimationMixer(model);
            this.action = this.mixer.clipAction(animations[0] as AnimationClip);  //第一个动画
            controls.domElement?.addEventListener("keyup",(e)=>{
                const k = e.key.toLowerCase();
                if(k==="w"||k==="s"||k==="a"||k==="d"){
                   if(this.action && typeof this.action !== "boolean"){
                      this.action.play();
                    }
                }
            })
        }



    }

    animationUpdate(){
        if(typeof this.mixer !== "boolean"){
          this.mixer.update(this.clock.getDelta());
        }
    }

    setDirection(keys:Array<boolean>){ //设置模型跟随走动  //传递一个键盘keys数组
        const modelVector3 = new Vector3().copy(this.model.position);
        if(keys.w){this.setDirectionW(this.camera.getWorldDirection(modelVector3))}
        if(keys.s){this.setDirectionS(this.camera.getWorldDirection(modelVector3))}
        if(keys.a){this.setDirectionA(this.camera.getWorldDirection(modelVector3))}
        if(keys.d){this.setDirectionD(this.camera.getWorldDirection(modelVector3))}
        if(keys['shift']){this.walkSpeed = 0.03}
        if(!keys['shift']){this.walkSpeed = 0.01}
    }

    setLookAt(modelVector3:Vector3){
        this.model.position.add(modelVector3);
        if(this.isCameraToModel) this.camera.position.add(modelVector3); //摄像机跟随
        if(this.isCameraLookAtModel) this.controls.target.add(modelVector3);  //控制器让摄像机永远看向物体方向
    }

    setDirectionW(modelVector3:Vector3){ //设置w移动
        if(typeof this.action !== "boolean") this.action.play(); //播放切片
        this.model.lookAt(this.model.position.x+modelVector3.x,this.model.position.y,this.model.position.z+modelVector3.z);
        modelVector3.x = modelVector3.x * this.walkSpeed;
        modelVector3.y = 0;
        modelVector3.z = modelVector3.z * this.walkSpeed;
        this.setLookAt(modelVector3);
    }
    setDirectionS(modelVector3:Vector3){//设置S移动
        if(typeof this.action!== "boolean") this.action.play(); //播放切片
       this.model.lookAt(this.model.position.x-modelVector3.x,this.model.position.y,this.model.position.z-modelVector3.z);
        //modelVector3.scale = (0.01,0.01,0.01);
        modelVector3.x = -modelVector3.x * this.walkSpeed;
        modelVector3.y = 0;
        modelVector3.z = -modelVector3.z * this.walkSpeed;
        // const positionVecor3 = new THREE.Vector3(0,0,-0.006);
        this.setLookAt(modelVector3);

    }
    setDirectionA(modelVector3:Vector3){//设置A移动
        if(typeof this.action!== "boolean") this.action.play(); //播放切片
       this.model.lookAt(this.model.position.x+modelVector3.z,this.model.position.y,this.model.position.z-modelVector3.x);
         const x = modelVector3.x;  //保存副本x
        modelVector3.x = modelVector3.z * this.walkSpeed;
        modelVector3.y = 0;
        modelVector3.z = -x * this.walkSpeed;
        this.setLookAt(modelVector3);
    }

    setDirectionD(modelVector3:Vector3){//设置D移动
        if(typeof this.action!== "boolean") this.action.play(); //播放切片
        this.model.lookAt(this.model.position.x-modelVector3.z,this.model.position.y,this.model.position.z+modelVector3.x);

        const x = modelVector3.x;  //保存副本x
        modelVector3.x = -modelVector3.z * this.walkSpeed;
        modelVector3.y = 0;
        modelVector3.z = x * this.walkSpeed;
        // modelVector3.z = modelVector3.x * this.walkSpeed;
        this.setLookAt(modelVector3);
    }


}





