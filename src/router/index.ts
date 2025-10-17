import { createRouter, createWebHistory } from 'vue-router'
import routerPages from './routerPages'
import { userToken } from '@/assets/store/userToken'
const router = createRouter({
  history:createWebHistory("/dist2/"),  //基本路径。部署的时候根据需要是否改为跟路径/
 // history: createWebHistory(import.meta.env.BASE_URL),
  routes:routerPages
})

//路由守卫
router.beforeEach((to, from, next) => {
  const token = userToken();
  const nullToken = to.meta?.nullToken;
 // if(token.token==null && nullToken == undefined) next({path:"/loging"})
//  if(token.token!=null && nullToken) next({path:"/"})

  next();
})

export default router
