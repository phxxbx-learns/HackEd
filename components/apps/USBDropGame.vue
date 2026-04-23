<template>
  <div class="usb-window">
    <div class="usb-titlebar">
      <span>💾 USB Alert — Removable Media Detected</span>
    </div>
    <div class="usb-menubar">
      <span>Device</span><span>Security</span><span>Help</span>
    </div>

    <div class="usb-body">

      <!-- INTRO -->
      <div v-if="phase === 'intro'" class="phase-intro">
        <div class="autorun-dialog">
          <div class="autorun-icon">💾</div>
          <div class="autorun-title">AutoRun — USB Drive Detected</div>
          <div class="autorun-sub">Windows found a removable storage device</div>
          <div class="autorun-sep"></div>
          <p class="intro-flavor">
            You arrive at the office Monday morning. There's an unlabeled USB drive on the floor
            near the printer. Someone left it. You're curious...
          </p>
          <p class="intro-sub">In this game, you'll face <strong>{{ scenarios.length }} USB scenarios</strong>.<br>
          Make the right call each time to protect the system!</p>
          <button class="win95-btn primary large" @click="startGame">Open Device</button>
        </div>
      </div>

      <!-- PLAY -->
      <div v-else-if="phase === 'play'" class="phase-play">
        <div class="hud">
          <div class="hud-chip">Scenario {{ currentIdx + 1 }}/{{ scenarios.length }}</div>
          <div class="hud-chip score">Score: {{ score }}</div>
          <div class="hud-chip lives">{{ '❤️'.repeat(lives) }}{{ '🖤'.repeat(3 - lives) }}</div>
        </div>

        <div class="scenario-card" v-if="currentScenario">
          <div class="scenario-top">
            <div class="usb-visual">
              <div class="usb-plug">💾</div>
              <div class="usb-label">{{ currentScenario.label }}</div>
            </div>
            <div class="scenario-info">
              <div class="scenario-location">📍 {{ currentScenario.location }}</div>
              <div class="scenario-situation">{{ currentScenario.situation }}</div>
            </div>
          </div>

          <!-- Clues -->
          <div class="clues">
            <div class="clues-title">🔍 Observations:</div>
            <ul class="clues-list">
              <li v-for="clue in currentScenario.clues" :key="clue">{{ clue }}</li>
            </ul>
          </div>

          <!-- Choices -->
          <div class="choices-title">What do you do?</div>
          <div class="choices-grid" v-if="!answered">
            <button
              v-for="choice in currentScenario.choices"
              :key="choice.id"
              class="choice-btn"
              @click="makeChoice(choice)"
            >
              <span class="choice-num">{{ choice.id }}</span>
              <span class="choice-text">{{ choice.text }}</span>
            </button>
          </div>

          <!-- Verdict -->
          <div v-if="answered" class="verdict" :class="lastResult.correct ? 'verdict-good' : 'verdict-bad'">
            <div class="verdict-header">
              <span class="verdict-icon">{{ lastResult.correct ? '✅' : '❌' }}</span>
              <span class="verdict-title">{{ lastResult.correct ? 'CORRECT CALL!' : 'WRONG CALL!' }}</span>
              <span class="verdict-pts">{{ lastResult.correct ? '+' + pointsPerQ : '-1 life' }}</span>
            </div>
            <div class="verdict-explanation">{{ lastResult.explanation }}</div>
            <div class="consequence" v-if="!lastResult.correct">
              <strong>⚠️ Consequence:</strong> {{ lastResult.consequence }}
            </div>
            <button class="win95-btn primary" @click="nextScenario" style="margin-top:10px">
              {{ currentIdx + 1 < scenarios.length ? 'Next Scenario →' : 'See Results' }}
            </button>
          </div>
        </div>
      </div>

      <!-- RESULT -->
      <div v-else-if="phase === 'result'" class="phase-result">
        <div class="result-header">
          <div class="result-big-icon">{{ score >= 60 ? '🛡️' : score >= 30 ? '🤔' : '💀' }}</div>
          <h2>Mission {{ score >= 60 ? 'Accomplished' : 'Debriefing' }}</h2>
          <div class="final-score">{{ score }} / {{ scenarios.length * pointsPerQ }} points</div>
          <div class="grade-badge" :class="grade.cls">{{ grade.label }}</div>
        </div>

        <div class="result-replay">
          <div v-for="(sc, i) in scenarios" :key="i" class="replay-row">
            <span class="replay-num">{{ i + 1 }}.</span>
            <span class="replay-loc">{{ sc.location }}</span>
            <span class="replay-label">{{ sc.label }}</span>
            <span class="replay-mark">{{ userAnswers[i] === 'correct' ? '✓' : '✗' }}</span>
          </div>
        </div>

        <div class="lesson-box">
          <strong>🎓 Key Rule:</strong> NEVER plug an unknown USB drive into a work computer.
          USB drops are a classic social engineering attack (called a "baiting" attack).
          Always hand it to IT Security — they have tools to safely analyze it.
        </div>

        <button class="win95-btn primary large" @click="resetGame">Play Again</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const phase = ref('intro')
