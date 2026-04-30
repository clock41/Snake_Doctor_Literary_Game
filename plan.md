# 開發計畫與紀錄

## Build 紀錄

### 2026-04-29 第一次建置
**用戶的話：** 請依據遊戲概念v2.md寫遊戲，可以開始建立

**AI 的話：** 初始化 Vue 專案（使用 Vite + Vue 模板），建立遊戲核心邏輯與組件

**執行步驟：**
1. 使用 `npm create vite@latest` 建立 Vue 專案（因目錄已有檔案，先建立 temp-vue 子目錄再整合）
2. 安裝依賴：`npm install`
3. 建立 `src/composables/useGame.js` - 遊戲核心邏輯（數值系統、事件處理、結局判斷）
4. 修改 `index.html` - 更新標題與中文語系
5. 建立 `src/App.vue` - 主界面與路由邏輯
6. 建立 `src/components/StartScreen.vue` - 開始畫面
7. 建立 `src/components/GameScreen.vue` - 遊戲主畫面（治療事件、特別事件、數值顯示）
8. 建立 `src/components/EndingScreen.vue` - 結局畫面
9. 修改 `src/style.css` - 全域樣式（深灰背景 #2d3436、淺灰白文字 #dfe6e9）
10. 執行 `npm run build` 測試建置

**建置結果：**
```
dist/index.html                  0.58 kB │ gzip:  0.41 kB
dist/assets/index-3qY3D6uw.css   4.36 kB │ gzip:  1.11 kB
dist/assets/index-CuocGIKA.js   69.54 kB │ gzip: 27.28 kB
✓ built in 136ms
```

**修正事項：**
- 移除無效 CSS `:contains` 選擇器，改用 Vue 動態 class 綁定
- 結局標題顏色改為動態綁定（治理迷信=紅色、傳奇醫者=綠色、科學研究者=藍色）

---

## 待修正問題
- [ ] 事件循環邏輯：應為「5次治療 + 1次特別事件」循環（用戶要求先跳過）
