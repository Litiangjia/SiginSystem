<template>
  <div class="settings-modal-overlay" @click="closeModal">
    <div class="settings-modal-container" :class="{closing:isClosing}" @click.stop>
      <div class="settings-modal-header">
        <h2 class="settings-modal-title">设置</h2>
        <button class="settings-modal-close" @click="closeModal">×</button>
      </div>

      <div class="settings-modal-content">
        <!-- 设置项示例 -->
        <div class="settings-section">
          <h3 class="settings-section-title">通用设置</h3>
          <div class="settings-item">
            <label class="settings-label">主题模式</label>
            <select class="settings-select">
              <option>浅色模式</option>
              <option>深色模式</option>
              <option>自动</option>
            </select>
          </div>

          <div class="settings-item">
            <label class="settings-label">语言</label>
            <select class="settings-select">
              <option>中文</option>
              <option>English</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">通知设置</h3>
          <div class="settings-item">
            <div for="push-notification" class="settings-label">推送通知</div>
            <label for="push-notification" class="settings-switch">
              <input id="push-notification" name="push-notification" type="checkbox" checked>
              <span class="settings-slider"></span>
            </label>
          </div>

          <div class="settings-item">
            <div  class="settings-label">邮件通知</div>
            <label for="email-notification" class="settings-switch">
              <input id="email-notification" name="email-notification" type="checkbox">
              <span class="settings-slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">账户设置</h3>
          <div class="settings-item">
            <button class="settings-button">修改密码</button>
          </div>
          <div class="settings-item">
            <button class="settings-button settings-button-danger" @click="logout">退出登录</button>
          </div>
        </div>
      </div>

      <div class="settings-modal-footer">
        <button class="settings-button settings-button-primary" @click="saveSettings">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { http } from '@/ajax/send';
import {userToken} from '@/assets/store/userToken';
import D from "@/assets/ts/messageDialog.ts";
import {useRouter}  from 'vue-router'
const router = useRouter();
const token = userToken();
const emit = defineEmits(['close'])//定义给父组件监听
const isClosing = ref(false) // 控制关闭动画
const closeModal = () => {
  isClosing.value = true;
  const dom = document.querySelector('.settings-modal-container') as HTMLElement
  dom.addEventListener('animationend', () => {
    isClosing.value = false;
    emit('close');
  })

}
const saveSettings = () => {
  // 保存设置逻辑
  console.log('保存设置')
  closeModal()
}

const logout = async  () => { //登出 退出登录
  // 登出逻辑
  try{

    const res = await http.post('students/logout'); // 退出登录接口
    token.clearToken();
    new D({
      type:"success",
      message:res as string
    });

    router.push('/loging'); // 跳转到登录页面
  }catch (error) { /// 登出失败
    console.log(error);/// 错误处理
  }
}

</script>








<style scoped lang="less">
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.settings-modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;

  // 添加缩放弹跳动画
  animation: scaleBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform: scale(0);
  opacity: 0;
}

@keyframes scaleBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}




.settings-modal-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;

  // 现代化滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #4a90e2, #5c6bc0);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #3a80d2, #4a5ca0);
  }

  // Firefox 滚动条样式
  scrollbar-width: thin;
  scrollbar-color: #4a90e2 transparent;
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.settings-modal-title {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.settings-modal-close {
  background: none;
  border: none;
  font-size: 1.8em;
  cursor: pointer;
  color: #999;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.settings-modal-close:hover {
  background-color: #f5f5f5;
}

.settings-modal-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.settings-section {
  margin-bottom: 25px;
}

.settings-section-title {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-label {
  font-size: 1em;
  color: #333;
}

.settings-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  font-size: 1em;
}

.settings-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.settings-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.settings-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.settings-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.settings-switch input:checked + .settings-slider {
  background-color: #4a90e2;
}

.settings-switch input:checked + .settings-slider:before {
  transform: translateX(26px);
}

.settings-button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-button:hover {
  background-color: #f5f5f5;
}

.settings-button-primary {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.settings-button-primary:hover {
  background-color: #3a80d2;
}

.settings-button-danger {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

.settings-button-danger:hover {
  background-color: #d32f2f;
}

.settings-modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .settings-modal-container {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
  }

  .settings-modal-overlay {
    align-items: flex-end;
  }

  .settings-modal-header {
    padding: 15px;
  }

  .settings-modal-content {
    padding: 15px;
  }

  .settings-modal-footer {
    padding: 15px;
  }

  .settings-modal-title {
    font-size: 1.3em;
  }
}

@media (max-width: 480px) {
  .settings-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .settings-button {
    width: 100%;
  }
}



// 添加关闭动画类
.closing{
    animation: scaleOut 0.3s ease-in forwards;
}

@keyframes scaleOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}
</style>