const score = ref(0)
const lives = ref(3)
const currentIdx = ref(0)
const answered = ref(false)
const lastResult = ref(null)
const userAnswers = ref([])
const pointsPerQ = 20

const scenarios = [
  {
    label: '"SALARY_2025.xlsx"',
    location: 'Office parking lot, near your car',
    situation: 'You find a USB drive on the ground next to your car. The label reads "SALARY_2025.xlsx".',
    clues: [
      'The drive has no name or company branding',
      'The label is printed, not handwritten',
      'No one else is around',
    ],
    choices: [
      { id: 'A', text: 'Plug it into your work PC — just to see who it belongs to', correct: false },
      { id: 'B', text: 'Ignore it and leave it on the ground', correct: false },
      { id: 'C', text: 'Hand it to IT Security immediately without plugging it in', correct: true },
      { id: 'D', text: 'Plug it into your personal phone to check the contents', correct: false },
    ],
    explanation: 'Handing unknown USB drives to IT Security is always the right move. IT has isolated environments to safely analyze potentially malicious drives.',
    consequence: 'Plugging in the drive auto-installs a keylogger. All your keystrokes are now being captured and sent to an attacker.'
  },
  {
    label: '"HR_BONUS_LIST_CONFIDENTIAL"',
    location: 'Conference room table after a meeting',
    situation: 'After a company meeting, you notice a USB drive left on the table. No one claimed it during the meeting.',
    clues: [
      'The drive looks like a branded company giveaway',
      'The label mentions "bonuses" — tempting!',
      'The last person in the room was a visitor from another company',
    ],
    choices: [
      { id: 'A', text: 'Plug it in — it is probably from IT anyway', correct: false },
      { id: 'B', text: 'Give it to the receptionist as lost property', correct: false },
      { id: 'C', text: 'Report it to IT Security and do not touch the contents', correct: true },
      { id: 'D', text: 'Take it home to check on an old computer', correct: false },
    ],
    explanation: 'Visitors could be social engineers. A branded drive can still be malicious. IT Security is the only safe option.',
    consequence: 'The drive contains a fake Word document. Opening it triggers a macro that installs ransomware.'
  },
  {
    label: 'Unmarked white drive',
    location: 'Bathroom at your office',
    situation: 'You find an unmarked USB drive on the bathroom counter. You have never seen it before.',
    clues: [
      'No label, no markings, no branding',
      'Left in a high-traffic area',
      'Could belong to anyone',
    ],
    choices: [
      { id: 'A', text: 'Leave it there — it is not your problem', correct: false },
      { id: 'B', text: 'Plug it into an air-gapped old PC in the supply room', correct: false },
      { id: 'C', text: 'Drop it in the trash — it is just junk', correct: false },
      { id: 'D', text: 'Report to IT Security; let them handle it professionally', correct: true },
    ],
    explanation: 'Leaving it or trashing it does not neutralize the threat. Only IT Security can properly analyze and dispose of it.',
    consequence: 'Someone finds it in the trash and plugs it into their home PC, getting infected. The malware spreads back through their VPN connection.'
  },
  {
    label: '"FreeGames_Install.exe"',
    location: 'Mailed to your office address',
    situation: 'A USB drive arrives in the mail addressed to "Any Employee." There is no return address.',
    clues: [
      'No return address or company name',
      'Label promises "free game installers"',
      'Arrived in a plain white envelope',
    ],
    choices: [
      { id: 'A', text: 'Plug it in — free games sound great!', correct: false },
      { id: 'B', text: 'Report to IT Security; this is a classic baiting attack', correct: true },
      { id: 'C', text: 'Try it on a virtual machine', correct: false },
      { id: 'D', text: 'Give it to a colleague to try first', correct: false },
    ],
    explanation: 'Mailing USB drives to offices is a well-documented social engineering tactic. Report immediately — even VMs can sometimes be escaped by advanced malware.',
    consequence: 'The drive exploits an auto-run feature. Once plugged in, it silently joins the company network to a botnet.'
  },
  {
    label: '"Client_Presentation_FINAL_v3"',
    location: 'Given to you by a client at a meeting',
    situation: 'During an external client meeting, the client hands you a USB drive saying "the presentation slides are on here."',
    clues: [
      'Came from an external party',
      'Could be legitimate — or could be targeted',
      'You have a legitimate reason to need the slides',
    ],
    choices: [
      { id: 'A', text: 'Plug it straight into your work laptop to show the slides', correct: false },
      { id: 'B', text: 'Ask the client to email the slides instead', correct: true },
      { id: 'C', text: 'Plug it into your phone to preview', correct: false },
      { id: 'D', text: 'Use it on the conference room display PC only', correct: false },
    ],
    explanation: 'Even from known contacts, USB drives can be infected without the owner knowing. Requesting files via email is safer and still professional.',
    consequence: 'The drive was previously infected by the client\'s own IT breach. You have now bridged the two networks.'
  },
]

