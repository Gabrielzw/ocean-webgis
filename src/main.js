import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './style.css'
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

app.mount('#app')
