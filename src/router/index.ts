import { createRouter, createWebHistory } from 'vue-router'
import routerPages from './routerPages'
import { auth } from './auth'
import {menu} from "@/assets/store/menu";


const router = createRouter({
  history:createWebHistory("/dist2/"),  //基本路径。部署的时候根据需要是否改为跟路径/
 // history: createWebHistory(import.meta.env.BASE_URL),
  routes:routerPages
})
//路由守卫
router.beforeEach((to, from, next) => {
  menu().adminMenuList.forEach((item)=>{
    if(item.root){
      item.children?.forEach((childItem)=>{
        if(childItem.url === to.path){
         // auth(to,next)
         window.document.title = childItem.name;
        }
      })
    }else if(item.url === to.path){
      window.document.title = item.name;
    }
  })

  menu().menuList.forEach((item)=>{
    if(item.url === to.path){
      window.document.title = item.name;
      item.navActive = true;
    }else{
      item.navActive = false;
    }
  })





  auth(to,next);  //登录验证 放在最后

  next();

})

export default router
