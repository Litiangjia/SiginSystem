/**
 * name
 */
import {type RouteLocationNormalizedGeneric,type NavigationGuardNext} from 'vue-router';
import {adminToken} from "@/assets/store/adminToken";
import {userToken } from '@/assets/store/userToken';
import {http} from "@/ajax/send";

// class rule{
//   static match = (regex: string,to: RouteLocationNormalizedGeneric) => {
//     return to.path.match(/\/admin\/.*/);
//   }
// }


export async function auth(to: RouteLocationNormalizedGeneric,next: NavigationGuardNext){
  //编写权限验证逻辑
  //如果用户没有权限，则跳转到登录页面
  //如果用户有权限，则正常跳转
  if(to.path.includes("/admin")){
    if(to.path === "/admin/loging" || to.path === "/404") return next(); // 登录页面无需验证
    //验证用户是否登录
    //如果用户未登录，则跳转到登录页面
    //如果用户已登录，则正常跳转
    if(!adminToken().token)return next("/admin/loging");

    if(adminToken().token){
     try{
       await http.get("/admin/checkLogin");
     }catch(e){
       adminToken().clearToken();
       return next("/admin/loging");
     }
    }


    return next();
  }else{
    //前端权限验证
  //  console.log(userToken().token,"sdfdsfdsfsdf");
    if(to.path === "/loging"||to.path === "/404" || to.path === "/regist") return next();
    //验证用户是否登录
    //如果用户未登录，则跳转到登录页面
    //如果用户已登录，则正常跳转
   if(!userToken().token)return next("/loging");

  if(userToken().token){
    try{
      await http.get("/checkLogin");
    }catch(e){
      userToken().clearToken();
      return next("/loging");
    }
    // if(res===null){
    //   userToken().clearToken();
    //   return next("/loging");
    // }
  }

    return next();
  }

}
