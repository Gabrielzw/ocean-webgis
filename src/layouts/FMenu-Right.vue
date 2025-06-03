<template>
  <div class="right-panel">
    <!-- Quick Stats -->
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-medium text-gray-800 mb-3">Quick Stats</h3>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Min:</span>
          <span class="font-medium">2.1m</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Max:</span>
          <span class="font-medium">4.5m</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Avg:</span>
          <span class="font-medium">3.2m</span>
        </div>
      </div>
      <!-- Polar Region Selector -->
      <div class="py-4 border-t border-gray-200 mt-auto">
        <h3 class="font-medium text-gray-800 mb-3">Polar Region</h3>
        <div class="bg-gray-100 p-1 rounded-full flex">
          <button
            @click="handleRegionChange('北极')"
            class="flex-1 py-1.5 px-3 rounded-full text-black text-sm font-medium"
            :class="{ 'bg-[#0891B2]': activeRegion === '北极' }">
            Arctic
          </button>
          <button
            @click="handleRegionChange('南极')"
            class="flex-1 py-1.5 px-3 rounded-full text-black text-sm font-medium"
            :class="{ 'bg-[#0891B2]': activeRegion === '南极' }">
            Antarctic
          </button>
        </div>
      </div>
      <!--  -->
    </div>
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

const activeRegion = ref('南极') // 默认选中南极

const handleRegionChange = (region) => {
  activeRegion.value = region;
  store.setActiveRegion(region);
}

</script>

<style scoped>
.right-panel {
  @apply w-[16rem] bg-white border border-[#E5E7EB];
}
</style>