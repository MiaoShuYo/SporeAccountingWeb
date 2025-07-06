import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {router} from './router'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 添加响应拦截器处理401状态码
axios.interceptors.response.use(
  (response) => {
    // 检查业务层面的状态码
    if (response.data && response.data.statusCode === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      // 跳转到登录页面
      router.push({ name: 'login' })
      return Promise.reject(new Error('未授权，请重新登录'))
    }
    return response
  },
  (error) => {
    // 处理HTTP层面的401状态码
    if (error.response && error.response.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      // 跳转到登录页面
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.mount('#app')


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
