<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div>欢迎使用</div>
        <div>渤海赤潮监测与预测系统</div>
      </div>
    </el-col>

    <el-col v-if="!isRegistering" :lg="8" :md="12" class="right">
      <h2 class="title">登录</h2>

      <div>
        <span class="line"></span>
      </div>
      
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="密码" show-password>
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="max-h-screen text-right mb-1">
          <el-link type="default" @click="isRegistering=true">注册</el-link>
        </div>

        <el-form-item>
          <el-button round color="#626aef" class="w-[250px]" type="primary" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col v-else :lg="8" :md="12" class="right">
      <h2 class="title">注册</h2>

      <div>
        <span class="line"></span>
      </div>
      
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="密码" show-password>
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="form.confirmPassword" placeholder="确认密码" show-password>
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button round color="#626aef" class="w-[250px]" type="primary" @click="handleRegister">注 册</el-button>
        </el-form-item>

        <el-form-item>
          <el-button round color="#e11d48" class="w-[250px]" type="primary" @click="isRegistering=false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-col>

  </el-row>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { useCookies } from '@vueuse/integrations/useCookies';

import { setToken } from '~/composables/auth';
import { toast } from "~/composables/util";
import { appStore } from '~/store/index.js';

// 用户信息，网页状态
const store = appStore();

// 使用 useLocalStorage 自动处理响应式和本地存储
const users = useLocalStorage('users', [])
const currentUser = useLocalStorage('currentUser', null)

// 使用 VueUse 的 cookies (有效期7天)
const cookies = useCookies(['auth'])

const router = useRouter()

const isRegistering = ref(false) // 控制是否显示注册页面

// do not use same name with ref
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
  ],
}

const formRef = ref(null)

const handleLogin = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 检查用户名和密码是否匹配
      if(!users.value.some(user => user.username == form.username)){
        toast('错误', '用户名不存在！', 'error')
        return false
      }
      store.updateUserInfo({username: form.username})
      // 2. 设置 cookie
      let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) // 生成随机 token
      setToken(token)
      //
      toast('成功', '登录成功', 'success')
      router.push('/')
    } else {
      toast('错误', '请输入正确的用户名和密码', 'error')
      return false
    }
  })
}

const handleRegister = () => {
  if (form.username === '') {
    toast('错误', '用户名不能为空', 'error')
    return
  }
  else if (form.password === '') {
    toast('错误', '密码不能为空', 'error')
    return
  }
  else if (form.password !== form.confirmPassword || form.confirmPassword=='') {
    toast('错误', '密码不一致', 'error')
    return
  }
  if (users.value.some(user => user.username === form.username)) {
    toast('错误', '用户名已存在', 'error')
    return
  }
  // 1. 存储到 localStorage
  users.value.push({
    username: form.username,
    password: form.password, // 实际项目中密码应该加密
    createdAt: new Date().toISOString()
  })

  toast('成功', '注册成功', 'success')

  form.username = ''
  form.password = ''
  form.confirmPassword = ''
  isRegistering.value = false
  // 3. 返回 cookie 信息
  // return {
  //   cookie: cookies.get('auth'),
  //   localData: users.value.find(u => u.username === form.username)
  // }
}

</script>

<style scoped>
.login-container {
  @apply min-h-screen bg-indigo-500;
}
.login-container .left, .login-container .right{
  @apply flex items-center justify-center;
}
.login-container .right{
  @apply bg-light-50 flex-col;
}
.left>div>div:first-child{
  @apply font-bold text-5xl text-light-50 tracking-widest mb-4;
}
.left>div>div:last-child{
  @apply text-gray-200 text-2xl tracking-widest;
}
.right .title{
  @apply font-bold text-3xl text-gray-800 tracking-widest;
}
.right>div{
  @apply flex items-center justify-center mb-7;
}
.right .line{
  @apply h-[5px] w-16 bg-cyan-200;
}
</style>