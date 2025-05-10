<template>
  <div class="f-menu" :style="{ width: store.asideWidth }">
    <el-menu 
    :collapse="isCollapse" 
    :default-active="activeIndex" 
    class="border-0" 
    @select="handleSelect"
    :collapse-transition="false">
      <template v-for="(item, index) in menus" :key="index">
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.path">
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>

      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { appStore } from '~/store/index.js';

const store = appStore()
const router = useRouter()

const activeIndex = ref('/map')

const menus = [{
  "name": "地图",
  "icon": "help",
  "path": "/map",
}, {
  "name": "2",
  "icon": "help",
  "path": "/404",
}, {
  "name": "3",
  "icon": "help",
  "path": "/404",
},
]

// 是否折叠
const isCollapse = computed(() => !(store.asideWidth == '250px'))

const handleSelect = (index) => {
  router.push(index);
}

</script>

<style scoped>
.f-menu {
  @apply shadow-lg fixed bg-light-50;
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>