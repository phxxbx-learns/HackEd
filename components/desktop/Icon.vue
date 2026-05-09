<template>
  <div class="desktop-icon" @click="openWindow">
    <div class="icon-image">
      <slot />
    </div>
    <p class="icon-label">{{ windowName }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  windowName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['openWindow']);

const openWindow = () => {
  emit('openWindow', props.windowName);
};
</script>

<style scoped>
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  cursor: pointer;
  padding: 4px;
}

.desktop-icon:hover {
  background: rgba(0, 0, 128, 0.3);
  outline: 1px dotted white;
}

.icon-image {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-label {
  font-size: 11px;
  color: white;
  text-align: center;
  font-family: 'Windows 95', 'Tahoma', monospace;
  text-shadow: 1px 1px 0 #000000;
  margin-top: 4px;
}
</style>