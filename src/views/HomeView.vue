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
            <li class="left-nav-li" v-for="(item,index) in navMenu" :key="index" :class="{navActive:item.navActive}"  @click="navActive(item)">
              {{item.name}}
            </li>
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
  import {useRouter} from "vue-router";
  import {navMenuActive} from "@/assets/ts/nav.ts";


  const router = useRouter();

  // 定义导航菜单项的接口
  interface NavMenuItem {
    name: string;
    url: string;
    icon: string;
    navActive: boolean;
  }

  //导航栏菜单
  const navMenu = ref<NavMenuItem[]>([
    {"name":"首页","url":"/","icon":"icon-home","navActive":true},
    {"name":"个人信息","url":"/userInfo","icon":"icon-userInfo","navActive":false},
    {"name":"签到信息","url":"/signInfo","icon":"icon-signInfo","navActive":false},
    {"name":"课程","url":"/course","icon":"icon-course","navActive":false},
    {"name":"签到","url":"/sign","icon":"icon-sign","navActive":false},
  ]);

  const nowUrl = router.currentRoute.value.path;

  navMenu.value.forEach(item => {
    if(item.url === nowUrl){
      item.navActive = true;
    }else{
      item.navActive = false;
    }
  });
  //import dialog from "@/assets/ts/messageDialog.ts";
  // vue生命周期，页面加载完成后，导航栏js激活
  //单页app, 导航栏功能
  onMounted(() => {
    navMenuActive(); // 导航栏激活
  });

  const navActive = (item:NavMenuItem)=>{

    navMenu.value.forEach(navItem => {
      navItem.navActive = false;
    });
    item.navActive = true;
    router.push(item?.url);
  }
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