const currentScenario = computed(() => scenarios[currentIdx.value])

const grade = computed(() => {
  const pct = score.value / (scenarios.length * pointsPerQ)
  if (pct >= 0.8) return { label: '⭐ Security Expert', cls: 'grade-a' }
  if (pct >= 0.6) return { label: '✅ Competent', cls: 'grade-b' }
  if (pct >= 0.4) return { label: '⚠️ Needs Improvement', cls: 'grade-c' }
  return { label: '🚨 High Risk User', cls: 'grade-d' }
})

function startGame() {
  score.value = 0
  lives.value = 3
  currentIdx.value = 0
  answered.value = false
  userAnswers.value = []
  phase.value = 'play'
}

function makeChoice(choice) {
  answered.value = true
  if (choice.correct) {
    score.value += pointsPerQ
    userAnswers.value.push('correct')
    lastResult.value = {
      correct: true,
      explanation: currentScenario.value.explanation,
    }
  } else {
    lives.value = Math.max(0, lives.value - 1)
    userAnswers.value.push('wrong')
    lastResult.value = {
      correct: false,
      explanation: currentScenario.value.explanation,
      consequence: currentScenario.value.consequence,
    }
  }
}

function nextScenario() {
  if (currentIdx.value + 1 >= scenarios.length || lives.value === 0) {
    phase.value = 'result'
  } else {
    currentIdx.value++
    answered.value = false
    lastResult.value = null
  }
}

function resetGame() {
  phase.value = 'intro'
}
</script>

