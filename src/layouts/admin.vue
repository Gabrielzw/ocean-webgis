<template>
    <el-container class="layout-container">
        <el-header>
            <FHeader />
        </el-header>
        <el-container class="flex-1">
            <el-aside :width="store.asideWidth">
                <FMenu />
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from '../layouts/FHeader.vue'
import FMenu from '../layouts/FMenu.vue'
import { appStore } from '~/store/index.js';

const store = appStore()

</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

</style>