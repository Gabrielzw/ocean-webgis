// 侧边栏实现，通过pinia管理状态，支持动态菜单配置和响应式布局

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import { setToken, removeToken} from '~/composables/auth'

// /** @type {{ text: string, id: number, isFinished: boolean }[]} */
// todos: [],

// 存储了用户的信息，页面状态等
const appStore = defineStore('app', {
    state: () => {
        return {
            token: useLocalStorage('users', ''),
        }
    },
    getters: {
        
    },
    actions: {
        
    }
})

export default appStore