<style scoped>
.usb-window {
  width: 680px;
  min-height: 480px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 13px;
}
.usb-titlebar {
  background: linear-gradient(90deg, #800000, #c0392b);
  color: #fff;
  padding: 3px 6px;
  font-weight: bold;
  font-size: 13px;
}
.usb-menubar {
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 8px;
  display: flex;
  gap: 16px;
}
.usb-menubar span { cursor: pointer; padding: 1px 4px; }
.usb-menubar span:hover { background: #000080; color: #fff; }
.usb-body { padding: 16px; }

/* INTRO */
.autorun-dialog {
  background: #fff;
  border: 2px inset #808080;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}
.autorun-icon { font-size: 48px; margin-bottom: 6px; }
.autorun-title { font-size: 16px; font-weight: bold; color: #000080; }
.autorun-sub { font-size: 12px; color: #444; margin-bottom: 10px; }
.autorun-sep { border-top: 1px solid #c0c0c0; margin: 10px 0; }
.intro-flavor { font-size: 13px; line-height: 1.6; margin-bottom: 10px; color: #333; }
.intro-sub { font-size: 12px; color: #555; margin-bottom: 16px; }

/* PLAY */
.hud { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
.hud-chip { padding: 3px 10px; border: 2px inset #808080; background: #fff; font-size: 12px; }
.hud-chip.score { color: #000080; font-weight: bold; }
.hud-chip.lives { font-size: 14px; }

.scenario-card {
  background: #fff;
  border: 2px inset #808080;
  padding: 16px;
}

.scenario-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 14px; }
.usb-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}
.usb-plug { font-size: 36px; }
.usb-label {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  background: #ffff88;
  border: 1px solid #cc9900;
  padding: 2px 6px;
  margin-top: 4px;
  text-align: center;
  max-width: 90px;
  word-break: break-all;
}
.scenario-location { font-size: 11px; color: #666; margin-bottom: 4px; }
.scenario-situation { font-size: 13px; line-height: 1.6; }

.clues { background: #fffff0; border: 1px solid #c8c800; padding: 8px 12px; margin-bottom: 12px; }
.clues-title { font-weight: bold; font-size: 12px; color: #665500; margin-bottom: 4px; }
.clues-list { margin: 0; padding-left: 18px; }
.clues-list li { font-size: 12px; color: #333; margin-bottom: 3px; }

.choices-title { font-weight: bold; margin-bottom: 8px; color: #000080; }
.choices-grid { display: flex; flex-direction: column; gap: 6px; }
.choice-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f0f0f0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  cursor: pointer;
  text-align: left;
  font-family: 'Tahoma', sans-serif;
  font-size: 12px;
  transition: background 0.1s;
}
.choice-btn:hover { background: #ddeeff; border-color: #000080; }
.choice-btn:active { border-color: #808080 #fff #fff #808080; }
.choice-num {
  background: #000080;
  color: #fff;
  width: 22px; height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}
.choice-text { flex: 1; }

.verdict {
  padding: 12px;
  border: 2px solid;
  margin-top: 10px;
}
.verdict-good { background: #e8f5e9; border-color: #008800; }
.verdict-bad { background: #ffebee; border-color: #cc0000; }
.verdict-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.verdict-icon { font-size: 20px; }
.verdict-title { font-weight: bold; font-size: 14px; flex: 1; }
.verdict-pts { font-weight: bold; font-size: 14px; }
.verdict-good .verdict-pts { color: #005500; }
.verdict-bad .verdict-pts { color: #880000; }
.verdict-explanation { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
.consequence {
  background: #fff3e0;
  border: 1px solid #ff9800;
  padding: 6px 10px;
  font-size: 12px;
  color: #663300;
}

/* RESULT */
.phase-result { text-align: center; }
.result-header { margin-bottom: 16px; }
.result-big-icon { font-size: 56px; }
.phase-result h2 { font-size: 18px; color: #000080; margin-bottom: 6px; }
.final-score { font-size: 22px; font-weight: bold; color: #000; margin-bottom: 8px; }
.grade-badge { display: inline-block; padding: 4px 16px; font-weight: bold; font-size: 14px; border: 2px solid; margin-bottom: 16px; }
.grade-a { background: #e8f5e9; border-color: #008800; color: #005500; }
.grade-b { background: #e3f2fd; border-color: #0000aa; color: #000080; }
.grade-c { background: #fff8e1; border-color: #cc7700; color: #884400; }
.grade-d { background: #ffebee; border-color: #cc0000; color: #880000; }

.result-replay {
  background: #fff;
  border: 2px inset #808080;
  padding: 10px;
  margin-bottom: 12px;
  text-align: left;
  max-height: 180px;
  overflow-y: auto;
}
.replay-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid #eee; font-size: 12px; }
.replay-num { color: #666; width: 20px; }
.replay-loc { flex: 1; color: #333; }
.replay-label { font-family: 'Courier New', monospace; font-size: 10px; background: #f0f0f0; padding: 1px 4px; }
.replay-mark { font-weight: bold; font-size: 14px; }

.lesson-box {
  background: #fffde0;
  border: 2px solid #cc9900;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: left;
}

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
.win95-btn.large { padding: 6px 24px; font-size: 13px; }
</style>