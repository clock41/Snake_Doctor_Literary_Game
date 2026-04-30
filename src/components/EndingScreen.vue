<!-- 結局畫面：像是故事的結尾，告訴玩家結果 -->
<script setup>
import { useGame } from '../composables/useGame'

// 拿到遊戲狀態和結局訊息
const { state, endingMessages, startGame } = useGame()

// 取得當前結局的訊息
const ending = endingMessages[state.gameEnding]
</script>

<template>
  <div class="ending-screen">
    <!-- 結局標題：動態綁定 class 來改變顏色 -->
    <h1 class="ending-title" :class="state.gameEnding">{{ ending.title }}</h1>
    
    <!-- 結局描述 -->
    <div class="ending-description">
      <p>{{ ending.description }}</p>
    </div>
    
    <!-- 最終數值統計 -->
    <div class="final-stats">
      <h3>最終數值</h3>
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">信譽值</span>
          <span class="stat-value">{{ state.reputation }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">財富</span>
          <span class="stat-value">{{ state.wealth }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">疑心值</span>
          <span class="stat-value">{{ state.suspicion }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">研究進度</span>
          <span class="stat-value">{{ state.researchCount }}/3</span>
        </div>
      </div>
    </div>
    
    <!-- 重新開始按鈕 -->
    <button @click="startGame" class="restart-button">
      重新開始
    </button>
    
    <!-- 回到首頁按鈕 -->
    <button @click="state.gameStarted = false; state.gameEnding = null" class="home-button">
      回到首頁
    </button>
  </div>
</template>

<style scoped>
/* 結局畫面樣式：莊重而富有氛圍 */
.ending-screen {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding-top: 100px;
}

.ending-title {
  font-size: 42px;
  margin-bottom: 30px;
}

/* 治理迷信結局用紅色（會在模板中動態綁定 class） */
.ending-title.governance {
  color: #ff7675; /* 警示紅，代表不好的結局 */
}

.ending-title.legendary {
  color: #55efc4; /* 藥草綠，代表好結局 */
}

.ending-title.researcher {
  color: #74b9ff; /* 藍色，代表學術結局 */
}

.ending-description {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  line-height: 1.8;
  font-size: 18px;
}

.final-stats {
  background-color: rgba(85, 239, 196, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.final-stats h3 {
  color: #55efc4;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #55efc4;
}

.restart-button {
  background-color: #55efc4;
  color: #2d3436;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;
  margin-bottom: 10px;
}

.restart-button:hover {
  background-color: #00b894;
}

.home-button {
  background-color: #636e72;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-button:hover {
  background-color: #2d3436;
}
</style>
