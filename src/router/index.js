import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login'
import Index from '../views/index'
import User from '../views/user'
import Car from '../views/car'
import Maintain from '../views/car/Maintain'
import Other from '../views/car/Other'
import Location from '../views/activity/Location.vue'
import Driver from '../views/driver'
import Activity from '../views/activity'
import Export from '../views/export'
import About from '../views/about'
import CreateLine from "../views/activity/CreateLine";
import Apply from '../views/apply'


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/apply',
        name: 'apply',
        component: Apply
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'index',
                component: Index,
            },
            {
                path: '/user',
                name: 'user',
                component: User,
            },
            {
                path: '/car',
                name: 'car',
                component: Car,
            },
            {
                path: '/car/maintain',
                name: 'maintain',
                component: Maintain,
            },
            {
                path: '/car/other',
                name: 'other',
                component: Other,
            },

            {
                path: '/driver',
                name: 'driver',
                component: Driver,
            },
            {
                path: '/activity',
                name: 'activity',
                component: Activity,
            },
            {
                path: '/activity/location',
                name: 'location',
                component: Location,
            },
            {
                path: '/activity/create/:index',
                name: 'create',
                component: CreateLine,
            },
            {
                path: '/export',
                name: 'export',
                component: Export,
            },
            {
                path: '/about',
                name: 'about',
                component: About,
            },
        ]
    },

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转过来
    // next() 放行函数
    if (to.path === '/login' || to.path === '/apply')
        return next();
    const token = window.sessionStorage.getItem('token')
    if (!token)
        return next('/login')
    next();
})

/*********************/

export default router
