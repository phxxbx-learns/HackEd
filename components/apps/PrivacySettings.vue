<template>
  <div class="priv-window">
    <div class="priv-titlebar">
      <span>🔒 Privacy Control Panel</span>
    </div>
    <div class="priv-menubar">
      <span>Privacy</span><span>Settings</span><span>About</span>
    </div>

    <div class="priv-body">

      <!-- INTRO -->
      <div v-if="phase === 'intro'" class="phase-intro">
        <div class="priv-logo">🕵️</div>
        <h2>Privacy Audit Simulator</h2>
        <p class="intro-desc">
          Apps on your "computer" are requesting suspicious permissions.<br>
          Review each app's permissions and decide what to <strong>Allow</strong> or <strong>Deny</strong>.<br>
          Then answer a quick question to earn maximum points!
        </p>
        <div class="intro-examples">
          <div class="ex-row">
            <span class="ex-icon good">✅</span>
            <span>Flashlight app — requesting camera flash: <strong>OK</strong></span>
          </div>
          <div class="ex-row">
            <span class="ex-icon bad">🚫</span>
            <span>Flashlight app — requesting your contacts list: <strong>NOT OK</strong></span>
          </div>
        </div>
        <div class="privacy-score-preview">
          Your Privacy Score: <strong>0 / 100</strong> — Let's fix that!
        </div>
        <button class="win95-btn primary large" @click="startGame">Start Privacy Audit</button>
      </div>

      <!-- PLAY -->
      <div v-else-if="phase === 'play'" class="phase-play">
        <div class="app-audit-header">
          <div class="audit-progress">App {{ currentAppIdx + 1 }} of {{ apps.length }}</div>
          <div class="priv-score-display">Privacy Score: {{ privacyScore }}</div>
          <div class="time-chip" :class="{ urgent: timeLeft <= 10 }">⏱ {{ timeLeft }}s</div>
        </div>

        <div class="app-card" v-if="currentApp">
          <div class="app-top">
            <div class="app-icon-big">{{ currentApp.icon }}</div>
            <div class="app-meta">
              <div class="app-name-big">{{ currentApp.name }}</div>
              <div class="app-cat">{{ currentApp.category }}</div>
              <div class="app-desc">{{ currentApp.description }}</div>
            </div>
          </div>

          <!-- Question mode -->
          <div v-if="currentQuestion !== null && !questionAnswered" class="question-mode">
            <div class="q-banner">❓ Quick Question!</div>
            <div class="q-text">{{ currentQuestion.text }}</div>
            <div class="q-choices">
              <button
                v-for="opt in currentQuestion.options"
                :key="opt.id"
                class="q-btn"
                @click="answerQuestion(opt)"
              >{{ opt.text }}</button>
            </div>
          </div>

          <!-- Permission review mode -->
          <div v-else-if="currentQuestion === null || questionAnswered" class="perms-mode">
            <div class="perms-header">Requested Permissions:</div>
            <div class="perms-list">
              <div
                v-for="perm in currentApp.permissions"
                :key="perm.id"
                class="perm-row"
                :class="{ 'perm-allowed': perm.userChoice === 'allow', 'perm-denied': perm.userChoice === 'deny' }"
              >
                <div class="perm-icon">{{ perm.icon }}</div>
                <div class="perm-info">
                  <div class="perm-name">{{ perm.name }}</div>
                  <div class="perm-why">{{ perm.why }}</div>
                </div>
                <div class="perm-risk" :class="'risk-' + perm.risk">{{ perm.risk.toUpperCase() }}</div>
                <div class="perm-actions" v-if="perm.userChoice === null">
                  <button class="perm-btn allow" @click="setPerm(perm, 'allow')">Allow</button>
                  <button class="perm-btn deny" @click="setPerm(perm, 'deny')">Deny</button>
                </div>
                <div v-else class="perm-chosen" :class="perm.userChoice">
                  {{ perm.userChoice === 'allow' ? '✅ Allowed' : '🚫 Denied' }}
                </div>
              </div>
            </div>

            <div class="perm-feedback" v-if="permFeedback">
              <span :class="permFeedback.good ? 'fb-good' : 'fb-bad'">
                {{ permFeedback.good ? '✓ Good call!' : '⚠ Bad choice!' }}
              </span>
              {{ permFeedback.message }}
            </div>

            <div class="app-verdict" v-if="allPermsSet">
              <button class="win95-btn primary" @click="nextApp">
                {{ currentAppIdx + 1 < apps.length ? 'Next App →' : 'See Results' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RESULT -->
      <div v-else-if="phase === 'result'" class="phase-result">
        <div class="score-ring">
          <div class="ring-val">{{ privacyScore }}</div>
          <div class="ring-label">Privacy Score</div>
        </div>
        <h2>{{ resultTitle }}</h2>

        <div class="apps-summary">
          <div v-for="app in apps" :key="app.name" class="app-summary-row">
            <span class="aps-icon">{{ app.icon }}</span>
            <span class="aps-name">{{ app.name }}</span>
            <div class="aps-perms">
              <span v-for="p in app.permissions" :key="p.id" class="aps-perm-dot" :class="p.userChoice === p.correct ? 'dot-good' : 'dot-bad'" :title="p.name"></span>
            </div>
            <span class="aps-score" :class="app.appScore > 0 ? 'good' : 'bad'">{{ app.appScore >= 0 ? '+' : '' }}{{ app.appScore }}</span>
          </div>
        </div>

        <div class="lesson-box">
          <strong>🔒 Privacy Principles:</strong><br>
          • Only grant permissions that make sense for the app's purpose<br>
          • "Location always on" for a simple game? Big red flag!<br>
          • Regularly review app permissions in your phone/computer settings<br>
          • Read privacy policies — if data is sold, you're the product
        </div>

        <button class="win95-btn primary large" @click="resetGame">Audit Again</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const phase = ref('intro')
const privacyScore = ref(50)
const currentAppIdx = ref(0)
const permFeedback = ref(null)
const questionAnswered = ref(false)
const currentQuestion = ref(null)
const timeLeft = ref(90)
let timer = null

const apps = ref([
  {
    name: 'FunFlashlight',
    icon: '🔦',
    category: 'Utility',
    description: 'A simple flashlight app that turns on your camera flash.',
    appScore: 0,
    permissions: [
      { id: 'cam', name: 'Camera (Flash only)', icon: '📷', why: 'Needed to activate the LED flash', risk: 'low', correct: 'allow', userChoice: null },
      { id: 'loc', name: 'Location (Always On)', icon: '📍', why: 'To show nearby stores offering discounts', risk: 'high', correct: 'deny', userChoice: null },
      { id: 'contacts', name: 'Access Contacts', icon: '👥', why: 'To help you share the app with friends', risk: 'high', correct: 'deny', userChoice: null },
    ],
    question: {
      text: 'A flashlight app wants to know your location "always." Why is this suspicious?',
      options: [
        { id: 'a', text: 'Flashlights need GPS to work', correct: false },
        { id: 'b', text: 'The app may be harvesting location data to sell to advertisers', correct: true },
        { id: 'c', text: 'It needs location for the light to be brighter', correct: false },
      ],
      explanation: 'A flashlight only needs camera access. Constant location tracking has nothing to do with its purpose — it\'s data harvesting.'
    }
  },
  {
    name: 'QuickNotes',
    icon: '📝',
    category: 'Productivity',
    description: 'A simple note-taking app for quick text notes.',
    appScore: 0,
    permissions: [
      { id: 'storage', name: 'Storage Access', icon: '💾', why: 'To save your notes locally', risk: 'low', correct: 'allow', userChoice: null },
      { id: 'mic', name: 'Microphone (Always On)', icon: '🎤', why: 'For voice-to-text notes', risk: 'medium', correct: 'deny', userChoice: null },
      { id: 'internet', name: 'Full Network Access', icon: '🌐', why: 'To sync notes to the cloud', risk: 'medium', correct: 'allow', userChoice: null },
      { id: 'phone', name: 'Read Phone State & ID', icon: '📱', why: 'To identify your device', risk: 'high', correct: 'deny', userChoice: null },
    ],
    question: {
      text: 'What does "microphone always on" mean in practice?',
      options: [
        { id: 'a', text: 'The app can listen to your conversations at any time', correct: true },
        { id: 'b', text: 'The app only records when you tap the mic button', correct: false },
        { id: 'c', text: 'The app controls speaker volume', correct: false },
      ],
      explanation: '"Always on" microphone access means the app can technically record audio at any time, even when you\'re not using it.'
    }
  },
  {
    name: 'CoolWeather',
    icon: '🌤️',
    category: 'Weather',
    description: 'Shows local weather forecasts and alerts.',
    appScore: 0,
    permissions: [
      { id: 'loc_weather', name: 'Location (While Using)', icon: '📍', why: 'To show weather for your current area', risk: 'low', correct: 'allow', userChoice: null },
      { id: 'cam_weather', name: 'Camera Access', icon: '📷', why: 'To take photos of the sky for analysis', risk: 'medium', correct: 'deny', userChoice: null },
      { id: 'notif', name: 'Notifications', icon: '🔔', why: 'To send severe weather alerts', risk: 'low', correct: 'allow', userChoice: null },
      { id: 'calend', name: 'Calendar Read/Write', icon: '📅', why: 'To add weather events to your calendar', risk: 'high', correct: 'deny', userChoice: null },
    ],
    question: null
  },
  {
    name: 'SpeedBooster Pro',
    icon: '🚀',
    category: 'System Utility',
    description: 'Claims to speed up your device by cleaning RAM.',
    appScore: 0,
    permissions: [
      { id: 'admin', name: 'Device Administrator', icon: '👑', why: 'To deeply clean and optimize the system', risk: 'high', correct: 'deny', userChoice: null },
      { id: 'all_apps', name: 'Read All Installed Apps', icon: '📲', why: 'To identify apps consuming resources', risk: 'medium', correct: 'deny', userChoice: null },
      { id: 'internet_sb', name: 'Network Access', icon: '🌐', why: 'To download optimization databases', risk: 'high', correct: 'deny', userChoice: null },
    ],
    question: {
      text: '"RAM cleaners" and "speed booster" apps — what do security experts say about them?',
      options: [
        { id: 'a', text: 'They are essential for modern devices', correct: false },
        { id: 'b', text: 'They are mostly scams that do nothing useful and often contain adware or spyware', correct: true },
        { id: 'c', text: 'They are only useful on Windows XP', correct: false },
      ],
      explanation: 'Modern operating systems manage RAM automatically. "Booster" apps are widely considered ineffective and often malicious. Avoid them entirely.'
    }
  },
])

const currentApp = computed(() => apps.value[currentAppIdx.value])
const allPermsSet = computed(() => currentApp.value?.permissions.every(p => p.userChoice !== null) ?? false)

const resultTitle = computed(() => {
  if (privacyScore.value >= 80) return '🏆 Privacy Champion!'
  if (privacyScore.value >= 60) return '✅ Privacy Aware'
  if (privacyScore.value >= 40) return '⚠️ Needs Improvement'
  return '🚨 Privacy at Risk'
})

function startGame() {
  privacyScore.value = 50
  currentAppIdx.value = 0
  questionAnswered.value = false
  currentQuestion.value = apps.value[0].question
  permFeedback.value = null
  timeLeft.value = 90
  phase.value = 'play'

  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      phase.value = 'result'
    }
  }, 1000)
}

