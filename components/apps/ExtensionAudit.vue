<template>
  <div class="ext-window">
    <div class="ext-titlebar">
      <div class="titlebar-left">
        <span>🧩</span>
        <span>Extension Manager Pro — Security Audit</span>
      </div>
    </div>
    <div class="ext-menubar">
      <span>Extensions</span><span>Settings</span><span>Help</span>
    </div>

    <div class="ext-body">

      <!-- INTRO -->
      <div v-if="phase === 'intro'" class="phase-intro">
        <div class="intro-hero">🧩</div>
        <h2>Browser Extension Audit</h2>
        <p>
          Your browser has <strong>{{ extensions.length }} extensions</strong> installed.<br>
          Some are safe. Some are suspicious. Some are outright malicious.<br>
          <strong>Drag each extension</strong> into the correct category!
        </p>
        <div class="category-preview">
          <div class="cat-chip safe">✅ Safe &amp; Trusted</div>
          <div class="cat-chip suspicious">⚠️ Suspicious</div>
          <div class="cat-chip malicious">🚫 Malicious</div>
        </div>
        <button class="win95-btn primary large" @click="startGame">Begin Audit</button>
      </div>

      <!-- PLAY -->
      <div v-else-if="phase === 'play'" class="phase-play">
        <div class="play-header">
          <div class="score-chip">Score: <strong>{{ score }}</strong></div>
          <div class="progress-chip">{{ sorted }}/{{ extensions.length }} sorted</div>
          <div class="timer-chip" :class="{ urgent: timeLeft <= 10 }">⏱ {{ timeLeft }}s</div>
        </div>

        <!-- Extension queue -->
        <div class="ext-queue" v-if="currentExt">
          <div class="ext-card" :style="{ borderColor: extColors[currentExt.category] }">
            <div class="ext-card-icon">{{ currentExt.icon }}</div>
            <div class="ext-card-info">
              <div class="ext-name">{{ currentExt.name }}</div>
              <div class="ext-version">v{{ currentExt.version }} • {{ currentExt.publisher }}</div>
              <div class="ext-perms">
                <span v-for="p in currentExt.permissions" :key="p" class="perm-chip">{{ p }}</span>
              </div>
              <div class="ext-desc">{{ currentExt.description }}</div>
            </div>
          </div>

          <div class="choice-arrows">↓ What is this extension?</div>

          <div class="choice-row">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="cat-btn"
              :class="cat.id"
              @click="classify(cat.id)"
            >
              {{ cat.emoji }} {{ cat.label }}
            </button>
          </div>

          <div class="feedback-toast" v-if="feedback" :class="feedback.correct ? 'fb-correct' : 'fb-wrong'">
            {{ feedback.correct ? '✓ Correct!' : '✗ Wrong!' }} — {{ feedback.explanation }}
          </div>
        </div>

        <!-- Results tally -->
        <div class="tally">
          <div v-for="cat in categories" :key="cat.id" class="tally-row">
            <span class="tally-label" :class="cat.id">{{ cat.emoji }} {{ cat.label }}</span>
            <div class="tally-bar-wrap">
              <div class="tally-bar" :class="cat.id" :style="{ width: tallyWidth(cat.id) }"></div>
            </div>
            <span class="tally-count">{{ tally[cat.id] }}</span>
          </div>
        </div>
      </div>

      <!-- RESULT -->
      <div v-else-if="phase === 'result'" class="phase-result">
        <div class="result-icon">{{ score >= 70 ? '🏅' : score >= 40 ? '🤔' : '😬' }}</div>
        <h2>Audit Complete</h2>
        <div class="score-display">Final Score: <strong>{{ score }}/{{ maxScore }}</strong></div>

        <div class="results-list">
          <div v-for="ext in extensions" :key="ext.name" class="result-row">
            <span class="result-icon-sm">{{ ext.icon }}</span>
            <div class="result-ext-info">
              <div class="result-ext-name">{{ ext.name }}</div>
              <div class="result-ext-answer">
                Your answer: <span :class="ext.userAnswer === ext.category ? 'ans-correct' : 'ans-wrong'">{{ catLabel(ext.userAnswer) }}</span>
                &nbsp;|&nbsp; Correct: <span class="ans-correct">{{ catLabel(ext.category) }}</span>
              </div>
            </div>
            <span class="result-mark">{{ ext.userAnswer === ext.category ? '✓' : '✗' }}</span>
          </div>
        </div>

        <div class="lesson-box">
          <strong>🔍 Key Takeaways:</strong><br>
          Always check permissions carefully. Extensions with access to "all websites" and your clipboard are high risk. Only install from trusted publishers and keep extensions minimal.
        </div>

        <button class="win95-btn primary large" @click="resetGame">Try Again</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const phase = ref('intro')
