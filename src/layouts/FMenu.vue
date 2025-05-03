<template>
  <div class="f-menu">
    <el-menu>
      <el-menu-item index="/">首页</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed,ref } from 'vue';
import { useRouter,useRoute,onBeforeRouteUpdate } from 'vue-router';

</script>

<style scoped>
/* .f-menu {
    transition: all 0.2s;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-light-50;
} */
.f-menu::-webkit-scrollbar{
    width: 0px;
}
</style>