<template>
  <div class="upd-window">
    <div class="upd-titlebar">
      <span>🔄 Update Racer — Patch Before the Breach!</span>
    </div>
    <div class="upd-menubar">
      <span>Update</span><span>Security</span><span>Help</span>
    </div>

    <div class="upd-body">

      <!-- INTRO -->
      <div v-if="phase === 'intro'" class="phase-intro">
        <div class="intro-art">
          <div class="shield-wrap">
            <div class="shield">🛡️</div>
            <div class="vs">VS</div>
            <div class="hacker">💀</div>
          </div>
        </div>
        <h2>Update Racer</h2>
        <p class="intro-desc">
          A hacker is actively exploiting known vulnerabilities in your software.<br>
          You have a limited time to <strong>patch all critical systems</strong>!<br>
          Prioritize: Critical first, then High, then Medium.
        </p>
        <div class="tip-box">
          💡 <strong>Tip:</strong> Unpatched software is responsible for 60% of data breaches.
          Updates aren't optional — they're your #1 defense.
        </div>
        <button class="win95-btn primary large" @click="startGame">Launch Updates</button>
      </div>

      <!-- PLAY -->
      <div v-else-if="phase === 'play'" class="phase-play">
        <div class="status-bar">
          <div class="timer-display" :class="{ danger: timeLeft <= 15 }">
            <span>⏱</span>
            <span>{{ timeLeft }}s</span>
          </div>
          <div class="threat-meter">
            <div class="tm-label">THREAT LEVEL</div>
            <div class="tm-bar-wrap">
              <div class="tm-bar" :style="{ width: threatLevel + '%' }" :class="threatBarClass"></div>
            </div>
            <div class="tm-pct">{{ Math.floor(threatLevel) }}%</div>
          </div>
          <div class="patched-display">
            <span>✅ Patched: {{ patchedCount }}/{{ updates.length }}</span>
          </div>
          <div class="score-display">Score: {{ score }}</div>
        </div>

        <!-- Hacker log -->
        <div class="hacker-log" ref="hackerLog">
          <div class="hl-title">💀 Hacker Activity Log</div>
          <div v-for="(line, i) in hackerLines" :key="i" class="hl-line" :class="line.type">
            {{ line.text }}
          </div>
        </div>

        <!-- Updates list -->
        <div class="updates-list">
          <div class="ul-title">📋 Pending Updates</div>
          <div
            v-for="upd in updates"
            :key="upd.id"
            class="update-row"
            :class="{ patched: upd.patched, patching: upd.patching, exploited: upd.exploited }"
          >
            <div class="upd-severity" :class="upd.severity">{{ upd.severity.toUpperCase() }}</div>
            <div class="upd-info">
              <div class="upd-name">{{ upd.name }}</div>
              <div class="upd-detail">{{ upd.vulnerability }}</div>
            </div>
            <div class="upd-state" v-if="upd.patched">✅ PATCHED</div>
            <div class="upd-state exploited-label" v-else-if="upd.exploited">💀 EXPLOITED</div>
            <div class="upd-progress" v-else-if="upd.patching">
              <div class="upd-pbar-wrap">
                <div class="upd-pbar" :style="{ width: upd.patchProgress + '%' }"></div>
              </div>
              <div class="upd-ppct">{{ upd.patchProgress }}%</div>
            </div>
            <button v-else class="win95-btn patch-btn" @click="patchUpdate(upd)">
              Install Update
            </button>
          </div>
        </div>
      </div>

      <!-- RESULT -->
      <div v-else-if="phase === 'result'" class="phase-result">
        <div class="result-split">
          <div class="result-left">
            <div class="result-icon">{{ patchedCount === updates.length ? '🏆' : patchedCount >= updates.length * 0.7 ? '🛡️' : '💀' }}</div>
            <h2>{{ resultTitle }}</h2>
            <div class="final-score">{{ score }} points</div>
          </div>
          <div class="result-right">
            <div class="result-stat-row">
              <span>Patched:</span>
              <span class="stat-good">{{ patchedCount }}</span>
            </div>
            <div class="result-stat-row">
              <span>Exploited:</span>
              <span class="stat-bad">{{ exploitedCount }}</span>
            </div>
            <div class="result-stat-row">
              <span>Threat reached:</span>
              <span :class="threatLevel >= 80 ? 'stat-bad' : 'stat-ok'">{{ Math.floor(finalThreat) }}%</span>
            </div>
            <div class="result-stat-row">
              <span>Time remaining:</span>
              <span class="stat-good">{{ timeLeft }}s</span>
            </div>
          </div>
        </div>

        <div class="update-results">
          <div v-for="upd in updates" :key="upd.id" class="ur-row">
            <span class="ur-sev" :class="upd.severity">{{ upd.severity[0].toUpperCase() }}</span>
            <span class="ur-name">{{ upd.name }}</span>
            <span class="ur-mark">{{ upd.patched ? '✅' : '💀' }}</span>
          </div>
        </div>

        <div class="lesson-box">
          <strong>📚 Why updates matter:</strong> Software updates patch known vulnerabilities.
          Hackers scan the internet for unpatched systems and attack within hours of a vulnerability being published.
          Enable auto-updates wherever possible!
        </div>

        <button class="win95-btn primary large" @click="resetGame">Play Again</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const phase = ref('intro')