const score = ref(0)
const sorted = ref(0)
const timeLeft = ref(45)
const feedback = ref(null)
const currentIndex = ref(0)

const maxScore = 100

let timer = null

const extColors = {
  safe: '#008800',
  suspicious: '#cc7700',
  malicious: '#cc0000'
}

const categories = [
  { id: 'safe', label: 'Safe & Trusted', emoji: '✅' },
  { id: 'suspicious', label: 'Suspicious', emoji: '⚠️' },
  { id: 'malicious', label: 'Malicious', emoji: '🚫' },
]

const allExtensions = [
  {
    name: 'uBlock Origin',
    icon: '🛡️',
    version: '1.55.0',
    publisher: 'Raymond Hill',
    permissions: ['Read all sites', 'Block content'],
    description: 'Open-source ad blocker. Widely trusted, actively maintained, open source.',
    category: 'safe',
    explanation: 'uBlock Origin is a well-known, open-source, and highly trusted ad blocker.'
  },
  {
    name: 'Free PDF Converter NOW!!!',
    icon: '📄',
    version: '2.0.1',
    publisher: 'pdf-tools-xyz.ru',
    permissions: ['Read all sites', 'Access clipboard', 'Access history', 'Manage downloads'],
    description: 'Convert any page to PDF instantly! Free forever. No limits.',
    category: 'malicious',
    explanation: 'Unknown Russian publisher, excessive permissions including clipboard access = data theft risk.'
  },
  {
    name: 'LastPass',
    icon: '🔑',
    version: '4.120.0',
    publisher: 'LogMeIn, Inc.',
    permissions: ['Read & modify all websites'],
    description: 'Reputable password manager. Fills login forms automatically.',
    category: 'safe',
    explanation: 'LastPass is a legitimate and widely used password manager from a known company.'
  },
  {
    name: 'Hover Zoom+',
    icon: '🔍',
    version: '9.1',
    publisher: 'Unknown',
    permissions: ['Read all sites', 'Access history', 'Access cookies'],
    description: 'Zoom in on images by hovering. Unknown publisher, cookie access.',
    category: 'suspicious',
    explanation: 'Hover Zoom was caught selling browsing data. Cookie access from an unknown publisher is a red flag.'
  },
  {
    name: 'YouTube™ Download Pro',
    icon: '▶️',
    version: '3.5.9',
    publisher: 'chrome-addons.net',
    permissions: ['Read all sites', 'Access clipboard', 'Access cookies', 'Manage other extensions'],
    description: 'Download any YouTube video in HD! Totally free and legal!',
    category: 'malicious',
    explanation: 'Fake downloader from a suspicious domain. Ability to "manage other extensions" = can disable your security tools.'
  },
  {
    name: 'Dark Reader',
    icon: '🌙',
    version: '4.9.61',
    publisher: 'Dark Reader Ltd',
    permissions: ['Read & modify all websites'],
    description: 'Dark mode for every website. Eye care. Open source.',
    category: 'safe',
    explanation: 'Dark Reader is a well-known open-source extension with transparent development.'
  },
  {
    name: 'Win Free iPhone 14!!!',
    icon: '📱',
    version: '1.0',
    publisher: 'prize-center.win',
    permissions: ['Read all sites', 'Access history', 'Access clipboard', 'Capture screen'],
    description: 'You have been selected! Claim your free iPhone now!',
    category: 'malicious',
    explanation: 'Classic scam extension. Screen capture + clipboard access = complete data theft.'
  },
  {
    name: 'Grammarly',
    icon: '✍️',
    version: '14.1096.0',
    publisher: 'Grammarly, Inc.',
    permissions: ['Read & modify text on all sites'],
    description: 'Grammar checker from the official Grammarly team. Widely used.',
    category: 'safe',
    explanation: 'Grammarly is a legitimate company with a well-established product.'
  },
  {
    name: 'Search Results Enhancer',
    icon: '🔎',
    version: '1.2.3',
    publisher: 'Better Search LLC',
    permissions: ['Read all sites', 'Change search settings', 'Access cookies'],
    description: 'Enhances your search results with extra links. May modify default search engine.',
    category: 'suspicious',
    explanation: 'Extensions that change your search engine often redirect searches and collect data for profit.'
  },
  {
    name: 'VPN Free — Unlimited Proxy',
    icon: '🌐',
    version: '5.0.0',
    publisher: 'freevpn-unlimited.top',
    permissions: ['Read all sites', 'Manage network requests', 'Access cookies', 'Access history'],
    description: 'Free unlimited VPN proxy. No logs! Anonymous browsing!',
    category: 'malicious',
    explanation: 'Free VPN extensions from unknown publishers often route your traffic through attacker servers — selling your data.'
  },
]

