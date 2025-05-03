<template>
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-1">
        <ElemeFilled />
      </el-icon>
      渤海赤潮检测与预测系统
    </span>

    <div class="ml-auto flex items-center">
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50">
          <el-avatar class="mr-2" :size="25" :src="'https://vuejs.org/logo.svg'" />
          {{ "admin" }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { appStore } from '~/store/index.js';

import { useRouter } from "vue-router";
import { toast } from "~/composables/util";

const store = appStore();
const router = useRouter()

const handleCommand = (command) => {
  switch (command) {
    case 'rePassword':
      ElMessage({ message: '修改密码', type: 'success' });
      break;
    case 'logout':
      store.logout();
      router.push('/login');
      toast('成功', '已退出登录', 'success');
      break;
    default:
      break;
  }
}


</script>

<style scoped>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 1000;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}
</style>