const timeLeft = ref(60)
const threatLevel = ref(0)
const score = ref(0)
const hackerLines = ref([])
const hackerLog = ref(null)
const patchedCount = ref(0)
const exploitedCount = ref(0)
const finalThreat = ref(0)

let gameTimer = null
let threatTimer = null

const updateTemplates = [
  { name: 'Windows OS Kernel', vulnerability: 'CVE-2025-1234: Remote Code Execution', severity: 'critical', patchTime: 6 },
  { name: 'Google Chrome', vulnerability: 'CVE-2025-5678: Use-after-free in V8 engine', severity: 'critical', patchTime: 4 },
  { name: 'Adobe Acrobat Reader', vulnerability: 'CVE-2025-2109: PDF parsing memory corruption', severity: 'high', patchTime: 5 },
  { name: 'OpenSSL Library', vulnerability: 'CVE-2025-3301: TLS handshake buffer overflow', severity: 'critical', patchTime: 7 },
  { name: 'Mozilla Firefox', vulnerability: 'CVE-2025-4412: Cross-site scripting bypass', severity: 'high', patchTime: 4 },
  { name: 'Microsoft Office', vulnerability: 'CVE-2025-6789: Macro execution sandbox escape', severity: 'high', patchTime: 5 },
  { name: 'VLC Media Player', vulnerability: 'CVE-2025-7890: Heap overflow in HEVC decoder', severity: 'medium', patchTime: 3 },
  { name: 'Java Runtime (JRE)', vulnerability: 'CVE-2025-8901: Deserialization of untrusted data', severity: 'high', patchTime: 5 },
]

const hackerAttacks = [
  { text: '> Scanning network for CVE-2025-1234...', type: 'scan' },
  { text: '> Found unpatched Windows system!', type: 'warn' },
  { text: '> Attempting RCE exploit on port 445...', type: 'attack' },
  { text: '> Deploying Cobalt Strike beacon...', type: 'attack' },
  { text: '> Exfiltrating credential database...', type: 'critical' },
  { text: '> OpenSSL exploit payload ready...', type: 'warn' },
  { text: '> Pivoting to internal network...', type: 'attack' },
  { text: '> Ransomware staging complete!', type: 'critical' },
  { text: '> Chrome V8 exploit successful!', type: 'attack' },
  { text: '> Privilege escalation complete!', type: 'critical' },
]

const updates = ref([])

const threatBarClass = computed(() => {
  if (threatLevel.value < 40) return 'low'
  if (threatLevel.value < 70) return 'med'
  return 'high'
})

const resultTitle = computed(() => {
  if (patchedCount.value === updates.value.length) return '🎉 Perfect Defense!'
  if (patchedCount.value >= updates.value.length * 0.7) return 'System Partially Protected'
  return 'System Critically Compromised'
})