function answerQuestion(opt) {
  questionAnswered.value = true
  if (opt.correct) {
    privacyScore.value = Math.min(100, privacyScore.value + 10)
  } else {
    privacyScore.value = Math.max(0, privacyScore.value - 5)
  }
}

function setPerm(perm, choice) {
  perm.userChoice = choice
  const correct = choice === perm.correct
  const pts = perm.risk === 'high' ? 10 : perm.risk === 'medium' ? 5 : 3

  if (correct) {
    privacyScore.value = Math.min(100, privacyScore.value + pts)
    currentApp.value.appScore += pts
    permFeedback.value = {
      good: true,
      message: `+${pts} pts — ${choice === 'deny' ? 'Denying this unnecessary permission protects your privacy.' : 'This permission is genuinely needed for the app to function.'}`
    }
  } else {
    privacyScore.value = Math.max(0, privacyScore.value - pts)
    currentApp.value.appScore -= pts
    permFeedback.value = {
      good: false,
      message: `${choice === 'allow' ? 'This permission is unnecessary and could be used to track or exploit you.' : 'This permission is actually required for the app\'s core function.'}`
    }
  }

  setTimeout(() => { permFeedback.value = null }, 2000)
}

function nextApp() {
  if (currentAppIdx.value + 1 >= apps.value.length) {
    clearInterval(timer)
    phase.value = 'result'
  } else {
    currentAppIdx.value++
    questionAnswered.value = false
    currentQuestion.value = apps.value[currentAppIdx.value].question
    permFeedback.value = null
  }
}

