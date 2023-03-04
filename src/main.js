import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia';
import router from './router'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia).use(router).use(ElementPlus, { locale: zhCn })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
// app.config.globalProperties.$scoreType = ["", "日常行为分", "个性发展分", "创新创业分", "讲座文化素质分"]
// app.config.globalProperties.$year = [2023, 2024, 2025]
