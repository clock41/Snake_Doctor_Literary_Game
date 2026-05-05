import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/Snake_Doctor_Literary_Game/', // 確保資源路徑正確，對應 GitHub Pages 路徑
})
