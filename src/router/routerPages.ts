//动态加载views文件下的vue组件
const toViews = (path:string)=>{
  //使用模板字符串动态拼接路由地址
  return () => import(`@/views/${path}.vue`);
}
const toHomeChildViews = (path:string)=>{
  //使用模板字符串动态拼接路由地址
  return () => import(`@/views/HomeChildViews/${path}.vue`);
}

const toSignViews = (path:string)=>{
  //使用模板字符串动态拼接路由地址
  return () => import(`@/views/Signviews/${path}.vue`);
}
//动态加载childernViews文件下的vue组件
// const toChildren = function (path){
//     return () => import("@/childrenViews/"+path+".vue");
// }

//动态加载components文件下的vue组件
// const toComPonents = function (path){
//     return () => import("@/components/"+path+".vue");
// }
//清晰的路由页面规则只写路由页面
const routerPages = [
    {
      path: '/',
      name: 'home',
      component:toViews("HomeView"),
      children:[
        {
          path:"", //既是首页也是默认子路由
          name:"index",
          component:toHomeChildViews("IndexView")
        },
        {
          path:"/userInfo", //用户信息
          name:"userInfo",
          component:toHomeChildViews("UserInfoView")
        },
        {
          path:"/signInfo", //签到信息
          name:"signInfo",
          component:toHomeChildViews("SignInfoView")
        },
        {
          path:"/sign", //签到,
          name:"sign",
          component:toHomeChildViews("SignView")
        },
        {
          path:"/course", //课程,
          name:"course",
          component:toHomeChildViews("CourseView")
        }
      ]
    },

    {
      path:"/test",
      name:"test", //签到系统主页面
      meta:{title:"学生详情"},
      component:()=>import("@/test/TestView.vue")
    },


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


    {
        path:"/loging",
        naem:"loging",
        meta:{title:"登陆",nullToken:true}, //nullToken:true 表示这个页面不需要token验证
        component:toViews("LogingView")
    },
    {
        path:"/regist",
        naem:"regist",
        meta:{title:"注册",nullToken:true}, //nullToken:true 表示这个页面不需要token验证
        component:toViews("RegistView")
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default routerPages

