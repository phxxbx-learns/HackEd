<template>
  <div 
    class="window-overlay"
    :style="{ zIndex: windowZIndex }"
    v-show="isOpen"
  >
    <div
      ref="el"
      class="window"
      :style="style"
      @mousedown="bringToFront"
    >
      <div
        class="window-titlebar"
        ref="dragHandle"
        @mousedown="startDrag"
      >
        <span class="window-title">{{ name }}</span>
        <button
          class="window-close"
          @click="emit('close', name)"
        >
          ✕
        </button>
      </div>
      <div class="window-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  lastClickedWindow: {
    type: String,
    default: '',
  },
  currentlyOpenWindows: {
    type: Array as () => string[],
    default: () => []
  },
})

const emit = defineEmits(['close', 'clickInsideWindow'])

const el = ref<HTMLElement | null>(null)
const dragHandle = ref<HTMLElement | null>(null)

// Window positioning
const x = ref(200)
const y = ref(100)
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let initialX = 0
let initialY = 0

const style = computed(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`,
  position: 'absolute' as const,
}))

const windowZIndex = computed(() => {
  return props.lastClickedWindow === props.name ? 1000 : 900
})

const isOpen = computed(() => {
  return props.currentlyOpenWindows.includes(props.name)
})

function bringToFront() {
  emit('clickInsideWindow', props.name)
}

function startDrag(e: MouseEvent) {
  if (!el.value) return
  isDragging = true
  dragStartX = e.clientX - x.value
  dragStartY = e.clientY - y.value
  initialX = x.value
  initialY = y.value
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  bringToFront()
}

function onDrag(e: MouseEvent) {
  if (!isDragging) return
  x.value = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragStartX))
  y.value = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStartY))
}

function stopDrag() {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Center window on first open
watch(() => props.currentlyOpenWindows, (newWindows, oldWindows) => {
  if (newWindows.includes(props.name) && !oldWindows?.includes(props.name)) {
    x.value = Math.max(20, Math.min(window.innerWidth - 400, 200))
    y.value = Math.max(20, Math.min(window.innerHeight - 300, 100))
  }
}, { deep: true })

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.window-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.window {
  position: absolute;
  min-width: 400px;
  min-height: 220px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 4px 4px 0 #00000040;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

.window-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000080;
  color: white;
  padding: 4px 8px;
  cursor: move;
  font-family: 'Windows 95', 'Tahoma', monospace;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 2px solid #ffffff;
}

.window-title {
  flex: 1;
  letter-spacing: 1px;
}

.window-close {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  color: black;
  width: 24px;
  height: 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
}

.window-close:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.window-content {
  flex: 1;
  padding: 8px;
  overflow: auto;
  background: #c0c0c0;
}

/* Windows 95 scrollbar */
.window-content::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

.window-content::-webkit-scrollbar-track {
  background: #c0c0c0;
  border: 1px solid #808080;
}

.window-content::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

.window-content::-webkit-scrollbar-button {
  background: #c0c0c0;
  border: 1px solid #808080;
  width: 16px;
  height: 16px;
}
</style>