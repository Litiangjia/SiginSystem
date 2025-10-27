import { defineStore } from 'pinia';

interface Menu {
  name: string;
  url?: string;
  root?: boolean;
  childrenActive?: boolean;
  children?: Menu[];
}
// 定义导航菜单项的接口
interface NavMenuItem {
  name: string;
  url: string;
  icon: string;
  navActive: boolean;
}

export const menu = defineStore('menu-store', {
  state: () => ({
    //后端菜单
    adminMenuList:[//菜单项, root为true表示是根菜单,root菜单没有url属性,根菜单有children属性
        {name:"首页",url:"/admin"},
        {root:true,name:"地图",childrenActive:false,children:[
          {name:"地图区域",url:"/admin/mapregion"}
        ]},
        {root:true,name:"学生管理",childrenActive:false,children:[
          {name:"学生列表",url:"/admin/userlist"},
          {name:"信息绑定",url:"/admin/userbind"},
        ]},
        {root:true,name:"数据管理",childrenActive:false,children:[
          {name:"课程数据",url:"/admin/coursedata"},
          {name:"数据添加",url:"/admin"}
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

  persist: {
    key: 'menu-store',
    storage: localStorage,
    pick: ['menuList','adminMenuList'],
  },
});
