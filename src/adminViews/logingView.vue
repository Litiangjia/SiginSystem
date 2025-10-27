<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">管理员登录</h1>
        <div class="logo-animation">
          <div class="pulse-circle"></div>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="adminUserName">用户名</label>
          <input
            id="adminUserName"
            v-model="adminUserName"
            type="text"
            placeholder="请输入管理员账号"
            class="form-input"
            required
          />
          <span class="error-message" v-if="errors.adminUserName">{{ errors.adminUserName }}</span>
        </div>

        <div class="form-group">
          <label for="adminPassword">密码</label>
          <input
            id="adminPassword"
            v-model="adminPassword"
            type="Password"
            placeholder="请输入密码"
            class="form-input"
            required
          />
          <span class="error-message" v-if="errors.adminPassword">{{ errors.adminPassword }}</span>
        </div>
        <!-- {{errors}} -->
        <!-- <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            记住我
          </label>
        </div> -->

        <button
          type="submit"
          class="login-button"
        >
          <span>登录</span>
          <!-- <div v-else class="spinner"></div> -->
        </button>
      </form>

      <div class="login-footer">
        <p>© 20xx 管理系统. 保留所有权利.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import {http} from '@/ajax/send'
import { adminToken } from '@/assets/store/adminToken'
import { useRouter } from 'vue-router'
import  D from '@/assets/ts/newMessageDialog'
import { useForm, useField } from 'vee-validate';
const router = useRouter();
//规则
const validationSchema = yup.object().shape({
  adminUserName: yup.string().required('用户名不能为空')
  .min(6, '用户名长度不能小于6个字符')
  .max(20, '用户名长度不能大于20个字符')
  .matches(/^[a-zA-Z0-9]+$/, '用户名只能包含字母和数字'),
  adminPassword: yup.string().required('密码不能为空')
  .min(6, '密码长度不能小于6个字符')
  .max(20, '密码长度不能大于20个字符')
  .matches(/^[a-zA-Z0-9]+$/, '密码只能包含字母和数字'),
});
//使用规则
const {handleSubmit, errors} = useForm({
  validationSchema,
});

//创建字段响应式绑定
const {value :adminUserName} = useField('adminUserName');
const {value :adminPassword} = useField('adminPassword');


// 登录处理函数
const handleLogin = handleSubmit(async (values) => {
  const res = await http.post('/admin/login',values);

  // //token 保存到本地
  adminToken().setToken(res.tokenValue);
  adminToken().setTokenName(res.tokenName);

  D.success('登录成功');
  // // adminToken.value = res.data.token;
  // // 跳转到首页
  router.push('/admin');
  // console.log(res);

});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 40px 30px;
  backdrop-filter: blur(10px);
  transform: translateY(0);
  animation: floatIn 0.6s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: #333;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-animation {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.pulse-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  position: relative;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.login-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  user-select: none;
}

.checkbox-container input {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

.login-footer p {
  color: #999;
  font-size: 12px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }

  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 24px;
  }

  .form-input {
    padding: 12px;
    font-size: 16px; /* 防止iOS缩放 */
  }

  .login-button {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .login-card {
    border-radius: 15px;
  }

  .login-title {
    font-size: 22px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
