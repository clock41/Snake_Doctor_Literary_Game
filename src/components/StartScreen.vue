<!-- 開始畫面：像是遊戲的封面，歡迎玩家進入 -->
<script setup>
import { useGame } from '../composables/useGame'

// 拿到開始遊戲的功能
const { startGame } = useGame()
</script>

<template>
  <div class="start-screen">
    <!-- 遊戲標題 -->
    <h1 class="game-title">🐍 蛇先生</h1>
    <h2 class="game-subtitle">Snake Doctor</h2>
    
    <!-- 遊戲簡介 -->
    <div class="game-intro">
      <p>日治初期，一位鄉村蛇醫的故事。</p>
      <p>你將扮演一位懂治蛇毒的「蛇先生」，在現代醫學與傳統迷信之間求生存。</p>
    </div>
    
    <!-- 開始按鈕 -->
    <button @click="startGame" class="start-button">
      開始遊戲
    </button>
    
    <!-- 簡單說明 -->
    <div class="game-rules">
      <h3>遊戲規則</h3>
      <ul>
        <li>每6個事件會觸發一次特別事件</li>
        <li>注意你的信譽值、財富和疑心值</li>
        <li>達成特定條件會觸發不同結局</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 開始畫面樣式：讓玩家感受到氛圍 */
.start-screen {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding-top: 100px;
}

.game-title {
  font-size: 48px;
  color: #55efc4; /* 藥草綠 */
  margin-bottom: 10px;
}

.game-subtitle {
  font-size: 24px;
  color: #dfe6e9;
  margin-bottom: 40px;
}

.game-intro {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.game-intro p {
  margin: 10px 0;
}

.start-button {
  background-color: #55efc4;
  color: #2d3436;
  border: none;
  padding: 15px 50px;
  font-size: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.start-button:hover {
  background-color: #00b894;
  transform: scale(1.05); /* 滑鼠移上去會稍微放大 */
}

.game-rules {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  text-align: left;
}

.game-rules h3 {
  color: #ff7675; /* 警示紅 */
  margin-bottom: 10px;
}

.game-rules ul {
  padding-left: 20px;
}

.game-rules li {
  margin: 8px 0;
}
</style>
