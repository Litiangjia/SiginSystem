<template>
  <div id="registView" class="center-box">
    <form class="box3 col-7 col-lg-9 col-md-10 col-m-15 col-sm-22 col-xs-24" @submit.prevent="regist()">
      <div>
        <svg t="1757845868240" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="10479" width="50" height="50">
          <!-- SVG 内容 -->
        </svg>
        <router-link to="loging">
          <button class="float-right btn4">返回登陆</button>
        </router-link>
      </div>

      <div class="margin-bottom-2">
        <label for="name" class="margin-bottom-2 display-block">用户名</label>
        <input type="text" class="input1 col-24" id="name" v-model="name" required placeholder="请输入用户名" />
        <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="margin-bottom-2">
        <label for="phoneNumber" class="margin-bottom-2 display-block">手机号</label>
        <input type="text" class="input1 col-24" id="phoneNumber" v-model="phoneNumber" required
          placeholder="请输入手机号" />
        <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
      </div>

      <div class="margin-bottom-2">
        <label for="studentNumber" class="margin-bottom-2 display-block">学号</label>
        <input type="text" class="input1 col-24" id="studentNumber" v-model="studentNumber" required
          placeholder="请输入你的学号" />
        <span class="error-message" v-if="errors.studentNumber">{{ errors.studentNumber }}</span>
      </div>

      <div>
        <label for="studentPassword" class="margin-bottom-2 display-block">密码</label>
        <input type="password" class="input1 col-24" required id="studentPassword" v-model="studentPassword"
          placeholder="请输入密码" />
        <span class="error-message" v-if="errors.studentPassword">{{ errors.studentPassword }}</span>
      </div>

      <div class="margin-top-2">
        <button class="btn margin-top-2 float-left col-24" :disabled="!meta.valid">注册</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {http} from '@/ajax/send';
import { useForm, useField } from 'vee-validate';
import  D  from '@/assets/ts/messageDialog';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
export default {
  name: 'RegistView',
  setup() {
    const router = useRouter();
    // 定义验证规则
    const validationSchema = yup.object({
      name: yup
        .string()
        .required('用户名不能为空')
        .matches(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, '用户名不能包含特殊字符')
        .min(2, '用户名至少2个字符')
        .max(20, '用户名最多20个字符'),
      phoneNumber: yup
        .string()
        .required('手机号不能为空')
        .matches(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
      studentNumber: yup
        .string()
        .required('学号不能为空')
        .matches(/^\d{8,15}$/, '学号应为8-15位数字'),
      studentPassword: yup
        .string()
        .required('密码不能为空')
        .matches(/^[a-zA-Z0-9.]+$/, '密码只能包含大小写字母、数字和小数点')
        .min(6, '密码至少6位')
        .max(16, '密码最多16位'),
    });

    // 使用 useForm 初始化表单
    const { handleSubmit, errors, meta } = useForm({
      validationSchema,
    });

    // 为每个字段创建响应式绑定
    const { value: name } = useField('name');
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: studentNumber } = useField('studentNumber');
    const { value: studentPassword } = useField('studentPassword');
    // 提交处理函数
    const regist = handleSubmit(async(values) => {
      try{
        await http.post('students/register', values);

        new D({
          type: "success",
          message: "注册成功",
          duration: 2000, //enter
        }).enter(()=>{
          console.log("注册成功");
          router.push({path: "/loging"})
        });
      }catch(err){
        console.log(err);
        new D({
          type: "error",
          message: ""+err,
          duration: 2000, //
        });
      }
    });

    return {
      name,
      phoneNumber,
      studentNumber,
      studentPassword,
      errors,
      meta,
      regist
    };
  }
};
</script>

<style scoped lang="less">
@import '@componentsLess/btn.less';
@import '@componentsLess/box.less';
@import '@componentsLess/input.less';

#registView {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/icon/regist-bg.svg");
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}
</style>
