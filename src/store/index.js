// 侧边栏实现，通过pinia管理状态，支持动态菜单配置和响应式布局

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import { setToken, removeToken } from '~/composables/auth'

// /** @type {{ text: string, id: number, isFinished: boolean }[]} */
// todos: [],

// 存储了用户的信息，页面状态等
export const appStore = defineStore('app', {
    state: () => ({
        username: '',
        isLoggedIn: false,
        isLoading: false,
        // 侧边栏宽度
        asideWidth: '250px', // 展开宽度,
    }),
    getters: {
        // 获取用户信息
        userInfo(state) {
            return state.username;
        }
    },
    actions: {
        // 更新用户信息
        updateUserInfo(userInfo) {
            this.username = userInfo.username;
            this.isLoggedIn = true;
        },
        // 登录用户
        login(userInfo) {
            this.updateUserInfo(userInfo);
            // 设置 cookie
            let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) // 生成随机 token
            setToken(token)
        },
        // 登出用户
        logout() {
            this.username = '';
            this.isLoggedIn = false;
            removeToken();
        },
        // 切换侧边栏
        toggleAside() {
            this.asideWidth = this.asideWidth === '250px' ? '64px' : '250px';
        }
    },
    persist: true,
})




