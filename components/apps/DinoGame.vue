<template>
  <div class="dino-game-container">
    <canvas ref="gameCanvas" width="800" height="200" tabindex="0"></canvas>
    <div class="game-controls">
      <button @click="startGame" v-if="!gameRunning && !gameOver">Start Game</button>
      <button @click="restartGame" v-if="gameOver">Restart</button>
      <div class="score">Score: {{ score }}</div>
      <div class="instructions">Press SPACE or UP arrow to jump</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const gameCanvas = ref(null)
let ctx = null
let animationId = null

// Game state
const gameRunning = ref(false)
const gameOver = ref(false)
const score = ref(0)

// Dino properties
let dino = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  velocityY: 0,
  isJumping: false,
  gravity: 0.8,
  jumpPower: -12
}

// Obstacle properties
let obstacles = []
let frameCount = 0
let obstacleSpawnCounter = 0
let baseSpeed = 5

function initCanvas() {
  if (!gameCanvas.value) return
  ctx = gameCanvas.value.getContext('2d')
  gameCanvas.value.width = 800
  gameCanvas.value.height = 200
  gameCanvas.value.style.border = '1px solid #000'
  gameCanvas.value.style.backgroundColor = '#f0f0f0'
}

function drawDino() {
  if (!ctx) return
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height)
  
  // Draw eye
  ctx.fillStyle = 'white'
  ctx.fillRect(dino.x + 14, dino.y + 4, 4, 4)
  ctx.fillStyle = 'black'
  ctx.fillRect(dino.x + 15, dino.y + 5, 2, 2)
}

function drawObstacles() {
  if (!ctx) return
  ctx.fillStyle = '#2d2d2d'
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
  })
}

function drawGround() {
  if (!ctx) return
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(0, 170, 800, 30)
  ctx.fillStyle = '#654321'
  ctx.fillRect(0, 170, 800, 3)
}

function updateDino() {
  dino.velocityY += dino.gravity
  dino.y += dino.velocityY

  // Ground collision
  if (dino.y >= 150) {
    dino.y = 150
    dino.isJumping = false
    dino.velocityY = 0
  }

  // Ceiling collision
  if (dino.y <= 0) {
    dino.y = 0
    dino.velocityY = 0
  }
}

function jump() {
  if (!gameRunning.value || gameOver.value) return
  if (!dino.isJumping) {
    dino.velocityY = dino.jumpPower
    dino.isJumping = true
  }
}

function spawnObstacle() {
  obstacles.push({
    x: 800,
    y: 150,
    width: 15,
    height: 20
  })
}

function updateObstacles() {
  // Move obstacles
  obstacles = obstacles.filter(obs => {
    obs.x -= baseSpeed
    return obs.x + obs.width > 0
  })

  // Spawn new obstacles
  if (gameRunning.value && !gameOver.value) {
    obstacleSpawnCounter++
    if (obstacleSpawnCounter > Math.max(60, 90 - Math.floor(score.value / 200))) {
      spawnObstacle()
      obstacleSpawnCounter = 0
    }
  }
}

function checkCollision() {
  for (let obs of obstacles) {
    if (dino.x < obs.x + obs.width &&
        dino.x + dino.width > obs.x &&
        dino.y < obs.y + obs.height &&
        dino.y + dino.height > obs.y) {
      gameOver.value = true
      gameRunning.value = false
      return true
    }
  }
  return false
}

function updateScore() {
  if (gameRunning.value && !gameOver.value) {
    score.value += 1
    // Increase speed gradually
    baseSpeed = 5 + Math.floor(score.value / 500)
  }
}

function draw() {
  if (!ctx) return
  
  // Clear canvas
  ctx.clearRect(0, 0, 800, 200)
  
  drawGround()
  drawDino()
  drawObstacles()
  
  // Draw score on canvas
  ctx.fillStyle = '#000'
  ctx.font = '16px monospace'
  ctx.fillText(`Score: ${score.value}`, 700, 30)
  
  if (gameOver.value) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, 800, 200)
    ctx.fillStyle = 'white'
    ctx.font = '24px monospace'
    ctx.fillText('GAME OVER', 340, 100)
    ctx.font = '14px monospace'
    ctx.fillText('Click Restart to play again', 320, 140)
  } else if (!gameRunning.value && !gameOver.value) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, 800, 200)
    ctx.fillStyle = 'white'
    ctx.font = '20px monospace'
    ctx.fillText('Click Start Game', 330, 100)
  }
}

function gameLoop() {
  if (gameRunning.value && !gameOver.value) {
    updateDino()
    updateObstacles()
    updateScore()
    checkCollision()
  }
  draw()
  animationId = requestAnimationFrame(gameLoop)
}

function startGame() {
  resetGame()
  gameRunning.value = true
  gameOver.value = false
}

function restartGame() {
  resetGame()
  startGame()
}

function resetGame() {
  dino = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    velocityY: 0,
    isJumping: false,
    gravity: 0.8,
    jumpPower: -12
  }
  obstacles = []
  frameCount = 0
  obstacleSpawnCounter = 0
  baseSpeed = 5
  score.value = 0
  gameOver.value = false
  gameRunning.value = false
}

function handleKeydown(e) {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    jump()
  }
  // Start game with Enter key
  if (e.code === 'Enter' && !gameRunning.value && !gameOver.value) {
    startGame()
  }
  // Restart with R key
  if (e.code === 'KeyR' && gameOver.value) {
    restartGame()
  }
}

onMounted(() => {
  initCanvas()
  gameLoop()
  window.addEventListener('keydown', handleKeydown)
  if (gameCanvas.value) {
    gameCanvas.value.addEventListener('click', () => gameCanvas.value.focus())
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.dino-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f0f0f0;
}

.game-controls {
  margin-top: 10px;
  text-align: center;
}

button {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 8px 16px;
  font-family: 'Windows 95', monospace;
  cursor: pointer;
  margin: 0 5px;
}

button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.score {
  display: inline-block;
  margin-left: 20px;
  font-family: monospace;
  font-size: 16px;
}

.instructions {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  font-family: monospace;
}

canvas {
  cursor: pointer;
  outline: none;
}

canvas:focus {
  outline: 2px solid #000080;
}
</style>