function resetGame() {
  clearInterval(timer)
  apps.value.forEach(app => {
    app.permissions.forEach(p => { p.userChoice = null })
    app.appScore = 0
  })
  phase.value = 'intro'
}
</script>

<style scoped>
.priv-window {
  width: 700px;
  min-height: 500px;
  background: #c0c0c0;
  border: 2px solid; border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 13px;
}
.priv-titlebar {
  background: linear-gradient(90deg, #4a0070, #7b1fa2);
  color: #fff;
  padding: 3px 6px;
  font-weight: bold;
}
.priv-menubar {
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 8px;
  display: flex;
  gap: 16px;
}
.priv-menubar span { cursor: pointer; padding: 1px 4px; }
.priv-menubar span:hover { background: #000080; color: #fff; }
.priv-body { padding: 16px; }

/* INTRO */
.phase-intro { text-align: center; padding: 10px; }
.priv-logo { font-size: 56px; margin-bottom: 8px; }
.phase-intro h2 { font-size: 18px; color: #4a0070; margin-bottom: 10px; }
.intro-desc { font-size: 13px; line-height: 1.7; margin-bottom: 14px; }
.intro-examples { display: flex; flex-direction: column; gap: 6px; align-items: center; margin-bottom: 14px; }
.ex-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.ex-icon { font-size: 16px; }
.privacy-score-preview { background: #ede7f6; border: 2px solid #7b1fa2; padding: 8px 16px; font-size: 14px; display: inline-block; margin-bottom: 16px; }

/* PLAY */
.app-audit-header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
.audit-progress { font-size: 12px; color: #444; }
.priv-score-display { font-weight: bold; color: #4a0070; font-size: 14px; }
.time-chip { padding: 3px 10px; border: 2px inset #808080; background: #fff; font-size: 12px; font-weight: bold; }
.time-chip.urgent { background: #ffdddd; color: #cc0000; animation: urgpulse 0.5s infinite; }
@keyframes urgpulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

.app-card {
  background: #fff;
  border: 2px inset #808080;
  padding: 14px;
}
.app-top { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0; }
.app-icon-big { font-size: 40px; flex-shrink: 0; }
.app-name-big { font-size: 16px; font-weight: bold; color: #000080; }
.app-cat { font-size: 11px; color: #666; margin-bottom: 4px; }
.app-desc { font-size: 12px; color: #333; }

/* Question mode */
.question-mode { background: #f3e5f5; border: 2px solid #7b1fa2; padding: 12px; margin-bottom: 12px; }
.q-banner { color: #4a0070; font-weight: bold; font-size: 13px; margin-bottom: 8px; }
.q-text { font-size: 13px; margin-bottom: 10px; line-height: 1.5; }
.q-choices { display: flex; flex-direction: column; gap: 5px; }
.q-btn {
  padding: 6px 12px;
  background: #fff;
  border: 2px solid; border-color: #fff #808080 #808080 #fff;
  text-align: left;
  cursor: pointer;
  font-family: 'Tahoma', sans-serif;
  font-size: 12px;
  transition: background 0.1s;
}
.q-btn:hover { background: #e8d5f5; border-color: #7b1fa2; }

/* Permissions */
.perms-header { font-weight: bold; color: #4a0070; margin-bottom: 8px; }
.perms-list { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
.perm-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  transition: background 0.2s;
}
.perm-row.perm-allowed { background: #e8f5e9; border-color: #008800; }
.perm-row.perm-denied { background: #ffebee; border-color: #cc0000; }
.perm-icon { font-size: 18px; flex-shrink: 0; }
.perm-info { flex: 1; }
.perm-name { font-weight: bold; font-size: 12px; }
.perm-why { font-size: 10px; color: #666; }
.perm-risk {
  font-size: 10px;
  font-weight: bold;
  padding: 1px 6px;
  border: 1px solid;
  min-width: 50px;
  text-align: center;
}
.risk-low { background: #e8f5e9; border-color: #008800; color: #005500; }
.risk-medium { background: #fff8e1; border-color: #cc7700; color: #664400; }
.risk-high { background: #ffebee; border-color: #cc0000; color: #880000; }

.perm-actions { display: flex; gap: 4px; }
.perm-btn {
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
  font-family: 'Tahoma', sans-serif;
  border: 2px solid; border-color: #fff #808080 #808080 #fff;
  font-weight: bold;
}
.perm-btn.allow { background: #e8f5e9; color: #005500; }
.perm-btn.allow:hover { background: #c8e6c9; }
.perm-btn.deny { background: #ffebee; color: #880000; }
.perm-btn.deny:hover { background: #ffcdd2; }
.perm-chosen { font-size: 11px; font-weight: bold; min-width: 70px; text-align: center; }
.perm-chosen.allow { color: #005500; }
.perm-chosen.deny { color: #880000; }

.perm-feedback { padding: 6px 10px; font-size: 12px; border: 1px solid #ddd; background: #fafafa; margin-bottom: 8px; }
.fb-good { color: #005500; font-weight: bold; margin-right: 4px; }
.fb-bad { color: #880000; font-weight: bold; margin-right: 4px; }

.app-verdict { text-align: right; margin-top: 10px; }

/* RESULT */
.phase-result { text-align: center; padding: 10px; }
.score-ring {
  width: 100px; height: 100px;
  border: 6px solid #7b1fa2;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.ring-val { font-size: 28px; font-weight: bold; color: #4a0070; }
.ring-label { font-size: 10px; color: #666; }
.phase-result h2 { font-size: 17px; color: #4a0070; margin-bottom: 14px; }

.apps-summary { background: #fff; border: 2px inset #808080; padding: 10px; margin-bottom: 12px; text-align: left; }
.app-summary-row { display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: 1px solid #eee; }
.aps-icon { font-size: 20px; }
.aps-name { flex: 1; font-size: 12px; font-weight: bold; }
.aps-perms { display: flex; gap: 3px; }
.aps-perm-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.dot-good { background: #008800; }
.dot-bad { background: #cc0000; }
.aps-score { font-weight: bold; font-size: 13px; }
.aps-score.good { color: #005500; }
.aps-score.bad { color: #880000; }

.lesson-box {
  background: #fffde0;
  border: 2px solid #cc9900;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.8;
  margin-bottom: 14px;
  text-align: left;
}

.win95-btn {
  border: 2px solid; border-color: #fff #808080 #808080 #fff;
  background: #c0c0c0;
  padding: 3px 12px;
  font-family: 'Tahoma', sans-serif;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 1px 1px 0 #000;
}
.win95-btn:hover { background: #d4d4d4; }
.win95-btn:active { border-color: #808080 #fff #fff #808080; box-shadow: none; }
.win95-btn.primary { background: #4a0070; color: #fff; font-weight: bold; border-color: #9c27b0 #1a0030 #1a0030 #9c27b0; }
.win95-btn.primary:hover { background: #7b1fa2; }
.win95-btn.large { padding: 6px 24px; font-size: 13px; display: block; margin: 0 auto; }
</style>
