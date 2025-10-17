<template>
  <div id="logingView" class="center-box">
    <form method="post" class="box3 col-7 col-lg-9 col-md-10 col-m-15  col-sm-22 col-xs-24" @submit.prevent="loging()">
      <div>
        <svg t="1757845868240" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10479" width="50" height="50"><path d="M915.614 807.566H106.119c-33.729 0-62.27-24.53-62.27-56.422v-544.61c0-31.891 28.541-56.421 62.27-56.421h812.093c33.728 0 62.269 24.53 62.269 56.421v544.61c-2.598 29.437-31.137 56.422-64.867 56.422" fill="#8CA0AC" p-id="10480"></path><path d="M567.949 885.949h-114.16l15.565-125.115h83.025l15.57 125.115z m0 0" fill="#8CA0AC" p-id="10481"></path><path d="M313.68 871.226h394.372v41.708H313.68z" fill="#7D8C96" p-id="10482"></path><path d="M880.119 724.563H132.48c-31.783 0-57.792-22.455-53.083-49.898v-432.12c-4.709-27.443 21.3-49.899 53.083-49.899h754.23c31.784 0 51.2 22.456 55.909 49.899v432.202c-4.708 27.361-30.717 49.816-62.5 49.816z m0 0" fill="#62C5E4" p-id="10483"></path><path d="M866.718 495.005h-341.36c-16.166 0-29.487 8.815-29.487 19.66 0 10.781 13.217 19.662 29.487 19.662h341.36c16.167 0 29.488-8.814 29.488-19.662 0-10.778-13.222-19.66-29.488-19.66zM525.259 405.301h151.51c16.269 0 29.593-9.803 29.486-21.872 0-11.991-13.218-21.872-29.486-21.872h-151.51c-16.172 0-29.488 9.803-29.488 21.872 0 11.99 13.216 21.872 29.488 21.872z" fill="#FFFFFF" p-id="10484"></path><path d="M278.567 491.832h-19.011c-14.648 0-26.642-11.343-26.642-25.187v-36.153c0-13.844 11.994-25.191 26.642-25.191h19.011c14.642 0 26.644 11.347 26.644 25.191v36.153c-0.001 13.938-12.003 25.187-26.644 25.187z m0 0" fill="#F2C6A2" p-id="10485"></path><path d="M396.424 606.437v-66.048c0-30.769-57.353-51.152-127.311-51.152-70.063 0-127.31 20.384-127.31 51.152v66.048h254.621z m0 0" fill="#E7E7DC" p-id="10486"></path><path d="M218.371 408.958h-20.845c-10.271 0-18.713-7.981-18.713-17.694 0-9.708 8.442-17.69 18.713-17.69h20.845c10.273 0 18.708 7.981 18.708 17.69-0.001 9.807-8.435 17.694-18.708 17.694z m118.461-1.639h-20.843c-10.274 0-18.708-7.976-18.708-17.688 0-9.709 8.434-17.689 18.708-17.689h20.843c10.273 0 18.713 7.98 18.713 17.689 0 9.712-8.44 17.688-18.713 17.688z m0 0" fill="#F2C6A2" p-id="10487"></path><path d="M385.133 606.437v-66.048c0-30.769-32.64-51.152-116.02-51.152-81.551 0-116.024 20.384-116.024 51.152v66.048h232.044z m0 0" fill="#F2F2F1" p-id="10488"></path><path d="M269.009 456.162c-37.015 0-67.317-20.191-67.317-57.302v-49.228c0-37.012 30.302-67.396 67.317-67.396 37.015 0 67.316 30.285 67.316 67.396v49.228c0 37.111-30.302 57.302-67.316 57.302z m0 0" fill="#FBD6B5" p-id="10489"></path><path d="M229.05 384.344c0 3.122 1.41 6.014 3.709 7.577 2.298 1.563 5.128 1.563 7.424 0 2.297-1.563 3.714-4.455 3.714-7.577 0-3.127-1.417-6.015-3.714-7.577-2.295-1.563-5.126-1.563-7.424 0-2.299 1.563-3.709 4.45-3.709 7.577z m0 0M293.819 384.344c0 4.831 3.327 8.746 7.423 8.746 4.1 0 7.424-3.915 7.424-8.746 0-4.836-3.324-8.75-7.424-8.75-4.096 0-7.423 3.914-7.423 8.75z m0 0" fill="#684B4A" p-id="10490"></path><path d="M202.1 606.437v-41.055c0-2.784-2.438-5.094-5.388-5.094-2.949 0-5.393 2.31-5.393 5.094v41.055H202.1z m144.191 0v-41.055c0-2.784-2.443-5.094-5.387-5.094-2.949 0-5.392 2.31-5.392 5.094v41.055h10.779z m0 0" fill="#E4E4DA" p-id="10491"></path><path d="M294.534 492.987h-50.638c-3.357 4.521-3.357 11.825 0 16.346l19.214 25.765c3.355 4.52 8.849 4.52 12.204 0l19.22-25.765c3.352-4.52 3.352-11.924 0-16.346z m0 0" fill="#DC322F" p-id="10492"></path><path d="M342.021 281.466h-94.263c-11.187 0-20.948 7.211-25.525 17.596-14.539 1.248-24.608 14.708-24.608 30.861l4.066 43.745h19.528c1.014 0 1.827-0.765 1.827-1.827v-23.843c0-1.155 0.814-2.113 1.932-2.113l86.84 8.362c1.018 0 1.931 0.962 1.931 2.117v14.901c0 1.347 1.121 2.403 2.542 2.403h18.812c7.527 0 14.03-84.413 14.03-84.413 0.613-4.521-3.145-7.789-7.112-7.789z m0 0" fill="#F2C9A3" p-id="10493"></path><path d="M346.593 277.814h-98.532c-11.385 0-21.25 7.112-25.828 17.304-14.742 1.155-26.435 14.327-26.435 30.191l5.386 42.974h16.167c1.019 0 1.832-0.765 1.832-1.728V343.19c0-1.155 0.914-2.019 1.932-2.019l95.688 8.173c1.018 0 1.931 0.962 1.931 2.019v14.614c0 1.348 1.117 2.404 2.542 2.404h17.185c4.782 0 15.353-82.878 15.353-82.878 0.51-4.516-3.252-7.689-7.221-7.689z m0 0" fill="#684B4A" p-id="10494"></path><path d="M268.707 492.602l-14.136 29.134c-2.542 3.747-5.288 7.783-9.353 4.324l-40.064-27.788c-3.054-2.882-6.208-5.093-4.985-8.652l12.507-19.9c1.221-3.559 5.391-5.479 9.354-4.329l41.693 18.558c3.965 1.249 6.199 5.094 4.984 8.653z m0 0" fill="#E7E7DC" p-id="10495"></path><path d="M269.417 492.41l13.932 29.229c2.542 3.845 5.183 7.787 9.353 4.328l40.267-27.501c3.048-2.883 6.202-5.094 4.985-8.652l-8.138-18.844c-1.222-3.559-5.387-5.479-9.354-4.324l-46.061 17.112c-3.867 1.154-6.102 5.093-4.984 8.652z m0 0" fill="#E7E7DC" p-id="10496"></path><path d="M283.447 606.728h-28.673c-2.949 0-5.386-1.057-5.386-2.502l11.587-75.472c0-1.347 2.443-2.502 5.392-2.502h5.389c2.948 0 5.391 1.057 5.391 2.502l11.588 75.472c0.105 1.445-2.338 2.502-5.288 2.502z m0 0" fill="#DC322F" p-id="10497"></path><path d="M275.314 534.327H262.5c-1.216 0-2.134-0.864-2.134-2.019 0-1.15 0.918-2.02 2.134-2.02h12.815c1.222 0 2.135 0.869 2.135 2.02 0 1.062-1.018 2.019-2.136 2.019z m0 0" fill="#BD1A21" p-id="10498"></path></svg>
        <router-link to="regist" class="float-right btn3">注册</router-link>
      </div>

      <div class="margin-bottom-2">
        <label for="phoneNumber" class="margin-bottom-2 display-block">手机号</label>
        <input type="text" class="input1 col-24" id="phoneNumber" v-model="phoneNumber" required placeholder="请输入手机号" />
        <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
      </div>

      <div>
        <label for="studentPassword" class="margin-bottom-2 display-block">密码</label>
        <input type="password" class="input1 col-24"  id="studentPassword" v-model="studentPassword" required placeholder="请输入密码"/>
        <span class="error-message" v-if="errors.studentPassword">{{ errors.studentPassword }}</span>
      </div>

      <div class="margin-top-2">
        <button class="btn margin-top-2 float-left col-sm-24" type="submit">登录</button>
        <button class="btn2 margin-top-1 float-right col-sm-24">忘记密码</button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">

  import { http } from '@/ajax/send';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import { userToken } from '@/assets/store/userToken';
  import D from "@/assets/ts/messageDialog.ts";
  import { useRouter } from 'vue-router';
  const router = useRouter();
  // 定义验证规则
  const validationSchema = yup.object({
    phoneNumber: yup
      .string()
      .required('手机号不能为空')
      .matches(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
    studentPassword: yup
      .string()
      .required('密码不能为空')
      .matches(/^[a-zA-Z0-9.]+$/, '密码只能包含大小写字母、数字和小数点')
      .min(6, '密码至少6位')
      .max(16, '密码最多16位'),
  });
  // 使用 useForm 初始化表单
  const { handleSubmit, errors} = useForm({
    validationSchema,
  });



  // 为每个字段创建响应式绑定
  const { value: phoneNumber } = useField('phoneNumber');
  const { value: studentPassword } = useField('studentPassword');

  // 提交处理函数
  const loging = handleSubmit(async (values) => {
    try{
      const res = await http.post("students/login", values);
      const myToken = userToken();
      myToken.setToken(res.tokenValue); //设置token
      myToken.setTokenName(res.tokenName); //设置token名称
      new D({"type":"success","message":"登陆成功！"});
      router.push("/");
    }catch(err){ // 错误处理
      new D({"type":"error","message":err as string});
    }
  });
</script>

<style scoped lang="less">
  @import '@/assets/commonLess/componentsLess/btn.less';
  @import '@/assets/commonLess/componentsLess/box.less';
  @import '@/assets/commonLess/componentsLess/input.less';

  #logingView{
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("@/assets/backImgs/logingback.jpg");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 5px;
      display: block;
    }
  }
</style>
