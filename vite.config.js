import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "~": path.resolve(__dirname, "src"),
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
  ],
  server: {
    host: '0.0.0.0', // 允许所有 IP 访问
    port: 5173,      // 指定端口号
    strictPort: false, // 端口占用时直接退出
  },

})
