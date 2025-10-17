import './assets/commonLess/main.less'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate';
import App from './AppMain.vue'  //单个文件应用
import router from './router'



const pinia = createPinia();
pinia.use(persist);
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