const extensions = ref([])
const currentExt = computed(() => extensions.value[currentIndex.value] ?? null)
const tally = ref({ safe: 0, suspicious: 0, malicious: 0 })

function tallyWidth(cat) {
  const total = extensions.value.length || 1
  return ((tally.value[cat] / total) * 100) + '%'
}

function catLabel(id) {
  return categories.find(c => c.id === id)?.label ?? id
}

function startGame() {
  // Shuffle and take 8
  const shuffled = [...allExtensions].sort(() => Math.random() - 0.5).slice(0, 8)
  shuffled.forEach(e => e.userAnswer = null)
  extensions.value = shuffled
  currentIndex.value = 0
  score.value = 0
  sorted.value = 0
  tally.value = { safe: 0, suspicious: 0, malicious: 0 }
  timeLeft.value = 45
  feedback.value = null
  phase.value = 'play'

  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      endGame()
    }
  }, 1000)
}

function classify(catId) {
  if (!currentExt.value) return
  const ext = currentExt.value
  const correct = ext.category === catId
  ext.userAnswer = catId

  if (correct) {
    score.value += Math.ceil(maxScore / extensions.value.length)
    feedback.value = { correct: true, explanation: ext.explanation }
  } else {
    feedback.value = { correct: false, explanation: ext.explanation }
  }

  tally.value[catId]++
  sorted.value++

  setTimeout(() => {
    feedback.value = null
    currentIndex.value++
    if (currentIndex.value >= extensions.value.length) {
      clearInterval(timer)
      endGame()
    }
  }, 1600)
}

function endGame() {
  phase.value = 'result'
  clearInterval(timer)
}

function resetGame() {
  phase.value = 'intro'
  extensions.value = []
}
</script>

<style scoped>
.ext-window {
  width: 720px;
  min-height: 500px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 13px;
}

