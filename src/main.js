import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'

import './style.css'
import 'animate.css'
import './assets/style/fonts.css'
import 'element-plus/dist/index.css'
import '@icon-park/vue-next/styles/index.css'

import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import 'virtual:windi.css'

import './permission'

import 'nprogress/nprogress.css'

app.mount('#app')
