<template>
  <div class="f-header">
    <span class="logo">
      <img src="../assets/pic/snow_flake.gif" class="w-[24px] h-[24px] ml-2 mr-2" alt="logo">
      <!-- <IcecreamThree class="mr-2" theme="outline" size="24" fill="#ffffff"/> -->
      <div class="tracking-wider w-full">{{ config.app.name }}</div>
    </span>

    <div class="date-select">
      {{ formatDate(store.currentDate) }}
    </div>

    <div class="icons">
      <!-- <div class="icon settings-icon" title="Settings"></div>
      <div class="icon upload-icon" title="Upload"></div>
      <div class="icon user-icon" title="User"></div> -->
      <Config class="mr-4" theme="outline" size="24" fill="#ffffff"/>
      <Download class="mr-4" theme="outline" size="24" fill="#ffffff"/>
      <People class="mr-4" theme="outline" size="24" fill="#ffffff"/>
    </div>


    <!-- <div class="ml-auto flex items-center">
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50">
          <el-avatar class="mr-2" :size="25" :src="'https://img.picgo.net/2025/05/04/nozomie77326549efc5250.th.png'" />
          {{ store.username }}
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
</div> -->
  </div>

  <el-drawer v-model="showDrawer" title="修改密码" size="45%" :close-on-click-modal="false">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="oldPassword" label="旧密码">
        <el-input v-model="form.oldPassword" placeholder="旧密码">
        </el-input>
      </el-form-item>

      <el-form-item prop="newPassword" label="新密码">
        <el-input type="password" v-model="form.newPassword" placeholder="新密码" show-password>
        </el-input>
      </el-form-item>

      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input type="password" v-model="form.confirmPassword" placeholder="确认密码" show-password>
        </el-input>
      </el-form-item>
    </el-form>

    <el-row class="flex-row-reverse">
      <el-button round color="#e11d48" type="primary" @click="handleCancel">取 消</el-button>
      <el-button class="mr-2" round color="#626aef" type="primary" @click="handleSubmit">提 交</el-button>

    </el-row>
  </el-drawer>

  <!-- <form-drawer ref="formDrawerRef"></form-drawer> -->

</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus';
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { Config, IcecreamThree, Download, People } from '@icon-park/vue-next'

import config from '~/config.json';
import FormDrawer from "~/components/FormDrawer.vue";
import { appStore } from '~/store/index.js';
import { formatDate } from '~/composables/map';
import { toast } from "~/composables/util";
import { useRepassword, useLogout } from "~/composables/useManager";

const { form, formRef, rules } = useRepassword()
const { handleLogout } = useLogout()

const store = appStore()
const router = useRouter()

const formDrawerRef = ref(null); // 引用 FormDrawer 组件实例
const showDrawer = ref(false)

const users = useLocalStorage('users', [])

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const userIndex = users.value.findIndex(user => user.username === store.username)
      const user = users.value[userIndex]

      if (user.password !== form.oldPassword) {
        toast('错误', '旧密码错误', 'error')
        return false
      }
      if (user.password === form.newPassword) {
        toast('错误', '新密码不能与旧密码相同', 'error')
        return false
      }
      if (form.newPassword !== form.confirmPassword) {
        toast('错误', '密码不一致', 'error')
        return false
      }
      // 更新密码
      users.value[userIndex] = {
        ...user,
        password: form.newPassword,
        updatedAt: new Date().toISOString() // 添加更新时间
      }

      // 重置表单
      formRef.value.resetFields()

      toast('成功', '密码修改成功', 'success')
      showDrawer.value = false;

      // 可选：密码修改后强制重新登录
      store.logout()
      router.push('/login')
    }
  })
}

const handleCancel = () => {
  showDrawer.value = false;
}

const handleCommand = (command) => {
  switch (command) {
    case 'rePassword':
      showDrawer.value = true;
      // formDrawerRef.value.open();
      break;
    case 'logout':
      handleLogout()
      break;
    default:
      break;
  }
}



</script>

<style scoped>
.f-header {
  @apply flex items-center justify-between bg-gradient-to-r from-[#0A2D5E] to-[#00B4D8] text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 1000;
}

.logo {
  @apply flex justify-center items-center w-[20rem] text-xl font-thin px-2;
}

.icons {
  @apply flex flex-row-reverse w-[16rem];
  gap: 20px;
}

.f-header .dropdown {
  height: 48px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}

.collapse-btn {
  @apply flex justify-center items-center ml-0;
  width: 64px;
  height: 48px;
  cursor: pointer;
}

.collapse-btn:hover {
  @apply bg-indigo-600;
}
</style>