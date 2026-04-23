<template>
  <div class="p-4 flex flex-col gap-4" :class="colorShiftEnabled ? 'color-shift' : 'overflow-hidden'">

    <PayloadsAntRunner v-if="payloadsState.antRunner" />
    <PayloadsBluescreen v-if="payloadsState.bluescreen" />
    <PayloadsCube v-if="payloadsState.cube" />
    <PayloadsKirbyParisHydra v-if="payloadsState.kirby_paris_hydra" />
    <PayloadsRansomware v-if="payloadsState.ransomware" />
    <PayloadsYouAreAnIdiot v-if="payloadsState.you_are_an_idiot" />
    <PayloadsBobrKurwa v-if="payloadsState.bobr_kurwa" />

    <DesktopWindow name="Mail" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsMail />
    </DesktopWindow>
    <DesktopWindow name="Browser" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsBrowser ref="browser" />
    </DesktopWindow>
    <DesktopWindow name="Dino Game" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsDinoGame />
    </DesktopWindow>
    <DesktopWindow name="Antivirus" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsAntivirus />
    </DesktopWindow>

    <DesktopWindow name="Mincefrat Instaler" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsMinecraftInstallerFake />
    </DesktopWindow>
    <DesktopWindow name="Minecraft Installer" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsMinecraftInstallerReal />
    </DesktopWindow>

    <DesktopWindow name="Minecraft" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsMinecraftGame />
    </DesktopWindow>

    <DesktopWindow name="Scamcyclopedia" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsScamcyclopedia />
    </DesktopWindow>
    <DesktopWindow name="TheMATRIX" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsTheMATRIX />
    </DesktopWindow>
    <DesktopWindow name="Notepad" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsNotepad />
    </DesktopWindow>
    <DesktopWindow name="Credits" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <AppsCredits />
    </DesktopWindow>

    <DesktopWindow name="Extension Audit" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <ExtensionAudit />
    </DesktopWindow>

    <DesktopWindow name="Password Defender" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <PasswordCracker />
    </DesktopWindow>

    <DesktopWindow name="USB Drop Game" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <USBDropGame />
    </DesktopWindow>

    <DesktopWindow name="Update Racer" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <UpdateRacer />
    </DesktopWindow>

    <DesktopWindow name="Privacy Audit" :lastClickedWindow="currentlyOpenWindows.lastClickedWindow"
      :currentlyOpenWindows="currentlyOpenWindows.openWindows" @clickInsideWindow="setLastClickedWindow"
      @close="closeWindow">
      <PrivacySettings />
    </DesktopWindow>

    <!-- LEFT COLUMN - Main apps (2 per column) -->
    <div class="left-icons">
      <!-- Column 1 -->
      <div class="icon-column">
        <DesktopIcon windowName="Mail" @openWindow="openWindow">
          <img src="/icons/email.png" alt="Mail Icon" class="w-14 h-14 mb-1" 
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=📧'" />
        </DesktopIcon>
        <DesktopIcon windowName="Antivirus" @openWindow="openWindow">
          <img src="/icons/antivirus.png" alt="Antivirus Icon" class="w-14 h-14 mb-[0.3rem] mt-[0.1rem]" 
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🛡️'" />
        </DesktopIcon>
        <DesktopIcon windowName="Extension Audit" @openWindow="openWindow">
          <img src="/icons/extension.png" alt="Extension Audit" class="w-14 h-14 mb-1"
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🧩'" />
        </DesktopIcon>
        <DesktopIcon windowName="USB Drop Game" @openWindow="openWindow">
          <img src="/icons/usb.png" alt="USB Drop Game" class="w-14 h-14 mb-1"
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=💾'" />
        </DesktopIcon>
        <DesktopIcon windowName="Privacy Audit" @openWindow="openWindow">
          <img src="/icons/privacy.png" alt="Privacy Audit" class="w-14 h-14 mb-1"
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🔒'" />
        </DesktopIcon>
      </div>

      <!-- Column 2 -->
      <div class="icon-column">
        <DesktopIcon windowName="Browser" @openWindow="openWindow">
          <img src="/icons/browser.png" alt="Browser Icon" class="w-14 h-14 mb-0.5" 
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🌐'" />
        </DesktopIcon>
        <DesktopIcon windowName="Scamcyclopedia" @openWindow="openWindow">
          <img src="/icons/books.png" alt="Books Icon" class="w-14 h-14 mb-[0.3rem] mt-[0.1rem]" 
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=📚'" />
        </DesktopIcon>
        <DesktopIcon windowName="Password Defender" @openWindow="openWindow">
          <img src="/icons/password.png" alt="Password Defender" class="w-14 h-14 mb-1"
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🔐'" />
        </DesktopIcon>
        <DesktopIcon windowName="Update Racer" @openWindow="openWindow">
          <img src="/icons/update.png" alt="Update Racer" class="w-14 h-14 mb-1"
            onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🔄'" />
        </DesktopIcon>
        <DesktopIcon windowName="Notepad" @openWindow="openWindow">
          <img src="/images/notepad.png" alt="Notepad Icon" class="w-14 h-14 mb-[0.3rem] mt-[0.1rem]" />
        </DesktopIcon>
      </div>
      </div>

    <!-- Column 3 - UPPER RIGHT corner (Dino Game + Minecraft) -->
    <div class="icon-column" style="position: fixed; right: 20px; top: 20px; z-index: 20; pointer-events: auto;">
      <DesktopIcon windowName="Dino Game" @openWindow="openWindow">
        <img src="/icons/dino.png" class="w-14 h-14" onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=🦖'" />
      </DesktopIcon>
      <DesktopIcon v-if="currentlyOpenWindows.installableSoftware.minecraft" windowName="Minecraft" @openWindow="openWindow">
        <img src="/images/minecraft.png" class="w-14 h-14" onerror="this.src='https://placehold.co/56x56/c0c0c0/000?text=⛏️'" />
      </DesktopIcon>
    </div>

    <!-- BOTTOM LEFT corner - TheMATRIX and Credits (side by side horizontally) -->
    <div class="bottom-left-icons">
      <DesktopIcon windowName="TheMATRIX" @openWindow="openWindow">
        <img src="/icons/hackaburg.png" alt="Hackaburg Icon" class="w-16 h-16 mb-1" />
      </DesktopIcon>
      <DesktopIcon windowName="Credits" @openWindow="openWindow">
        <img src="/icons/group.png" alt="Group Icon" class="w-16 h-16 mb-1" />
      </DesktopIcon>
    </div>

    <!-- Skippy Start Overlay -->
    <SkippyStart v-if="!skippyInstalled" @skippy-installed="onSkippyInstalled"
      style="z-index:9500; position:fixed; inset:0;" />
    
    <!-- Skippy Input Overlay -->
    <SkippyInput v-if="skippyInputVisible" style="z-index:9600; position:fixed; inset:0;" />
    
    <!-- Clippy Assistant -->
    <div v-if="clippyVisible" class="fixed bottom-10 right-6 z-[9000] pointer-events-none"
      style="width: 340px; height: 180px;">
      <div class="pointer-events-auto flex flex-row items-end h-full justify-end">
        <div class="flex items-center mr-2" style="height: 14rem;">
          <ClippySpeechBubble ref="clippyBubble" />
        </div>
        <img src="/textures/skippy.png" alt="Clippy"
          class="w-[14rem] h-[14rem] mb-2 cursor-pointer transition-transform duration-300"
          :style="{ transform: `scale(${clippyScale})` }" @click="showClippyBubble" />
      </div>
    </div>

    <!-- BOTTOM TASKBAR -->
    <div class="taskbar">
      <div class="start-button">
        <button class="start-btn" @click="toggleStartMenu">
          <img src="/icons/windows-logo.webp" alt="Start" class="start-logo" 
            onerror="this.src='https://placehold.co/16x16/000000/ffffff?text=★'" />
          <span>Start</span>
        </button>
      </div>
      
      <div class="taskbar-divider"></div>
      
      <div class="taskbar-windows">
        <button 
          v-for="win in currentlyOpenWindows.openWindows" 
          :key="win"
          class="taskbar-window-btn"
          :class="{ active: currentlyOpenWindows.lastClickedWindow === win }"
          @click="setLastClickedWindow(win)"
        >
          {{ win }}
        </button>
      </div>
      
      <div class="taskbar-right">
        <div class="ping-indicator">
          <span class="ping-dot"></span>
          <span>Ping: {{ ping }}ms</span>
        </div>
        <div class="taskbar-divider"></div>
        <div class="time-display">{{ currentTime }}</div>
        <button class="restart-btn" @click="restartSystem">⟳</button>
        <button class="shutdown-btn" @click="shutdownSystem">✕</button>
      </div>
    </div>

    <!-- Start Menu -->
    <div v-if="startMenuVisible" class="start-menu" @click.self="startMenuVisible = false">
      <div class="start-menu-content">
        <div class="start-menu-header">
          <span>Windows 95</span>
        </div>
        <div class="start-menu-items">
          <button @click="openWindow('Mail'); startMenuVisible = false">📧 Mail</button>
          <button @click="openWindow('Browser'); startMenuVisible = false">🌐 Browser</button>
          <button @click="openWindow('Antivirus'); startMenuVisible = false">🛡️ Antivirus</button>
          <button @click="openWindow('Scamcyclopedia'); startMenuVisible = false">📚 Scamcyclopedia</button>
          <button @click="openWindow('Extension Audit'); startMenuVisible = false">🧩 Extension Audit</button>
          <button @click="openWindow('Password Defender'); startMenuVisible = false">🔐 Password Defender</button>
          <button @click="openWindow('USB Drop Game'); startMenuVisible = false">💾 USB Drop Game</button>
          <button @click="openWindow('Update Racer'); startMenuVisible = false">🔄 Update Racer</button>
          <button @click="openWindow('Privacy Audit'); startMenuVisible = false">🔒 Privacy Audit</button>
          <div class="start-menu-divider"></div>
          <button @click="shutdownSystem">🔌 Shut Down...</button>
          <button @click="restartSystem">⟳ Restart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ClippySpeechBubble from '~/components/misc/clippy_speech_bubble.vue';
