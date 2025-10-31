<template>
  <main class="schoolback">
    <div class="base-center-box col-21 col-sm-24">
      <div class="col-6 col-lg-7 col-md-9 col-m-8  col-sm-24 row ">
        <!-- 显示导航栏 -->
        <div class="left-nav-bar">
          <header class="left-nav-bar-header">导航条</header>
          <button class="menu-btn left-nav-active">
            <img width="40px" height="40px" src="@/assets/icon/menu.svg"/>
          </button>
        </div>
        <nav class="left-nav">
          <header class="left-nav-header">签到导航</header>
          <ul class="left-nav-ul">
            <!-- <router-link :to="item.url" class="left-nav-link"> -->
              <li class="left-nav-li" v-for="(item,index) in navMenu" :key="index" :class="{navActive:item.navActive}">
                <router-link :to="item.url">{{item.name}}</router-link>
              </li>
            <!-- </router-link> -->
          </ul>
        </nav>
      </div>
      <main class="left-nav-auto col-18 col-md-15 col-lg-17 col-m-16 col-sm-24 row">
          <RouterView />
      </main>
    </div>
  </main>
</template>

<script setup  lang="ts">
  import {onMounted,ref} from "vue";
  import {navMenuActive} from "@/assets/ts/nav.ts";
  import {menu} from "@/assets/store/menu";
  import type { NavMenuItem } from "@/assets/ts/interfaceManager";


  //导航栏菜单
  const navMenu = ref<NavMenuItem[]>([]);
  navMenu.value = menu().menuList;
  // // vue生命周期，页面加载完成后，导航栏js激活
  // //单页app, 导航栏功能
  onMounted(() => {
    navMenuActive(); // 导航栏激活
  });
</script>

<style scoped lang="less">
  @import '@/assets/commonLess/componentsLess/btn.less';
  @import '@/assets/commonLess/componentsLess/box.less';
  @import '@/assets/commonLess/componentsLess/nav.less';
  // @import "@/assets/commonLess/componentsLess/box.less;
  #a{
    background-color: red;
  }
  .animation-boxs-item{
    height:300px;
  }

</style>
