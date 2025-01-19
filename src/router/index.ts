import {createMemoryHistory, createRouter} from 'vue-router'

import Login from '../pages/Login.vue'
import Main from "../pages/Main.vue";

const routes = [
    {name: 'main', path: '/', component: Main},
    {name: 'login', path: '/login', component: Login},
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
router.beforeEach((to, _) => {
    if (to.name !== 'login') {
        const token = localStorage.getItem('token')
        if (token) {
            return true
        } else {
            return {name: 'login'}
        }
    }
})