import SkippyStart from '~/pages/skippy_start.vue';
import SkippyInput from '~/pages/skippy_input.vue';
import ExtensionAudit from '~/components/apps/ExtensionAudit.vue'
import PasswordCracker from '~/components/apps/PasswordCracker.vue'
import USBDropGame from '~/components/apps/USBDropGame.vue'
import UpdateRacer from '~/components/apps/UpdateRacer.vue'
import PrivacySettings from '~/components/apps/PrivacySettings.vue'

const currentlyOpenWindows = useOpenWindowsStore();
const payloadsState = usePayloadsStore();

const clippyBubble = ref();
const colorShiftEnabled = ref(false);
const clippyScale = ref(0);
const clippyVisible = ref(false);
const skippyInstalled = ref(false);
const skippyInputVisible = ref(false);
const startMenuVisible = ref(false);
const ping = ref(42);
const currentTime = ref('');

let pingInterval: NodeJS.Timeout;
let timeInterval: NodeJS.Timeout;

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function updatePing() {
  ping.value = Math.floor(Math.random() * 30) + 30;
}

function toggleStartMenu() {
  startMenuVisible.value = !startMenuVisible.value;
}

function restartSystem() {
  if (confirm('Restart Windows 95? Unsaved work may be lost.')) {
    localStorage.clear();
    window.location.reload();
  }
}

