// 遊戲核心邏輯：像是一本食譜，記錄所有規則和步驟
import { reactive } from 'vue'

// 蛇類資料：就像是藥材清單，記錄每種蛇的名字
const snakeTypes = [
  { name: '青竹絲', isVenomous: true },
  { name: '眼鏡蛇', isVenomous: true },
  { name: '雨傘節', isVenomous: true },
  { name: '錦蛇', isVenomous: false },
  { name: '臭青母', isVenomous: false },
  { name: '水蛇', isVenomous: false }
]

// 遊戲狀態：像是主角身上的背包，裝著所有數值
const state = reactive({
  reputation: 0,  // 信譽值：鄉里崇拜程度
  wealth: 0,       // 財富：治療所得
  suspicion: 0,    // 疑心值：政府或新式教育者的懷疑度
  hasManual: false, // 毒蛇寶典：是否已購買
  researchCount: 0, // 研究進度：購買研究資料的次數
  hasGift: false,   // 禮物：是否持有送給官員的禮物
  treatmentCount: 0, // 本輪治療事件計數（0-4，滿5就觸發特別事件並重置）
  currentEvent: null, // 當前事件：現在正在發生的事件
  gameEnding: null,   // 結局：遊戲結束時的結局類型
  gameStarted: false, // 遊戲是否開始
  messageLog: []      // 訊息紀錄：記錄發生過的事情
})

// 隨機選擇蛇類：像是從帽子裡抽一張牌
function getRandomSnake() {
  const snake = snakeTypes[Math.floor(Math.random() * snakeTypes.length)]
  return { ...snake } // 複製一份，避免修改到原始資料
}

// 產生治療事件：農夫被蛇咬的隨機事件
function generateTreatmentEvent() {
  const snake = getRandomSnake()
  
  let displayName
  if (state.hasManual) {
    // 有買寶典：顯示真實名稱 + 有毒/無毒標註
    const venomText = snake.isVenomous ? '(有毒)' : '(無毒)'
    displayName = `${snake.name}${venomText}`
  } else {
    // 沒買寶典：只顯示真實名稱，不告訴你是否有毒
    displayName = snake.name
  }
  
  return {
    type: 'treatment', // 事件類型：治療事件
    isVenomous: snake.isVenomous, // 這條蛇實際上有毒嗎
    displayName: displayName, // 顯示給玩家的名稱
    realName: snake.name // 真實名稱（除錯用）
  }
}

// 處理治療選項：根據玩家的選擇來調整數值
function handleTreatmentChoice(choice) {
  const event = state.currentEvent
  let logMessage = ''

  // 根據選擇和蛇是否有毒來調整數值
  if (choice === 'herb') { // 敷上壓碎的草藥
    if (event.isVenomous) {
      // 被毒蛇咬：信譽不變，疑心+10，財富+10
      state.suspicion += 10
      state.wealth += 10
      logMessage = `你敷上壓碎的草藥，但這是毒蛇咬傷，村民感到懷疑。疑心值 +10，財富 +10`
    } else {
      // 被非毒蛇咬：信譽+20，疑心不變，財富+10
      state.reputation += 20
      state.wealth += 10
      logMessage = `你敷上壓碎的草藥，治好了農夫。信譽值 +20，財富 +10`
    }
  } else if (choice === 'ritual') { // 三巡祭拜與放血
    if (event.isVenomous) {
      // 被毒蛇咬：信譽不變，疑心+40，財富+40
      state.suspicion += 40
      state.wealth += 40
      logMessage = `你進行三巡祭拜與放血，村民覺得這很迷信。疑心值 +40，財富 +40`
    } else {
      // 被非毒蛇咬：信譽+40，疑心+20，財富+40
      state.reputation += 40
      state.suspicion += 20
      state.wealth += 40
      logMessage = `你進行三巡祭拜與放血，治好了農夫。信譽值 +40，疑心值 +20，財富 +40`
    }
  } else if (choice === 'refuse') { // 說自己不會治療
    // 無論是否被毒蛇咬：信譽不變，疑心-20，財富不變
    state.suspicion -= 20
    if (state.suspicion < 0) state.suspicion = 0 // 疑心值不能低於0
    logMessage = `你說自己不會治療，村民感到失望但減少了懷疑。疑心值 -20`
  }

  // 記錄訊息
  state.messageLog.push(logMessage)

  // 治療事件計數+1
  state.treatmentCount++

  return 'continue' // 繼續下一個事件
}

// 產生特別事件：根據數值來決定遇到什麼NPC
function generateSpecialEvent() {
  // 優先順序：官員詢問 > 醫師詢問 > 遊商來訪
  if (state.suspicion > 100) {
    return { type: 'official' } // 官員詢問
  } else if (state.reputation >= 100 && state.suspicion < 100) {
    return { type: 'doctor' } // 醫師詢問
  } else {
    return { type: 'merchant' } // 遊商來訪
  }
}

