<template>
  <div class="pw-window">
    <!-- Title Bar -->
    <div class="pw-titlebar">
      <div class="pw-titlebar-left">
        <span class="pw-icon">🔐</span>
        <span>Password Defense Terminal</span>
      </div>
      <div class="pw-titlebar-right">
        <button class="win95-btn small" @click="resetGame">↺</button>
      </div>
    </div>

    <!-- Menu Bar -->
    <div class="pw-menubar">
      <span>Game</span><span>Help</span><span>View</span>
    </div>

    <div class="pw-body">

      <!-- INTRO SCREEN -->
      <div v-if="phase === 'intro'" class="phase-intro">
        <div class="intro-icon">🔓</div>
        <h2>BRUTE FORCE INCOMING</h2>
        <p class="intro-desc">
          A hacker's script is targeting your account.<br>
          Create a password <strong>strong enough</strong> to outlast the attack!<br>
          The stronger your password, the longer it takes to crack.
        </p>
        <div class="intro-rules">
          <div class="rule-row"><span class="rule-badge bad">WEAK</span> Cracks in seconds</div>
          <div class="rule-row"><span class="rule-badge ok">MEDIUM</span> Buys you some time</div>
          <div class="rule-row"><span class="rule-badge good">STRONG</span> Hacker gives up!</div>
        </div>
        <button class="win95-btn primary large" @click="phase = 'play'">Start Mission</button>
      </div>

      <!-- PLAY SCREEN -->
      <div v-else-if="phase === 'play'" class="phase-play">
        <!-- Attacker section -->
        <div class="attacker-panel">
          <div class="attacker-header">
            <span class="blink-dot" :class="{ active: cracking }"></span>
            <span>{{ crackerLabel }}</span>
          </div>
          <div class="terminal-lines" ref="terminalRef">
            <div v-for="(line, i) in terminalLog" :key="i" class="t-line" :class="line.type">
              {{ line.text }}
            </div>
          </div>
          <!-- Crack progress -->
          <div class="crack-bar-wrap">
            <div class="crack-bar-label">CRACK PROGRESS</div>
            <div class="crack-bar-track">
              <div class="crack-bar-fill" :style="{ width: crackProgress + '%' }" :class="crackBarClass"></div>
            </div>
            <div class="crack-bar-pct">{{ Math.floor(crackProgress) }}%</div>
          </div>
          <div class="time-left-display" v-if="cracking">
            ⏱ {{ timeLeftLabel }} remaining
          </div>
        </div>

        <!-- Password input section -->
        <div class="input-panel">
          <label class="field-label">YOUR PASSWORD</label>
          <div class="pw-input-wrap">
            <input
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              class="pw-input"
              placeholder="Type a strong password..."
              :disabled="cracking || phase !== 'play'"
              @input="analyzePassword"
              @keydown.enter="submitPassword"
              maxlength="64"
            />
            <button class="toggle-eye" @click="showPw = !showPw">{{ showPw ? '🙈' : '👁' }}</button>
          </div>

          <!-- Strength meter -->
          <div class="strength-meter">
            <div class="strength-bars">
              <div v-for="i in 5" :key="i" class="s-bar" :class="{ filled: strengthScore >= i, color0: strengthScore < 2, color1: strengthScore === 2, color2: strengthScore === 3, color3: strengthScore >= 4 }"></div>
            </div>
            <span class="strength-label" :class="'sl' + strengthScore">{{ strengthLabel }}</span>
          </div>

          <!-- Checklist -->
          <div class="checklist">
            <div v-for="rule in rules" :key="rule.id" class="check-row" :class="{ pass: rule.pass }">
              <span class="check-icon">{{ rule.pass ? '✓' : '✗' }}</span>
              {{ rule.label }}
            </div>
          </div>

          <button
            class="win95-btn primary"
            :disabled="cracking || password.length < 1"
            @click="submitPassword"
          >
            {{ cracking ? 'Defending...' : 'Lock It In!' }}
          </button>

          <button class="win95-btn" style="margin-left:8px" @click="generateSuggestion">💡 Suggest</button>
          <div class="suggestion-box" v-if="suggestion">
            <strong>Try:</strong> {{ suggestion }}
          </div>
        </div>
      </div>

      <!-- RESULT SCREEN -->
      <div v-else-if="phase === 'result'" class="phase-result">
        <div class="result-icon">{{ won ? '🏆' : '💀' }}</div>
        <h2 :class="won ? 'result-win' : 'result-lose'">{{ won ? 'HACKER DEFEATED!' : 'ACCOUNT COMPROMISED' }}</h2>
        <p class="result-sub">{{ resultMessage }}</p>

        <div class="result-stats">
          <div class="stat-box">
            <div class="stat-val">{{ finalPassword }}</div>
            <div class="stat-key">Your Password</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">{{ finalStrength }}</div>
            <div class="stat-key">Strength</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">{{ crackTimeLabel }}</div>
            <div class="stat-key">Time to Crack</div>
          </div>
        </div>

        <div class="lesson-box">
          <strong>📚 Lesson:</strong> {{ lesson }}
        </div>

        <button class="win95-btn primary large" @click="resetGame">Play Again</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const phase = ref('intro')