function shutdownSystem() {
  if (confirm('Shut down Windows 95?')) {
    document.body.style.filter = 'brightness(0.5)';
    setTimeout(() => {
      window.close();
    }, 1000);
  }
}

function showClippyBubble() {
  if (
    clippyBubble.value &&
    typeof clippyBubble.value.showBubble === 'function' &&
    typeof clippyBubble.value.hideBubble === 'function'
  ) {
    if (clippyBubble.value.visible) {
      clippyBubble.value.hideBubble();
    } else {
      clippyBubble.value.showBubble();
    }
  }
}

function setClippyText(newText: string) {
  animateClippy()
  if (clippyBubble.value && typeof clippyBubble.value.setText === 'function') {
    clippyBubble.value.setText(newText);
    clippyBubble.value.showBubble();
  }
}

function animateClippy() {
  clippyScale.value = 1.36;
  setTimeout(() => {
    clippyScale.value = 1;
  }, 180);
}

function showClippyOnInstall() {
  clippyVisible.value = true;
  clippyScale.value = 0;
  setTimeout(() => {
    clippyScale.value = 1;
  }, 10);
  // @ts-ignore
  missionsStore.triggerEvent("skippy_installed")
}

function hideClippy() {
  clippyVisible.value = false;
  clippyScale.value = 0;
}

function onSkippyInstalled() {
  skippyInstalled.value = true;
  showClippyOnInstall();
  setTimeout(() => {
    skippyInputVisible.value = true;
  }, 2700);
}

// Expose to console for debugging
// @ts-ignore
window.setClippyText = setClippyText;
// @ts-ignore
window.animateClippy = animateClippy;
// @ts-ignore
window.showClippy = showClippyOnInstall;
// @ts-ignore
window.hideClippy = hideClippy;

// @ts-ignore
import { useMissionsStore } from '~/stores/missions';

// @ts-ignore
const missionsStore = useMissionsStore();
// @ts-ignore
window.triggerEvent = (event) => missionsStore.triggerEvent.call(missionsStore, event);
// @ts-ignore
window.getStateString = () => missionsStore.getStateString.call(missionsStore);
// @ts-ignore
window.getLatestStateTriggered = () => missionsStore.getLatestStateTriggered.call(missionsStore);
// @ts-ignore
window.missionsStore = missionsStore;