// 處理特別事件選項
function handleSpecialChoice(choice) {
  const event = state.currentEvent
  let logMessage = ''

  if (event.type === 'official') { // 官員詢問
    if (choice === 'lie') {
      // 說謊稱自己會治毒蛇 → 結局【治理迷信】
      state.gameEnding = 'governance'
      logMessage = `你說謊稱自己會治毒蛇，官員認為你在散布迷信。`
      return 'ending'
    } else if (choice === 'gift') {
      // 送禮 → 疑心值-40，消耗禮物
      if (state.hasGift) {
        state.suspicion -= 40
        if (state.suspicion < 0) state.suspicion = 0
        state.hasGift = false
        logMessage = `你送上禮物，官員收下後態度緩和。疑心值 -40，消耗了禮物`
        state.messageLog.push(logMessage)
        return 'continue'
      }
    }
  } else if (event.type === 'doctor') { // 醫師詢問
    if (choice === 'persuade') {
      // 說服 → 結局【傳奇醫者】
      state.gameEnding = 'legendary'
      logMessage = `你說服了醫師：「救命勝過求理...」你的名聲達到頂點。`
      return 'ending'
    } else if (choice === 'lie') {
      // 說謊 → 疑心值+40
      state.suspicion += 40
      logMessage = `你對醫師說謊，他半信半疑地離開。疑心值 +40`
      state.messageLog.push(logMessage)
      return 'continue'
    }
  } else if (event.type === 'merchant') { // 遊商來訪
    if (choice === 'manual') {
      // 購買毒蛇寶典 (-100財富)
      if (state.wealth >= 100) {
        state.wealth -= 100
        state.hasManual = true
        logMessage = `你花費 100 財富購買了毒蛇寶典，現在能辨識蛇是否有毒了。`
        state.messageLog.push(logMessage)
        return 'continue'
      } else {
        logMessage = `財富不足，無法購買毒蛇寶典（需要 100 財富）`
        return 'retry'
      }
    } else if (choice === 'research') {
      // 購買研究資料 (-100財富)
      if (state.wealth >= 100) {
        state.wealth -= 100
        state.researchCount++
        logMessage = `你花費 100 財富購買了研究資料。研究進度：${state.researchCount}/3`
        state.messageLog.push(logMessage)

        // 檢查是否達到3次研究
        if (state.researchCount >= 3) {
          state.gameEnding = 'researcher'
          return 'ending'
        }
        return 'continue'
      } else {
        logMessage = `財富不足，無法購買研究資料（需要 100 財富）`
        return 'retry'
      }
    } else if (choice === 'gift') {
      // 購買禮物 (-100財富)
      if (state.wealth >= 100) {
        state.wealth -= 100
        state.hasGift = true
        logMessage = `你花費 100 財富購買了禮物，現在可以應對官員詢問了。`
        state.messageLog.push(logMessage)
        return 'continue'
      } else {
        logMessage = `財富不足，無法購買禮物（需要 100 財富）`
        return 'retry'
      }
    } else if (choice === 'leave') {
      // 不買，離開
      logMessage = `你看了看貨物，覺得不需要，決定不買。遊商收拾東西離開了。`
      state.messageLog.push(logMessage)
      return 'continue'
    }
  }

  return 'continue'
}

// 開始新遊戲：重置所有數值
function startGame() {
  state.reputation = 0
  state.wealth = 0
  state.suspicion = 0
  state.hasManual = false
  state.researchCount = 0
  state.hasGift = false
  state.treatmentCount = 0
  state.currentEvent = null
  state.gameEnding = null
  state.gameStarted = true
  state.messageLog = []

  // 產生第一個治療事件
  nextEvent()
}

// 進入下一個事件：檢查是否該觸發特別事件
function nextEvent() {
  console.log('nextEvent 被呼叫，時間：', Date.now()) // 加入時間戳記
  // 每5次治療事件後，觸發1次特別事件（循環：5治療+1特別）
  // treatmentCount 到達5時觸發特別事件，然後重置為0
  if (state.treatmentCount >= 5) {
    state.treatmentCount = 0 // 重置計數，開始新一輪
    state.currentEvent = generateSpecialEvent()
  } else {
    state.currentEvent = generateTreatmentEvent()
  }
}


// 特別事件處理完後，強制跳到治療事件（避免卡在特別事件）
function nextAfterSpecial() {
  state.currentEvent = generateTreatmentEvent()
}

// 結局描述：遊戲結尾的訊息
const endingMessages = {
  governance: {
    title: '【治理迷信】',
    description: '你遭到日本政府對你的懷疑，招致鋃鐺入獄。'
  },
  legendary: {
    title: '【傳奇醫者】',
    description: '你的藥多次治好被咬傷的村民，名聲達到頂點，成為村里活著的傳說。'
  },
  researcher: {
    title: '【科學研究者】',
    description: '你走上了科學研究之路，過了幾年研究出了真的毒蛇解藥，成了學界傳奇。'
  }
}

// 對外暴露的接口：讓組件可以使用這些功能
export function useGame() {
  return {
    state, // 遊戲狀態
    startGame, // 開始遊戲
    nextEvent, // 下一個事件
    nextAfterSpecial, // 特別事件後跳到治療事件
    handleTreatmentChoice, // 處理治療選項
    handleSpecialChoice, // 處理特別事件選項
    endingMessages, // 結局訊息
    getRandomSnake // 除錯用：取得隨機蛇類
  }
}