const password = ref('')
const showPw = ref(false)
const cracking = ref(false)
const crackProgress = ref(0)
const won = ref(false)
const suggestion = ref('')
const terminalLog = ref([])
const terminalRef = ref(null)
const finalPassword = ref('')
const finalStrength = ref('')
const crackTimeLabel = ref('')
const crackerLabel = ref('[ HACKER ] Idle...')
const timeLeftSeconds = ref(0)

const strengthScore = ref(0)
const strengthLabel = ref('No password')

const rules = ref([
  { id: 'len', label: 'At least 12 characters', pass: false },
  { id: 'upper', label: 'Uppercase letter (A-Z)', pass: false },
  { id: 'lower', label: 'Lowercase letter (a-z)', pass: false },
  { id: 'num', label: 'Number (0-9)', pass: false },
  { id: 'sym', label: 'Special character (!@#$...)', pass: false },
])

const crackBarClass = computed(() => {
  if (crackProgress.value < 40) return 'safe'
  if (crackProgress.value < 75) return 'warn'
  return 'danger'
})

const timeLeftLabel = computed(() => {
  const s = Math.ceil(timeLeftSeconds.value)
  if (s >= 60) return `${Math.floor(s / 60)}m ${s % 60}s`
  return `${s}s`
})

const resultMessage = computed(() => {
  if (won.value) return 'Your strong password held up against the brute-force attack. The attacker gave up!'
  return 'Your password was too weak. The attacker cracked it and gained access to your account.'
})

const lesson = computed(() => {
  if (won.value) return 'Great job! A long password with mixed characters is exponentially harder to crack. Always use a password manager for unique passwords on every site.'
  return 'Short or simple passwords can be cracked in milliseconds. Use at least 12 characters with uppercase, lowercase, numbers, and symbols.'
})

