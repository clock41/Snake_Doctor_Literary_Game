# 開發計畫與紀錄

## Build 紀錄

### 2026-05-05 GitHub Pages 部署設定
**用戶的話：** GitHub Pages部屬如何操作

**AI 的話：** 加入 GitHub Pages 部署工作流程和 Vite base 設定

**執行步驟：**
1. 修改 `vite.config.js` 加入 `base: '/snake-doctor-game/'` 設定（需改為實際倉庫名稱）
2. 建立 `.github/workflows/deploy.yml` GitHub Actions 工作流程
3. 設定自動建置與部署到 GitHub Pages

**使用者後續操作：**
1. 在 GitHub 建立倉庫（如 `snake-doctor-game`）
2. 推送程式碼到 main 分支
3. 在倉庫 Settings > Pages 啟用 GitHub Actions 部署
4. 等待 1-2 分鐘即可得到分享網址

---

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
dist/index.html                  0.58 kB │ gzip:  0.40 kB
dist/assets/index-sXyG5XKI.css   4.36 kB │ gzip:  1.11 kB
dist/assets/index-ByxqMH7c.js   70.44 kB │ gzip: 27.59 kB
✓ built in 123ms
```

**修正事項：**
- 移除無效 CSS `:contains` 選擇器，改用 Vue 動態 class 綁定
- 結局標題顏色改為動態綁定（治理迷信=紅色、傳奇醫者=綠色、科學研究者=藍色）

---

## 已完成功能
- [x] 事件循環邏輯：5次治療 + 1次特別事件循環
- [x] 按鈕 disabled 防護：防止快速點擊導致事件跳轉過快
- [x] 蛇名顯示邏輯：沒買寶典顯示真實名稱，有買寶典顯示「蛇名(有毒/無毒)」
- [x] 遊商「不買，離開」選項：避免買完東西後卡住
- [x] GitHub Pages 部署設定

---

## 待確認事項
- [ ] `vite.config.js` 中的 `base` 路徑需改為實際 GitHub 倉庫名稱
