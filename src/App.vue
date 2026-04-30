<!-- 主界面：像是遊戲的舞台，所有場景都在這裡切換 -->
<script setup>
import { useGame } from './composables/useGame'
import StartScreen from './components/StartScreen.vue'
import GameScreen from './components/GameScreen.vue'
import EndingScreen from './components/EndingScreen.vue'

// 引入遊戲邏輯：像是拿到遊戲機的搖桿
const { state } = useGame()
</script>

<template>
  <div id="game-container">
    <!-- 根據遊戲狀態切換不同畫面，像是轉動電視頻道 -->
    <StartScreen v-if="!state.gameStarted" />
    <GameScreen v-else-if="state.gameStarted && !state.gameEnding" />
    <EndingScreen v-else-if="state.gameEnding" />
  </div>
</template>

<style>
/* 全域樣式：設定遊戲的整體風格 */
#game-container {
  background-color: #2d3436; /* 深灰色背景，像是夜晚的鄉村 */
  color: #dfe6e9; /* 淺灰白文字，像是月光下的字跡 */
  min-height: 100vh;
  padding: 20px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif; /* 中文友善字體 */
}

/* 選項按鈕的基本樣式 */
.option-button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease; /* 平滑的動畫效果 */
  text-align: left;
}

/* 草藥/治療選項：藥草綠 */
.option-button.herb {
  background-color: #55efc4;
  color: #2d3436;
}

.option-button.herb:hover {
  background-color: #00b894;
}

/* 危險/政府選項：警示紅 */
.option-button.danger {
  background-color: #ff7675;
  color: white;
}

.option-button.danger:hover {
  background-color: #d63031;
}

/* 一般選項：中性色 */
.option-button.neutral {
  background-color: #636e72;
  color: white;
}

.option-button.neutral:hover {
  background-color: #2d3436;
}

/* 數值顯示樣式 */
.stat-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
}
</style>
