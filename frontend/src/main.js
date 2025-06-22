import { createApp } from 'vue'
import myRouter from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import axios from 'axios'

createApp(App).use(myRouter).use(ElementPlus, { zhCn }).provide('$axios', axios).mount('#app')
