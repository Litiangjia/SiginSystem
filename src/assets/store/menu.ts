import { defineStore } from 'pinia';
import type{ NavMenuItem, Menu } from "@/assets/ts/interfaceManager";

export const menu = defineStore('menu-store', {
  state: () => ({
    //前端菜单
    menuList:[
      {"name":"首页","url":"/","icon":"icon-home","navActive":true},
      {"name":"个人信息","url":"/userInfo","icon":"icon-userInfo","navActive":false},
      {"name":"签到信息","url":"/signInfo","icon":"icon-signInfo","navActive":false},
      {"name":"课程","url":"/course","icon":"icon-course","navActive":false},
      {"name":"签到","url":"/sign","icon":"icon-sign","navActive":false},
    ]as NavMenuItem[],

    //后端菜单
    adminMenuList:[//菜单项, root为true表示是根菜单,root菜单没有url属性,根菜单有children属性
        {name:"首页",url:"/admin"},
        {root:true,name:"地图",childrenActive:false,children:[
          {name:"地图区域",url:"/admin/mapregion"}
        ]},
        {root:true,name:"用户管理",childrenActive:false,children:[
          {name:"学生列表",url:"/admin/usermanager/userlist"},
          {name:"教师列表",url:"/admin/usermanager/teacherlist"},
          {name:"信息绑定",url:"/admin/userbind"},
        ]},
        {root:true,name:"数据管理",childrenActive:false,children:[
          {name:"课程数据",url:"/admin/datamanager/coursedata"},
          {name:"班级",url:"/admin/datamanager/classdata"},
          {name:"课程节数",url:"/admin/datamanager/coursescheduledata"},
          {name:"课程表",url:"/admin/datamanager/coursetable"},
        ]},
        {name:"系统设置",url:"/admin"},
        {name:"退出",url:"#"},
    ]as Menu[]
  }),

  getters: {
    // isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token: string | null) {
      // this.token = token;
    },

    setTokenName(tokenName: string) {
      // this.tokenName = tokenName;
    },

    clearToken() {
      // this.token = null;
      // this.tokenName = "satoken";
    },

    updateToken(newToken: string) {
      //this.token = newToken;
    },

    updateTokenName(newTokenName: string) { //不一定用到，可以不用管
      //this.tokenName = newTokenName;
    },
  },
});