function analyzePassword() {
  const pw = password.value
  rules.value[0].pass = pw.length >= 12
  rules.value[1].pass = /[A-Z]/.test(pw)
  rules.value[2].pass = /[a-z]/.test(pw)
  rules.value[3].pass = /[0-9]/.test(pw)
  rules.value[4].pass = /[^A-Za-z0-9]/.test(pw)

  const passed = rules.value.filter(r => r.pass).length
  const lenBonus = pw.length >= 20 ? 1 : 0
  const score = Math.min(5, passed + lenBonus)
  strengthScore.value = score

  const labels = ['', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong']
  strengthLabel.value = pw.length === 0 ? 'No password' : labels[score]
  suggestion.value = ''
}

function getCrackSeconds(score) {
  const map = { 0: 4, 1: 8, 2: 18, 3: 40, 4: 80, 5: 999 }
  return map[score] ?? 4
}

function getCrackTimeLabel(score) {
  const map = {
    0: 'Instantly',
    1: '< 1 minute',
    2: 'A few minutes',
    3: 'Several hours',
    4: 'Years',
    5: 'Centuries (hacker gives up!)'
  }
  return map[score] ?? 'Unknown'
}

let crackerInterval = null

function submitPassword() {
  if (!password.value.trim() || cracking.value) return
  cracking.value = true
  crackProgress.value = 0
  terminalLog.value = []
  finalPassword.value = password.value
  finalStrength.value = strengthLabel.value
  crackerLabel.value = '[ HACKER ] ATTACKING...'

  const score = strengthScore.value
  const totalSecs = getCrackSeconds(score)
  timeLeftSeconds.value = totalSecs
  crackTimeLabel.value = getCrackTimeLabel(score)

  const attacks = [
    { t: 'cmd', text: '> Starting dictionary attack...' },
    { t: 'cmd', text: '> Trying common passwords...' },
    { t: 'cmd', text: '> Switching to brute force mode...' },
    { t: 'cmd', text: '> Trying character combinations...' },
    { t: 'cmd', text: '> Accelerating with GPU cluster...' },
    { t: 'warn', text: '! Password hash captured' },
    { t: 'warn', text: '! Entropy analysis complete' },
    { t: 'err', text: '!! 50,000 attempts/sec' },
    { t: 'err', text: '!! Mutation engine active' },
  ]

  let attackIdx = 0
  const tickMs = 200
  const totalTicks = (totalSecs * 1000) / tickMs
  let tick = 0

  crackerInterval = setInterval(async () => {
    tick++
    crackProgress.value = Math.min(100, (tick / totalTicks) * 100)
    timeLeftSeconds.value = Math.max(0, totalSecs - (tick * tickMs / 1000))

    if (tick % Math.ceil(totalTicks / attacks.length) === 0 && attackIdx < attacks.length) {
      terminalLog.value.push(attacks[attackIdx++])
      await nextTick()
      if (terminalRef.value) terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }

    if (tick >= totalTicks) {
      clearInterval(crackerInterval)
      cracking.value = false
      won.value = score >= 4
      if (won.value) {
        terminalLog.value.push({ t: 'ok', text: '> FAIL: Password too complex. Aborting.' })
        crackerLabel.value = '[ HACKER ] GAVE UP'
      } else {
        terminalLog.value.push({ t: 'err', text: '!! SUCCESS: Password cracked!' })
        crackerLabel.value = '[ HACKER ] ACCESS GRANTED'
      }
      phase.value = 'result'
    }
  }, tickMs)
}

const suggestions = [
  'Tr0ub4dor&3xample!',
  'M0unt@in-D3w#2025',
  'C@t$&D0gs!Never99',
  'Purpl3-Rain!SecUre',
  'X#9mK!vQ2@wLpZ$8n',
]

function generateSuggestion() {
  suggestion.value = suggestions[Math.floor(Math.random() * suggestions.length)]
}

function resetGame() {
  clearInterval(crackerInterval)
  phase.value = 'intro'
  password.value = ''
  cracking.value = false
  crackProgress.value = 0
  terminalLog.value = []
  strengthScore.value = 0
  strengthLabel.value = 'No password'
  rules.value.forEach(r => r.pass = false)
  suggestion.value = ''
  won.value = false
}
</script>

<style scoped>
.pw-window {
  width: 780px;
  min-height: 520px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 13px;
  user-select: none;
}

.pw-titlebar {
  background: linear-gradient(90deg, #000080, #1084d0);
  color: #fff;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 13px;
}
.pw-titlebar-left { display: flex; align-items: center; gap: 6px; }
.pw-icon { font-size: 14px; }
.pw-menubar {
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 8px;
  display: flex;
  gap: 16px;
  font-size: 13px;
}
.pw-menubar span { cursor: pointer; padding: 1px 4px; }
.pw-menubar span:hover { background: #000080; color: #fff; }

.pw-body { padding: 16px; }

/* INTRO */
.phase-intro { text-align: center; padding: 20px; }
.intro-icon { font-size: 56px; margin-bottom: 8px; }
.phase-intro h2 { color: #000080; font-size: 18px; margin-bottom: 10px; }
.intro-desc { font-size: 13px; line-height: 1.6; margin-bottom: 16px; }
.intro-rules { display: flex; flex-direction: column; gap: 6px; align-items: center; margin-bottom: 20px; }
.rule-row { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.rule-badge { padding: 2px 10px; font-size: 11px; font-weight: bold; border: 2px solid; }
.rule-badge.bad { background: #ff4444; color: #fff; border-color: #aa0000; }
.rule-badge.ok { background: #ff9900; color: #fff; border-color: #aa6600; }
.rule-badge.good { background: #008800; color: #fff; border-color: #005500; }

/* PLAY */
.phase-play { display: flex; gap: 16px; }

/* Attacker panel */
.attacker-panel {
  flex: 1;
  background: #0a0a0a;
  border: 2px inset #808080;
  padding: 10px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  min-width: 260px;
}
.attacker-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #ff4444;
}
.blink-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #444;
  transition: background 0.3s;
}
.blink-dot.active {
  background: #ff4444;
  animation: blink 0.5s infinite;
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

.terminal-lines {
  height: 160px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.t-line { margin-bottom: 2px; }
.t-line.cmd { color: #00ff00; }
.t-line.warn { color: #ffaa00; }
.t-line.err { color: #ff4444; }
.t-line.ok { color: #44ff44; }

.crack-bar-wrap { margin-bottom: 6px; }
.crack-bar-label { color: #888; font-size: 10px; margin-bottom: 3px; }
.crack-bar-track { background: #222; height: 14px; border: 1px solid #444; }
.crack-bar-fill { height: 100%; transition: width 0.2s; }
.crack-bar-fill.safe { background: #008800; }
.crack-bar-fill.warn { background: #ff9900; }
.crack-bar-fill.danger { background: #ff2222; animation: flash 0.4s infinite; }
@keyframes flash { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.crack-bar-pct { color: #888; font-size: 10px; text-align: right; }
.time-left-display { color: #ffaa00; font-size: 11px; text-align: center; margin-top: 4px; }

/* Input panel */
.input-panel { flex: 1.2; display: flex; flex-direction: column; gap: 10px; }

.field-label { font-weight: bold; color: #000080; font-size: 12px; }

.pw-input-wrap { display: flex; align-items: center; gap: 4px; }
.pw-input {
  flex: 1;
  padding: 4px 6px;
  border: 2px inset #fff;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: #fff;
}
.toggle-eye {
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  background: #c0c0c0;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 14px;
}

/* Strength meter */
.strength-meter { display: flex; align-items: center; gap: 8px; }
.strength-bars { display: flex; gap: 3px; }
.s-bar {
  width: 28px; height: 12px;
  border: 2px inset #808080;
  background: #888;
  transition: background 0.2s;
}
.s-bar.filled.color0 { background: #ff2222; }
.s-bar.filled.color1 { background: #ff9900; }
.s-bar.filled.color2 { background: #dddd00; }
.s-bar.filled.color3 { background: #00aa00; }
.strength-label { font-size: 11px; font-weight: bold; }
.strength-label.sl0 { color: #888; }
.strength-label.sl1 { color: #ff2222; }
.strength-label.sl2 { color: #ff9900; }
.strength-label.sl3 { color: #aaaa00; }
.strength-label.sl4 { color: #006600; }
.strength-label.sl5 { color: #004400; }

/* Checklist */
.checklist { display: flex; flex-direction: column; gap: 3px; }
.check-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #888; }
.check-row.pass { color: #005500; }
.check-icon { width: 16px; text-align: center; font-weight: bold; }

.suggestion-box {
  background: #ffffcc;
  border: 1px solid #cc9900;
  padding: 4px 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin-top: 4px;
  word-break: break-all;
}

/* RESULT */
.phase-result { text-align: center; padding: 24px 16px; }
.result-icon { font-size: 64px; margin-bottom: 10px; }
.phase-result h2 { font-size: 20px; margin-bottom: 10px; }
.result-win { color: #005500; }
.result-lose { color: #aa0000; }
.result-sub { margin-bottom: 20px; font-size: 13px; }
.result-stats {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.stat-box {
  background: #fff;
  border: 2px inset #808080;
  padding: 10px 16px;
  min-width: 100px;
}
.stat-val { font-weight: bold; font-size: 14px; color: #000080; word-break: break-all; }
.stat-key { font-size: 11px; color: #666; margin-top: 4px; }

.lesson-box {
  background: #fffde0;
  border: 2px solid #cc9900;
  padding: 10px 16px;
  font-size: 12px;
  text-align: left;
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Buttons */
.win95-btn {
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
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
.win95-btn.large { padding: 6px 28px; font-size: 13px; }
.win95-btn.small { padding: 1px 6px; font-size: 11px; }
.win95-btn:disabled { color: #808080; cursor: not-allowed; }
</style>