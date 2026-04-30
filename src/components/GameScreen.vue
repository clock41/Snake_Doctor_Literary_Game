<!-- 遊戲主畫面：像是遊戲進行中的舞台 -->
<script setup>
import { useGame } from '../composables/useGame'
import { computed, ref } from 'vue'

// 拿到遊戲邏輯和狀態
const { state, nextEvent, nextAfterSpecial, handleTreatmentChoice, handleSpecialChoice } = useGame()

// 是否正在處理事件轉換：防止玩家點太快導致事件跳轉
const isProcessing = ref(false)

// 計算當前事件類型
const isTreatmentEvent = computed(() => {
  return state.currentEvent && state.currentEvent.type === 'treatment'
})

const isSpecialEvent = computed(() => {
  return state.currentEvent && state.currentEvent.type !== 'treatment'
})

// 處理治療選項
function onTreatmentChoice(choice) {
  if (isProcessing.value) return // 正在處理中，防止重複點擊
  isProcessing.value = true // 鎖定按鈕
  
  const result = handleTreatmentChoice(choice)
  if (result === 'continue' || result === 'special') {
    setTimeout(() => {
      nextEvent() // 延遲讓玩家看到結果
      isProcessing.value = false // 解除鎖定
    }, 500) // 0.5秒延遲
  } else {
    // 如果不需要跳轉（如錯誤情況），立即解除鎖定
    isProcessing.value = false
  }
}

// 處理特別事件選項
function onSpecialChoice(choice) {
  if (isProcessing.value) return // 正在處理中，防止重複點擊
  isProcessing.value = true // 鎖定按鈕
  
  const result = handleSpecialChoice(choice)
  if (result === 'continue') {
    setTimeout(() => {
      nextEvent() // 跳到下一個事件
      isProcessing.value = false // 解除鎖定
    }, 500) // 0.5秒延遲
  } else {
    // 如果不需要跳轉（如 retry 或 ending），立即解除鎖定
    isProcessing.value = false
  }
  // 如果是 ending 或 retry，狀態已經更新，畫面會自動切換
}

// 初始化第一個事件
if (!state.currentEvent) {
  nextEvent()
}

// 事件描述文字
const eventDescription = computed(() => {
  if (!state.currentEvent) return ''
  
  const event = state.currentEvent
  
  if (event.type === 'treatment') {
    return `一位農夫被 ${event.displayName} 咬傷，痛得滿地打滾。你準備...`
  } else if (event.type === 'official') {
    return `一位日本政府官員來到你的診所，詢問你治療蛇傷的方法。`
  } else if (event.type === 'doctor') {
    return `一位受過新式教育的醫師來拜訪，想了解你的治療方式。`
  } else if (event.type === 'merchant') {
    return `一位遊商來到村裡，帶來了許多稀奇的貨物。`
  }
  
  return ''
})

// 特別事件選項
const specialOptions = computed(() => {
  if (!state.currentEvent) return []
  
  const event = state.currentEvent
  
  if (event.type === 'official') {
    const options = []
    options.push({ value: 'lie', text: '說謊稱自己會治毒蛇', type: 'danger' })
    if (state.hasGift) {
      options.push({ value: 'gift', text: '送上禮物', type: 'neutral' })
    }
    return options
  } else if (event.type === 'doctor') {
    return [
      { value: 'persuade', text: '說服：「救命勝過求理...」', type: 'herb' },
      { value: 'lie', text: '說謊應付', type: 'danger' }
    ]
  } else if (event.type === 'merchant') {
    const options = []
    if (!state.hasManual) {
      // 即使沒錢也顯示選項，點擊時會提示
      options.push({ value: 'manual', text: '購買毒蛇寶典 (-100 財富)', type: 'herb' })
    }
    // 研究資料選項始終顯示
    options.push({ value: 'research', text: `購買研究資料 (-100 財富) [${state.researchCount}/3]`, type: 'neutral' })
    if (!state.hasGift) {
      // 即使沒錢也顯示選項
      options.push({ value: 'gift', text: '購買禮物 (-100 財富)', type: 'neutral' })
    }
    // 加入離開選項，避免卡住
    options.push({ value: 'leave', text: '不買，離開', type: 'neutral' })
    return options
  }
  
  return []
})
</script>

<template>
  <div class="game-screen">
    <!-- 數值狀態欄：隨時顯示玩家的狀態 -->
    <div class="stat-bar">
      <div class="stat-item">
        <div class="stat-label">信譽值</div>
        <div class="stat-value">{{ state.reputation }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">財富</div>
        <div class="stat-value">{{ state.wealth }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">疑心值</div>
        <div class="stat-value">{{ state.suspicion }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">事件進度</div>
        <div class="stat-value">{{ state.treatmentCount }}/6</div>
      </div>
    </div>
    
    <!-- 事件描述區域 -->
    <div class="event-container">
      <div class="event-description">
        {{ eventDescription }}
      </div>
      
      <!-- 治療事件選項 -->
      <div v-if="isTreatmentEvent" class="options-container">
        <button @click="onTreatmentChoice('herb')" :disabled="isProcessing" class="option-button herb">
          🌿 敷上壓碎的草藥
        </button>
        <button @click="onTreatmentChoice('ritual')" :disabled="isProcessing" class="option-button danger">
          ⛩️ 三巡祭拜與放血
        </button>
        <button @click="onTreatmentChoice('refuse')" :disabled="isProcessing" class="option-button neutral">
          🚫 說自己不會治療
        </button>
      </div>
      
      <!-- 特別事件選項 -->
      <div v-if="isSpecialEvent" class="options-container">
        <button 
          v-for="option in specialOptions" 
          :key="option.value"
          @click="onSpecialChoice(option.value)" 
          :disabled="isProcessing"
          class="option-button"
          :class="option.type"
        >
          {{ option.text }}
        </button>
      </div>
    </div>
    
    <!-- 訊息紀錄：顯示發生過的事情 -->
    <div class="message-log" v-if="state.messageLog.length > 0">
      <h3>紀錄</h3>
      <div 
        v-for="(msg, index) in state.messageLog.slice(-5)" 
        :key="index"
        class="log-item"
      >
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-screen {
  max-width: 800px;
  margin: 0 auto;
}

.event-container {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.event-description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
  padding: 20px;
  background-color: rgba(85, 239, 196, 0.1); /* 淡綠色背景 */
  border-left: 4px solid #55efc4;
}

.options-container {
  display: flex;
  flex-direction: column;
}

.message-log {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.message-log h3 {
  color: #ff7675;
  margin-bottom: 10px;
}

.log-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  opacity: 0.8;
}

.log-item:last-child {
  border-bottom: none;
}
</style>