function plotTwist() {
  setTimeout(() => {
    const browserRef = (window as any).$refs?.browser || null;
    if (browserRef && typeof browserRef.sendEscapeKey === 'function') {
      browserRef.sendEscapeKey();
    }

    missionsStore.triggerEvent("plottwist1");
    setTimeout(() => {
      missionsStore.triggerEvent("plottwist2");
    }, 5000);
  }, 9500);
}

const openWindow = (windowName: string) => {
  if (windowName == "Minecraft") {
    plotTwist()
  }
  currentlyOpenWindows.openWindow(windowName);
  startMenuVisible.value = false;
};

const closeWindow = (windowName: string) => {
  currentlyOpenWindows.closeWindow(windowName);
};

const setLastClickedWindow = (windowName: string) => {
  currentlyOpenWindows.setLastClickedWindow(windowName);
};

onMounted(() => {
  updateTime();
  updatePing();
  timeInterval = setInterval(updateTime, 1000);
  pingInterval = setInterval(updatePing, 5000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(pingInterval);
});
</script>

<style scoped>
@keyframes hueShift {
  from { filter: hue-rotate(0deg); }
  to { filter: hue-rotate(360deg); }
}

.color-shift {
  animation: hueShift 15s linear infinite;
}

/* Left icons container - vertical layout */
.left-icons {
  display: flex;
  flex-direction: row;
  gap: 16px;
  position: relative;
  z-index: 10;
}

.desktop {
  background-color: #008080;
  min-height: 100vh;
  position: relative;
  background-image: url('/images/desktop.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.icon-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 20; /* Increased from 10 */
  pointer-events: auto; /* Ensure clicks register */
}

.right-column {
  margin-left: 20px;
}

.right-column {
  position: absolute;
  right: 20px;
  top: 20px;
  margin-left: 0;
}

/* Bottom left corner - horizontal layout */
.bottom-left-icons {
  display: flex;
  flex-direction: row;
  gap: 16px;
  position: fixed;
  bottom: 60px;
  left: 16px;
  z-index: 10;
}

/* Taskbar */
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  z-index: 100;
  font-family: 'Windows 95', 'Tahoma', sans-serif;
}

.start-button {
  display: flex;
  align-items: center;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 4px 12px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Windows 95', 'Tahoma', sans-serif;
}

.start-btn:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.start-logo {
  width: 16px;
  height: 16px;
}

.taskbar-divider {
  width: 2px;
  height: 30px;
  background: #808080;
  border-right: 1px solid #ffffff;
}

.taskbar-windows {
  display: flex;
  flex: 1;
  gap: 4px;
  overflow-x: auto;
}

.taskbar-window-btn {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Windows 95', 'Tahoma', sans-serif;
  white-space: nowrap;
}

.taskbar-window-btn.active {
  border-color: #808080 #ffffff #ffffff #808080;
  background: #a0a0a0;
}

.taskbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ping-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-family: monospace;
}

.ping-dot {
  width: 8px;
  height: 8px;
  background-color: #00aa00;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.time-display {
  font-size: 12px;
  font-family: monospace;
  background: #c0c0c0;
  padding: 4px 8px;
  border: 1px inset #808080;
}

.restart-btn, .shutdown-btn {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.restart-btn:active, .shutdown-btn:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

/* Start Menu */
.start-menu {
  position: fixed;
  bottom: 52px;
  left: 8px;
  width: 280px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  z-index: 200;
  font-family: 'Windows 95', 'Tahoma', sans-serif;
}

.start-menu-content {
  display: flex;
  flex-direction: column;
}

.start-menu-header {
  background: #000080;
  color: white;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 14px;
}

.start-menu-items {
  display: flex;
  flex-direction: column;
  padding: 4px;
}

.start-menu-items button {
  background: #c0c0c0;
  border: none;
  text-align: left;
  padding: 6px 12px;
  cursor: pointer;
  font-family: 'Windows 95', 'Tahoma', sans-serif;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.start-menu-items button:hover {
  background: #000080;
  color: white;
}

.start-menu-divider {
  height: 2px;
  background: #808080;
  margin: 4px 0;
  border-top: 1px solid #ffffff;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

::-webkit-scrollbar-track {
  background: #c0c0c0;
  border: 1px solid #808080;
}

::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
}

::-webkit-scrollbar-button {
  background: #c0c0c0;
  border: 1px solid #808080;
  width: 16px;
  height: 16px;
}
</style>