<template>
  <div class="gap-1 flex flex-col items-center justify-center" @click="openWindow">
    <div class="self-center flex flex-col items-center justify-center">
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

const isWindowOpen = ref(false);

const openWindow = () => {
  isWindowOpen.value = !isWindowOpen.value;
  emit('openWindow', props.windowName);
};
</script>

<style scoped>
.icon-label {
  font-size: 0.75rem;
  color: #ffffff;
  text-align: center;
  font-family: 'Windows 95', 'Tahoma', 'MS Sans Serif', sans-serif;
  text-shadow: 1px 1px 0 #000000;
  margin-top: 4px;
  letter-spacing: 0.5px;
  font-weight: normal;
}
</style>