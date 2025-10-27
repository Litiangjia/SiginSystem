<!-- TopNav.vue -->
<template>
  <nav class="top-nav">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-logo">
        <h1 class="logo-text">校园管理系统</h1>
      </div>

      <!-- 桌面端导航菜单 -->
      <ul class="nav-menu desktop-menu">
        <template v-for="(menu,index) in menus" :key="index">
            <!-- 判断是否是根菜单 -->
            <li v-if="menu.root" class="nav-item has-dropdown">
              <router-link :to="menu.url||'# '" class="nav-link">{{menu.name}} <i class="arrow-down"></i></router-link>
              <ul class="dropdown-menu">
                <li class="dropdown-item" v-for="(item,index) in menu.children" :key="index">
                  <router-link :to="item.url as string" class="dropdown-link">
                    {{item.name}}
                  </router-link>
                </li>
              </ul>
            </li>
            <!-- 非根菜单 -->
            <li v-else>
              <router-link :to="menu.url||'# '" class="nav-link" @click="menu.name==='退出'?adminOut():''">{{menu.name}}</router-link>
            </li>



        </template>
      </ul>

      <!-- 用户操作区域 -->
      <div class="nav-actions">
        <div class="user-profile">
          <span class="user-name">管理员</span>
        </div>
        <!-- 移动端菜单按钮 -->
         <button class="mobile-toggle" :class="{ active: isMobileMenuOpen }" @click="toggleMobileMenu(true)">
          <span class="hamburger"></span>
          <span class="hamburger"></span>
          <span class="hamburger"></span>
        </button>
      </div>
    </div>
    <!-- 移动端导航菜单 -->
    <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
      <ul class="mobile-nav-list">
        <template v-for="(menu,index) in menus" :key="index">
            <li v-if="menu.root">
              <router-link to="#" class="mobile-nav-link" @click.prevent="toggleMobileDropdown(menu)">
                {{menu.name}} <i class="arrow-right" :class="{ rotated:menu.childrenActive}"></i>
              </router-link>
              <ul class="mobile-submenu" :class="menu.childrenActive? 'mobile-submenu-open': '' ">
                <li class="mobile-sub-item" v-for="(item,index) in menu.children"
                :key="index">
                  <router-link class="mobile-sub-link" @click="toggleMobileMenu(false)" :to="item.url as string">{{item.name}}</router-link>
                </li>
              </ul>
            </li>
            <li class="mobile-nav-item" v-else>
              <router-link :to="menu.url||'# '" class="mobile-nav-link" @click="menu.name==='退出'?adminOut():toggleMobileMenu(false)" >{{menu.name}}</router-link>
            </li>
        </template>
      </ul>
    </div>
  </nav>

  <div  class="base-center-box1 col-22 col-md-24">
    <RouterView/>
  </div>
</template>

<script lang="ts">
import {http} from '@/ajax/send';
import D from '@/assets/ts/newMessageDialog';
import {adminToken} from "@/assets/store/adminToken";
import {menu} from "@/assets/store/menu";
interface Menu {
  name: string;
  url?: string;
  root?: boolean;
  childrenActive?: boolean;
  children?: Menu[];
}
export default {
  name: 'TopNav',
  data() {
    return {
      isMobileMenuOpen: false,
      menus:menu().adminMenuList as Menu[], //
    }
  },
  methods: {
    toggleMobileMenu(b:boolean) {
      if(!b) return this.isMobileMenuOpen = false;

      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },

    toggleMobileDropdown(menu:Menu){//菜单点击移动端菜单下拉子菜单效果
      //关闭其它菜单
      const childrenActive = menu.childrenActive;//获取当前菜单状态
      this.menus.forEach(item => {
        // 判断是否是根菜单并且是激活状态
        if (item.root && item.childrenActive) {
          item.childrenActive = false;// 关闭激活状态
        }
      });
      menu.childrenActive = !childrenActive; // 激活当前菜单
    },

    adminOut(){
      this.toggleMobileMenu(false);
      //退出登录
      D.warning("确定退出登录吗？").enter(async() => {
        try{
           await http.post('/admin/logout');
           adminToken().clearToken();
           D.success("退出成功");
           this.$router.push({path:"/admin/loging"});
        }catch(e){
          D.error("退出失败"+e);
        }
      });
    }
  },
  // mounted() {
  //  document.title = "校园签到";
  // },
}
</script>

<style scoped lang="less">
  @import '@/assets/commonLess/componentsLess/topNav.less';
  @import '@/assets/commonLess/componentsLess/box.less';
  .base-center-box1{
    height:calc(100vh - 60px);
    overflow:hidden;
    overflow-y:auto;
    padding:1rem 0;
    background:none;
  }
</style>