function startGame() {
  // Clone and shuffle updates
  const shuffled = [...updateTemplates].sort(() => Math.random() - 0.5)
  updates.value = shuffled.map((u, i) => ({
    ...u,
    id: i,
    patched: false,
    patching: false,
    exploited: false,
    patchProgress: 0,
  }))

  score.value = 0
  timeLeft.value = 60
  threatLevel.value = 0
  patchedCount.value = 0
  exploitedCount.value = 0
  hackerLines.value = []
  phase.value = 'play'

  // Main timer
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)

  // Threat ticker — rises faster for unpatched critical vulns
  threatTimer = setInterval(async () => {
    const critUnpatched = updates.value.filter(u => u.severity === 'critical' && !u.patched && !u.patching).length
    const highUnpatched = updates.value.filter(u => u.severity === 'high' && !u.patched && !u.patching).length
    const rise = critUnpatched * 1.2 + highUnpatched * 0.5 + 0.1

    threatLevel.value = Math.min(100, threatLevel.value + rise)

    // Hacker log
    if (Math.random() < 0.4) {
      const line = hackerAttacks[Math.floor(Math.random() * hackerAttacks.length)]
      hackerLines.value.push({ ...line })
      if (hackerLines.value.length > 8) hackerLines.value.shift()
      await nextTick()
      if (hackerLog.value) hackerLog.value.scrollTop = hackerLog.value.scrollHeight
    }

    // Exploit unpatched vulns when threat hits 100
    if (threatLevel.value >= 100) {
      const victim = updates.value.find(u => !u.patched && !u.patching && !u.exploited)
      if (victim) {
        victim.exploited = true
        exploitedCount.value++
        score.value = Math.max(0, score.value - 50)
        threatLevel.value = 60 // reset partially
      }
    }

    // Win condition
    if (patchedCount.value >= updates.value.length) {
      endGame()
    }
  }, 800)
}

function patchUpdate(upd) {
  if (upd.patching || upd.patched || upd.exploited) return
  upd.patching = true
  upd.patchProgress = 0

  const ticks = upd.patchTime * 5 // each tick = 200ms
  let t = 0
  const patchInterval = setInterval(() => {
    t++
    upd.patchProgress = Math.min(100, Math.floor((t / ticks) * 100))
    if (t >= ticks) {
      clearInterval(patchInterval)
      upd.patching = false
      upd.patched = true
      patchedCount.value++
      // Score based on severity
      const pts = upd.severity === 'critical' ? 100 : upd.severity === 'high' ? 60 : 30
      score.value += pts
    }
  }, 200)
}

function endGame() {
  clearInterval(gameTimer)
  clearInterval(threatTimer)
  finalThreat.value = threatLevel.value
  phase.value = 'result'
}

function resetGame() {
  clearInterval(gameTimer)
  clearInterval(threatTimer)
  phase.value = 'intro'
}
</script>

