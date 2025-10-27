import {type RouteRecordRaw } from 'vue-router'
//创建目录结构
interface DirectoryFace{
  key:string,
  name:string,
  arr:string[],
  index:number,
  nextIndex:number,
}
type FileModules = Record<string, () => Promise<unknown>>;
function autoRouter(fileds:FileModules,dir:string,root:string=''){
  const DirectoryArray:DirectoryFace[] = [];
  //创建头部结构
  const headerRouters:Array<RouteRecordRaw> = [];
  //初始化头部和目录结构
  for(const key in fileds){
    // console.log(key);
    const strs = key.split(dir+'/')[1]||'';
    //拿到文件名称
    const isDirectory = strs.split('/')||'';
    if(isDirectory.length>1){ //判断是否是目录并且拥有ChildViewds名称
     // console.log(isDirectory[0]?.includes('ChildViews'));
   //   console.log(isDirectory,isDirectory[0]?.replace('ChildViews','').toLocaleLowerCase()||'');
      // console.log(isDirectory);

      DirectoryArray.push({
        key:key,
        name:root+isDirectory[0]?.replace('ChildViews','').toLocaleLowerCase()||'',
        arr:isDirectory,
        index:isDirectory.length,
        nextIndex:isDirectory.length+1,
      })

     // console.log(DirectoryArray);
    //  console.log(DirectoryArray);
    }else{
      const name = isDirectory[0]?.replace('View.vue','').toLocaleLowerCase()||'';
      //设置路由头部信息
      const componentLoader = fileds[key];
      if (componentLoader) {
        headerRouters.push({
          path: name === 'home'||name==='index' ? '/'+root : root===''?'/'+name:'/' + root +'/'+ name,
          name: root+name,
          component: componentLoader, // 确保不会是 undefined
        });
      }
    }
  }

  const headerRouterAdd = (directory:DirectoryFace[],item:RouteRecordRaw,index:number=2)=>{
    //找到当前item下的所有子目录,从index2开始
    const allDir = directory.filter((dir) => dir.name === item.name); //获取所有根目录下子目录

    // console.log(item,allDir);
    const dir = allDir.filter((dir) => dir.index === index);//筛选层度为index的目录从到大
    const newDir = allDir.filter((dir) => dir.index > index);//没有被筛选的目录作为下次递归的目录
    if(dir.length>0){//能找到说明当前item有子目录
      item.children = []; // 子路由数组
      dir.forEach((dirItem) => { // 遍历子目录 ，为子目录添加路由信息
        const name = dirItem.arr[dirItem.index-1]?.replace('View.vue','').toLocaleLowerCase()||''//获取当前目录的名称
        const componentLoader = fileds[dirItem.key];
        if(item.children&&componentLoader){
          const pathName =name==='home'||name==='index' ? '' :'/'+name;
          const newName =name==='home'||name==='index' ? '/index' :'/'+name;
          const children = {
            path:item.path==='/'?pathName:item.path+pathName,
            name:item.name?.toString()+newName,
            component:componentLoader, // 确保不会是 undefined
          };

        item.children.push(children);
        //更新newDir的name
        newDir.forEach((newDirItem) => {
         //const newName = newDirItem.arr[dirItem.index-1]?.replace('ChildViews','').toLocaleLowerCase()||'';
          newDirItem.name=item.name?.toString()+newName;
        });
        headerRouterAdd(newDir,children,dirItem.nextIndex);
        }
      });
    }
  }
  //从头部开始便利添加
  headerRouters.forEach((item)=>{
    headerRouterAdd(DirectoryArray,item);
  })

  return headerRouters;
}

const adminFileds = import.meta.glob(`@/adminViews/**/*.vue`);
const adminPages = autoRouter(adminFileds,'adminViews','admin');
const fileds = import.meta.glob(`@/views/**/*.vue`);
const pages = autoRouter(fileds,"views");
const toSignViews = (path:string)=>{
  //使用模板字符串动态拼接路由地址
  return () => import(`@/views/Signviews/${path}.vue`);
}
//清晰的路由页面规则只写路由页面
let routerPages:Array<RouteRecordRaw> = [];
routerPages = [
    {
      path:"/signViews",
      name:"signViews", //签到系统主页面
      meta:{title:"签到"},
      component:toSignViews("SignViewsTwo")
    },
    {
      path:"/signViewsImg",
      name:"signViewsImg", //签到系统主页面
      meta:{title:"签到"},
      component:toSignViews("SignViewsOne")
    },
    //404跳转
    { path: '/:pathMatch(.*)*', redirect: '/404' },

    {
      path: '/404',
      name: '404',
      component: () => import('@/NotFindeView.vue')
    }
]

routerPages.push(...pages);
routerPages.push(...adminPages);




//路由规则权限
routerPages.forEach((item)=>{
  //console.log(item);
})



// console.log(routerPages)
export default routerPages;

