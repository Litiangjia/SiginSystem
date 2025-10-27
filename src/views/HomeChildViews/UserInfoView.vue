<template>
  <Settings v-if="isShow" @close="closeSettings" />
  <div id="userInfoView">
    <div class="center-box">
      <main class="user-info-box col-24">
        <div class="settings-box clear-both">
          <h1 class="float-left">xxx同学</h1>
          <button class="settings-btn float-right" @click="openSettings">设置</button>
        </div>
        <div class="user-info col-24">
          <div class="user-info-content row col-12 col-m-24">
            <p>学校：xxx学校</p>
            <p>班级：xxx班</p>
            <p>年级：xxx年级</p>
            <p>性别：男</p>
            <p>生日：1999-01-01</p>
            <p>电话：13812345678</p>
          </div>
          <div class="user-info-img row col-12 col-m-24 clear-both">
            <img src="@/assets/imgs/user-icon.png" class="col-12 col-lg-14 col-md-20 col-m-24"/>
          </div>
        </div>
      </main>
      <main class="anim-box-row col-24">
        <div class="anim-box-row-item">
          <div class="animation-container">
            <!-- 子项内容 -->
            <h3>项目1</h3>
            <p>这是第一个项目的内容</p>
          </div>
        </div>
        <div class="anim-box-row-item">
          <div class="animation-container">
            <!-- 子项内容 -->
            <h3>项目2</h3>
            <p>这是第二个项目的内容</p>
          </div>
        </div>

        <div class="anim-box-row-item">
          <div class="animation-container">
            <!-- 子项内容 -->
            <h3>项目2</h3>
            <p>这是第二个项目的内容</p>
            <p>这是第二个项目的内容</p>
            <p>这是第二个项目的内容</p>
          </div>
        </div>
        <!-- 更多项目... -->
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
  import Settings from "@/components/SettingsView.vue";
  // import dialog from "@/assets/ts/messageDialog";
  import { ref } from "vue";

  const isShow = ref(false);
  const closeSettings = () => {
     isShow.value = false;
  };
  const openSettings = () => {
    isShow.value = true;
  };
</script>

<style scoped lang="less">
  @import "@componentsLess/box.less";
  @import "@componentsLess/btn.less";
  @import "@componentsLess/boxAnim.less";

    .center-box{
      padding:0;
      background-color:none;
    }
    .settings-box {
      margin-bottom: 2rem;
      h1 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 700;
        color: #2c3e50;
        background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .row{
      vertical-align: middle;
    }
    .user-info-box {
      box-sizing: border-box;
      padding: 1.5rem 0.5rem;
      background: linear-gradient(90deg, #f8f9ff 0%, #f0f4ff 100%);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(106, 130, 251, 0.08);
      margin-bottom: 2rem;
      border: 1px solid rgba(106, 130, 251, 0.1);
      &:hover {
        box-shadow: 0 12px 40px rgba(106, 130, 251, 0.15);
      }
    }

    .user-info {
      display: flex;
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
      transform: translateY(30px);

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    .user-info-content {
    animation: slideInLeft 0.6s ease-out 0.2s forwards;
    opacity: 0;
    transform: translateX(-20px);

    p {
      margin: 0.8rem 0;
      padding: 0.8rem 1.2rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      border-left: 4px solid #6a82fb;
      box-shadow: 0 2px 8px rgba(106, 130, 251, 0.05);
      transition: all 0.3s ease;
      opacity: 0;
      animation: fadeIn 0.4s ease-out forwards;

      &:nth-child(1) { animation-delay: 0.3s; }
      &:nth-child(2) { animation-delay: 0.4s; }
      &:nth-child(3) { animation-delay: 0.5s; }
      &:nth-child(4) { animation-delay: 0.6s; }
      &:nth-child(5) { animation-delay: 0.7s; }
      &:nth-child(6) { animation-delay: 0.8s; }

      &:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(106, 130, 251, 0.1);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }

  .user-info-img {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    align-self: flex-end;
    img {
      animation: zoomIn 0.6s ease-out 0.4s forwards;
      opacity: 0;
      transform: scale(0.8);
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(106, 130, 251, 0.2);
      border: 4px solid white;

      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }

  @media all and (max-width: 576px) {
    .user-info{
      display: block;
      position:relative;
      .user-info-img{
        position:absolute;
        bottom:0;
        img{
          width:30%
        }
        //display:none;
      }
    }
  }

</style>
