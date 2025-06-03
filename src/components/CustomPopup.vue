<template>
  <!-- 弹窗内容 -->
  <div v-if="isVisible" @click="closePopup">
    <div class="popup-container" :style="computedStyle" @click.stop>
      <slot></slot>
    </div>
  </div>

</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  x: { type: Number, default: 25 }, // 水平偏移量
  y: { type: Number, default: 50 }, // 垂直偏移量
  width: { type: [String, Number], default: 10 }, // 宽度
  height: { type: [String, Number], default: 10 } // 高度
})

// 定义 emits
const emit = defineEmits(['update:modelValue'])
const isVisible = ref(props.modelValue)

// 计算样式
const computedStyle = computed(() => ({
  top: `${props.y}px`, // 使用 props 的 y 值
  left: `${props.x}px`, // 使用 props 的 x 值
  width: `${props.width}rem`, // 使用 props 的 width 值
  height: `${props.height}rem`, // 使用 props 的 height 值
  // transform: 'translate(100%, -50%)'  // 偏移量
}))

watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue
})

const openModal = () => {
  isVisible.value = true;
  emit('update:modelValue', true);
};

const closeModal = () => {
  isVisible.value = false;
  emit('update:modelValue', false);
};

defineExpose({
  openModal,
  closeModal
});


</script>

<style scoped>
.popup-container {
  @apply z-9999 fixed opacity-70 bg-white w-40 h-40 p-2 rounded-lg top-[50%] left-[25%] text-dark-50 border-1 border-gray-300 shadow-md;
  transition: all 0.2s ease;
}

.fade-enter-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
}

/* 淡出动画 */
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>