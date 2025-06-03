// 侧边栏实现，通过pinia管理状态，支持动态菜单配置和响应式布局
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import { setToken, removeToken } from '~/composables/auth'
import { formatDate } from '~/composables/map';

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
        currentDate: new Date(2025, 0, 1).getTime(),
        layerStatus: {
            baseLayer: { visible: true, layerOpacity: 1.0, name: '底图' }, // 底图
            sicLayer: { visible: true, layerOpacity: 1.0, name: '海冰浓度' }, // 海冰浓度
            sndLayer: { visible: false, layerOpacity: 1.0, name: '积雪厚度' }, // 积雪厚度
        },
        mapStatus: {
            activeRegion: '南极',
            backgroundColor: '#3f3f41',
        },
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
        },
        // 更新日期
        updateDate(date) {
            this.currentDate = date;
        },
        // 更新图层可见性
        setLayerVisible(layerKey) {
            if (layerKey == 'baseLayer') return;
            this.layerStatus[layerKey].visible = !this.layerStatus[layerKey].visible;
        },
        // 更新图层透明度
        setLayerOpacity(layerKey, layerOpacity) {
            if (layerKey == 'baseLayer') return;
            this.layerStatus[layerKey].layerOpacity = layerOpacity;
        },
        // 更新地图区域
        setActiveRegion(region){
            this.mapStatus.activeRegion = region;
        },
        // 更新地图背景色
        setMapBackgroundColor(color){
            this.mapStatus.backgroundColor = color;
        }
    },
    persist: true,
})