<style scoped>
.upd-window {
  width: 720px;
  min-height: 500px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 13px;
}
.upd-titlebar {
  background: linear-gradient(90deg, #006400, #228b22);
  color: #fff;
  padding: 3px 6px;
  font-weight: bold;
}
.upd-menubar {
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 8px;
  display: flex;
  gap: 16px;
}
.upd-menubar span { cursor: pointer; padding: 1px 4px; }
.upd-menubar span:hover { background: #000080; color: #fff; }
.upd-body { padding: 16px; }

/* INTRO */
.phase-intro { text-align: center; }
.intro-art { margin-bottom: 12px; }
.shield-wrap { display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 48px; }
.vs { font-size: 20px; font-weight: bold; color: #888; }
.phase-intro h2 { font-size: 18px; color: #006400; margin-bottom: 10px; }
.intro-desc { font-size: 13px; line-height: 1.7; margin-bottom: 14px; }
.tip-box {
  background: #e8f5e9;
  border: 2px solid #008800;
  padding: 8px 14px;
  font-size: 12px;
  text-align: left;
  margin-bottom: 16px;
}

/* PLAY */
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 2px inset #808080;
  padding: 6px 10px;
  margin-bottom: 10px;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #006400;
  min-width: 60px;
}
.timer-display.danger { color: #cc0000; animation: blink 0.5s infinite; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

.threat-meter { display: flex; align-items: center; gap: 6px; flex: 1; }
.tm-label { font-size: 10px; font-weight: bold; color: #aa0000; white-space: nowrap; }
.tm-bar-wrap { flex: 1; height: 12px; background: #e0e0e0; border: 1px inset #808080; }
.tm-bar { height: 100%; transition: width 0.8s; }
.tm-bar.low { background: #008800; }
.tm-bar.med { background: #ff9900; }
.tm-bar.high { background: #cc0000; animation: throb 0.5s infinite; }
@keyframes throb { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
.tm-pct { font-size: 11px; font-weight: bold; min-width: 30px; }

.patched-display, .score-display { font-size: 12px; font-weight: bold; white-space: nowrap; }
.score-display { color: #000080; }

.hacker-log {
  background: #0a0a0a;
  border: 2px inset #808080;
  padding: 6px 10px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  height: 80px;
  overflow-y: auto;
  margin-bottom: 10px;
  color: #00ff00;
}
.hl-title { color: #ff4444; font-weight: bold; margin-bottom: 4px; }
.hl-line { margin-bottom: 1px; }
.hl-line.scan { color: #44ff44; }
.hl-line.warn { color: #ffaa00; }
.hl-line.attack { color: #ff4444; }
.hl-line.critical { color: #ff0000; animation: flash 0.3s; }
@keyframes flash { from { background: rgba(255,0,0,0.3); } to { background: transparent; } }

.updates-list { display: flex; flex-direction: column; gap: 4px; }
.ul-title { font-weight: bold; color: #006400; margin-bottom: 6px; font-size: 13px; }

.update-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 2px solid #c0c0c0;
  padding: 6px 10px;
  transition: border-color 0.3s;
}
.update-row.patched { background: #e8f5e9; border-color: #008800; opacity: 0.8; }
.update-row.patching { background: #e3f2fd; border-color: #1976d2; }
.update-row.exploited { background: #ffebee; border-color: #cc0000; }

.upd-severity {
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border: 1px solid;
  min-width: 60px;
  text-align: center;
}
.upd-severity.critical { background: #ffebee; border-color: #cc0000; color: #880000; }
.upd-severity.high { background: #fff8e1; border-color: #cc7700; color: #884400; }
.upd-severity.medium { background: #e3f2fd; border-color: #0000aa; color: #000080; }

.upd-info { flex: 1; }
.upd-name { font-weight: bold; font-size: 12px; }
.upd-detail { font-size: 10px; color: #666; font-family: 'Courier New', monospace; }

.upd-state { font-weight: bold; font-size: 11px; color: #005500; min-width: 80px; text-align: right; }
.exploited-label { color: #880000 !important; }

.upd-progress { display: flex; align-items: center; gap: 6px; min-width: 120px; }
.upd-pbar-wrap { flex: 1; height: 10px; background: #e0e0e0; border: 1px inset #808080; }
.upd-pbar { height: 100%; background: #1976d2; transition: width 0.2s; }
.upd-ppct { font-size: 10px; min-width: 28px; text-align: right; }

.patch-btn {
  font-size: 11px !important;
  padding: 2px 8px !important;
  white-space: nowrap;
}

/* RESULT */
.phase-result { padding: 8px; }
.result-split { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 14px; }
.result-left { text-align: center; min-width: 140px; }
.result-icon { font-size: 48px; }
.phase-result h2 { font-size: 15px; color: #006400; margin: 6px 0; }
.final-score { font-size: 20px; font-weight: bold; color: #000080; }
.result-right { flex: 1; background: #fff; border: 2px inset #808080; padding: 10px; }
.result-stat-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; font-size: 12px; }
.stat-good { color: #005500; font-weight: bold; }
.stat-bad { color: #880000; font-weight: bold; }
.stat-ok { color: #884400; font-weight: bold; }

.update-results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 12px;
  max-height: 140px;
  overflow-y: auto;
}
.ur-row { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #ddd; padding: 3px 8px; font-size: 11px; }
.ur-sev { font-weight: bold; font-size: 11px; padding: 1px 4px; border: 1px solid; }
.ur-sev.critical { background: #ffebee; border-color: #cc0000; color: #880000; }
.ur-sev.high { background: #fff8e1; border-color: #cc7700; color: #884400; }
.ur-sev.medium { background: #e3f2fd; border-color: #1976d2; color: #0d47a1; }
.ur-name { flex: 1; }
.ur-mark { font-size: 14px; }

.lesson-box {
  background: #fffde0;
  border: 2px solid #cc9900;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 14px;
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
.win95-btn.primary { background: #006400; color: #fff; font-weight: bold; border-color: #4caf50 #003300 #003300 #4caf50; }
.win95-btn.primary:hover { background: #008800; }
.win95-btn.large { padding: 6px 24px; font-size: 13px; display: block; margin: 0 auto; }
</style>