.ext-titlebar {
  background: linear-gradient(90deg, #000080, #1084d0);
  color: #fff;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
}
.titlebar-left { display: flex; align-items: center; gap: 6px; }

.ext-menubar {
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 8px;
  display: flex;
  gap: 16px;
}
.ext-menubar span { cursor: pointer; padding: 1px 4px; }
.ext-menubar span:hover { background: #000080; color: #fff; }

.ext-body { padding: 16px; }

/* INTRO */
.phase-intro { text-align: center; padding: 20px; }
.intro-hero { font-size: 56px; margin-bottom: 10px; }
.phase-intro h2 { font-size: 18px; color: #000080; margin-bottom: 10px; }
.phase-intro p { font-size: 13px; line-height: 1.7; margin-bottom: 16px; }
.category-preview { display: flex; gap: 12px; justify-content: center; margin-bottom: 20px; }
.cat-chip { padding: 4px 14px; font-size: 12px; font-weight: bold; border: 2px solid; }
.cat-chip.safe { background: #e8f5e9; border-color: #008800; color: #005500; }
.cat-chip.suspicious { background: #fff8e1; border-color: #cc7700; color: #884400; }
.cat-chip.malicious { background: #ffebee; border-color: #cc0000; color: #880000; }

/* PLAY */
.phase-play { display: flex; flex-direction: column; gap: 12px; }

.play-header { display: flex; gap: 12px; align-items: center; }
.score-chip, .progress-chip, .timer-chip {
  padding: 3px 10px;
  border: 2px inset #808080;
  background: #fff;
  font-size: 12px;
}
.timer-chip.urgent { background: #ffdddd; color: #aa0000; font-weight: bold; animation: pulse 0.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

.ext-queue { display: flex; flex-direction: column; gap: 10px; }

.ext-card {
  background: #fff;
  border: 3px solid #808080;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.ext-card-icon { font-size: 32px; flex-shrink: 0; }
.ext-card-info { flex: 1; }
.ext-name { font-weight: bold; font-size: 14px; color: #000080; }
.ext-version { font-size: 11px; color: #666; margin-bottom: 6px; }
.ext-perms { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
.perm-chip {
  background: #ffebee;
  border: 1px solid #cc0000;
  color: #880000;
  padding: 1px 6px;
  font-size: 10px;
  border-radius: 2px;
}
.ext-desc { font-size: 12px; color: #333; }

.choice-arrows { text-align: center; color: #444; font-size: 12px; }

.choice-row { display: flex; gap: 10px; justify-content: center; }
.cat-btn {
  padding: 8px 20px;
  font-family: 'Tahoma', sans-serif;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid;
  transition: transform 0.1s;
}
.cat-btn:active { transform: scale(0.96); }
.cat-btn.safe { background: #e8f5e9; border-color: #005500; color: #003300; }
.cat-btn.safe:hover { background: #c8e6c9; }
.cat-btn.suspicious { background: #fff8e1; border-color: #aa5500; color: #663300; }
.cat-btn.suspicious:hover { background: #ffe082; }
.cat-btn.malicious { background: #ffebee; border-color: #880000; color: #550000; }
.cat-btn.malicious:hover { background: #ffcdd2; }

.feedback-toast {
  padding: 8px 14px;
  font-size: 12px;
  border: 2px solid;
  animation: slideIn 0.2s ease;
}
@keyframes slideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.fb-correct { background: #e8f5e9; border-color: #008800; color: #003300; }
.fb-wrong { background: #ffebee; border-color: #cc0000; color: #880000; }

.tally { display: flex; flex-direction: column; gap: 4px; }
.tally-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.tally-label { width: 130px; font-weight: bold; }
.tally-label.safe { color: #005500; }
.tally-label.suspicious { color: #884400; }
.tally-label.malicious { color: #880000; }
.tally-bar-wrap { flex: 1; background: #e0e0e0; border: 1px inset #808080; height: 10px; }
.tally-bar { height: 100%; transition: width 0.4s; }
.tally-bar.safe { background: #008800; }
.tally-bar.suspicious { background: #ff9900; }
.tally-bar.malicious { background: #cc0000; }
.tally-count { width: 20px; text-align: right; }

/* RESULT */
.phase-result { padding: 16px; }
.result-icon { font-size: 48px; text-align: center; margin-bottom: 6px; }
.phase-result h2 { text-align: center; font-size: 18px; color: #000080; margin-bottom: 6px; }
.score-display { text-align: center; font-size: 16px; margin-bottom: 14px; }

.results-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; max-height: 200px; overflow-y: auto; }
.result-row { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #ddd; padding: 6px 10px; }
.result-icon-sm { font-size: 20px; }
.result-ext-info { flex: 1; }
.result-ext-name { font-weight: bold; font-size: 12px; }
.result-ext-answer { font-size: 11px; color: #444; }
.ans-correct { color: #005500; font-weight: bold; }
.ans-wrong { color: #aa0000; font-weight: bold; }
.result-mark { font-size: 16px; font-weight: bold; }

.lesson-box {
  background: #fffde0;
  border: 2px solid #cc9900;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Buttons */
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
.win95-btn.primary { background: #000080; color: #fff; font-weight: bold; border-color: #4444aa #000044 #000044 #4444aa; }
.win95-btn.primary:hover { background: #0000aa; }
.win95-btn.large { padding: 6px 24px; font-size: 13px; display: block; margin: 0 auto; }
</style>
