import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 80, //端口好改为8080
    https:{},
    host:true,
  },
  base:process.env.NODE_ENV === 'production' ? './' : '/',
  plugins: [
    vue(),
    basicSsl(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@componentsLess':fileURLToPath(new URL('./src/assets/commonLess/componentsLess', import.meta.url)),
    },
  },
})
