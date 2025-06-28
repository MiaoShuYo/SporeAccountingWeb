import {createMemoryHistory, createRouter} from 'vue-router'

import Login from '../pages/Login.vue'
import Main from "../pages/Main.vue";
import PrimaryCurrency from "../pages/config/PrimaryCurrency.vue";
import notfound from "../pages/404.vue";
import Index from "../pages/Index.vue";
import IncomeExpenditureType from "../pages/config/IncomeExpenditureType.vue";
import Budget from "../pages/config/budget.vue";
import AccountBook from "../pages/AccountBook.vue";

const routes = [
    {
        name: 'main', path: '/', component: Main, children: [
            {
                name: 'index', path: '', component: Index
            },
            {
                name: 'accountBook', path: 'accountBook', component: AccountBook
            },
            {
                name: 'config', path: 'config', children: [
                    {
                        name: 'primaryCurrency',
                        path: 'primaryCurrency',
                        component: PrimaryCurrency
                    },
                    {
                        name: 'incomeExpenditureType',
                        path: 'incomeExpenditureType',
                        component: IncomeExpenditureType
                    },
                    {
                        name: 'budget',
                        path: 'budget',
                        component: Budget
                    }
                ]
            },
        ]
    },
    {name: 'login', path: '/login', component: Login},
    {name: 'notFound', path: '/:pathMatch(.*)*', component: notfound},
]

// 判断路由是否在子路由中
const isRouteInChildren = (routes: any[], routeName: string): boolean => {
    for (const route of routes) {
        if (route.name === routeName) {
            return true;
        }
        if (route.children && isRouteInChildren(route.children, routeName)) {
            return true;
        }
    }
    return false;
};

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export const navigateTo = (routeName: string) => {
    router.push({name: routeName});
};

router.beforeEach((to, from, next) => {
    // 如果路由名称为空，重定向到主页面
    if (!to.name) {
        next({name: 'main'});
        return;
    }
    
    // 不在父级路由以及子路由中跳转到404
    if (!isRouteInChildren(routes, to.name as string)) {
        next({name: 'notFound'});
        return;
    }
    
    if (to.name !== 'login') {
        const token = localStorage.getItem('token')
        if (token) {
            next();
        } else {
            next({name: 'login'});
        }
    } else {
        next();
    }
})