<template>
  <el-container class="layout-container">
    <el-header>
      <FHeader />
    </el-header>

    <el-container>
      <el-aside>
        <FMenu />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>

  </el-container>
</template>

<script setup>
import FHeader from '../layouts/FHeader.vue'
import FMenu from '../layouts/FMenu.vue'
import { appStore } from '~/store/'

const store = appStore();

</script>

<style scoped>
.el-aside{
  width: 200px;
  transition: all 0.2s;
}
.layout-container {
  height: 100vh; /* 关键：设置容器高度为视口高度 */
}

</style>