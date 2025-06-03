<template>
  <div class="left-panel">
    <div class="tools-container">
      <div class="tool-wrapper">
        <button class="tool-btn" @click="toggleDropdown">
          <div class="btn-content">
            <Time class="mt-[0.15rem]" theme="outline" size="16" fill="#0A2D5E" />
            <span class="btn-text">时空分析</span>
          </div>
          <Down theme="outline" size="16" fill="#0A2D5E" class="arrow-icon" :class="{ 'open': isOpen }" />
        </button>

        <div class="dropdown-menu" v-if="isOpen">
          <div class="dropdown-item" v-for="(item, index) in menuItems" :key="index"
            :class="{ 'selected': selectedItem === item }" @click="selectItem(item)">
            <iconpark-icon :name="item.icon" size="16"
              :fill="selectedItem === item ? '#0066cc' : '#333'"></iconpark-icon>
            {{ item.label }}
          </div>
        </div>

      </div>

      <div class="tool-wrapper">
        <button class="tool-btn" @click="toggleDropdown">
          <div class="btn-content">
            <Time class="mt-[0.15rem]" theme="outline" size="16" fill="#0A2D5E" />
            <span class="btn-text">统计预测</span>
          </div>
          <Down theme="outline" size="16" fill="#0A2D5E" class="arrow-icon" :class="{ 'open': isOpen }" />
        </button>
      </div>

      <div class="tool-wrapper">
        <button class="tool-btn" @click="toggleDropdown">
          <div class="btn-content">
            <Time class="mt-[0.15rem]" theme="outline" size="16" fill="#0A2D5E" />
            <span class="btn-text">区域对比</span>
          </div>
          <Down theme="outline" size="16" fill="#0A2D5E" class="arrow-icon" :class="{ 'open': isOpen }" />
        </button>
      </div>

    </div>
    <div class="layer-controls"></div>
  </div>
</template>

<script setup>
import { Time, Down } from '@icon-park/vue-next';
import { computed, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { appStore } from '~/store/index.js';

const store = appStore()
const router = useRouter()
const route = useRoute()

const isOpen = ref(false)
const selectedItem = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const menuItems = ref([
  { label: 'Time Series', icon: 'ChartLine' },
  { label: 'Seasonal Analysis', icon: 'Calendar' },
  { label: 'Trend Analysis', icon: 'Trend' }
])

const selectItem = (item) => {
  selectedItem.value = item
  isOpen.value = false
  // 这里可以添加选中后的逻辑
  console.log('Selected:', item.label)
}

const activeIndex = ref(route.path)

const menus = [{
  "name": "地图",
  "icon": "help",
  "path": "/map",
}, {
  "name": "2",
  "icon": "help",
  "path": "/404",
}, {
  "name": "设置",
  "icon": "help",
  "path": "/setting",
},
]

// 是否折叠
const isCollapse = computed(() => !(store.asideWidth == '250px'))

const handleSelect = (index) => {
  router.push(index);
}

const showDropdown = ref(false);
</script>

<style scoped>
.left-panel {
  @apply flex flex-col h-full w-[20rem] bg-white p-4 border border-[#E5E7EB];
}

.tools-container {
  @apply flex flex-col gap-4;
}

.tool-wrapper {
  @apply border-2 border-[#E5E7EB] rounded-md bg-[#F9FAFB];
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 120px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 15px;
  text-align: left;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tool-btn {
  @apply flex items-center justify-between h-12 w-full py-2 px-4 bg-[#F9FAFB];
  cursor: pointer;
  transition: all 0.3s;
}

.btn-content {
  @apply flex items-center gap-2;
  line-height: 1;
}

.btn-text {
  @apply text-[#000000] text-[0.875rem] align-middle;
}

.tool-btn:hover {
  background-color: #e8e8e8;
}

.arrow-icon {
  transition: transform 0.3s;
}

.arrow-icon.open {
  transform: rotate(180deg);
}
</style>