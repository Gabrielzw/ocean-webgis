<template>
    <el-container class="layout-container">
        <el-header class="h-[64px]">
            <FHeader />
        </el-header>
        <el-container class="flex-1">
            <el-aside class="z-2000 w-[20rem] flex flex-col">
                <FMenuLeft />
            </el-aside>
            <el-main class="p-0">
                <router-view v-slot="{ Component }">
                    <Transition 
                    enter-active-class="animate__animated animate__fadeInUp custom-duration custom-delay"
                    leave-active-class="animate__animated animate__fadeOutDown custom-duration">
                        <KeepAlive :max="10">
                            <component :is="Component"></component>
                        </KeepAlive>
                    </Transition>
                </router-view>
            </el-main>
            <el-aside class="z-2000 w-[16rem] flex flex-col">
                <FMenuRight />
            </el-aside>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from '../layouts/FHeader.vue'
import FMenuLeft from './FMenu-Left.vue'
import FMenuRight from './FMenu-Right.vue'
import { appStore } from '~/store/index.js';

const store = appStore()

</script>

<style scoped>
.layout-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.el-aside {
    transition: all 0.2s;
}
.custom-duration {
    animation-duration: 0.3s; /* 自定义持续时间 */
}
.custom-delay {
    animation-delay: 0.3s; /* 自定义延迟时间 */
}
</style>