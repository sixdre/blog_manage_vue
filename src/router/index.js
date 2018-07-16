import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import Auth from '@/services/auth'
import asyncRouter from './asyncRouter'
NProgress.configure({ showSpinner: true });

Vue.use(Router)

//路由白名单（用于不需要验证的路由）
const whiteList = [
    '/login',
    '/register'
]

//初始化的路由
var routes = [{
    path: '/',
    name: 'index',
    redirect: '/welcome',
    component: r => require.ensure([], () => r(require('@/layouts/layout'))),
    children: [{
            path: '/welcome',
            name: 'welcome',
            component: r => require.ensure([], () => r(require('@/views/main')), 'main'),
        },
        {
            path: '/chat',
            name: 'chat',
            meta: {
                permission: []
            },
            component: r => require.ensure([], () => r(require('@/views/chat/index')), 'chat'),
            children: [{
                path: '/chat/:targetId',
                name: 'conversation',
                meta: {
                    permission: []
                },
                component: r => require.ensure([], () => r(require('@/views/chat/message-list')), 'chat'),
            }]
        },

    ]
}, {
    path: '/login',
    name: 'login',
    component: r => require.ensure([], () => r(require('@/views/auth/login')))
}, {
    path: '/404',
    name: 'notFound',
    component: r => require.ensure([], () => r(require('@/views/auth/404')))
}, {
    path: '/403',
    name: 'forbidden',
    component: r => require.ensure([], () => r(require('@/views/auth/403')))
}]

//这个用作动态路由的父页
const baseAsyncRouter = {
    path: '/asyncRouter',
    redirect: '/404',
    component: r => require.ensure([], () => r(require('@/layouts/layout')), 'layout'),
    children: []
}


const router = new Router({
    linkActiveClass: 'active',
    routes: routes
})



/**
 * 根据权限匹配路由
 * @param {array} permission 权限列表（菜单列表）
 * @param {array} routeList 异步路由对象数组
 */
function routerMatch(permission, routeList) {
    return new Promise((resolve) => {
        if (!permission.length || !Array.isArray(permission)) {
            resolve([])
            return
        }
        let routers = [];

        function createRouter(permission) {
            permission.forEach((item) => {
                if (item.child && item.child.length) {
                    createRouter(item.child)
                }
                let path = item.path
                    // 循环异步路由，将符合权限列表的路由加入到routers中
                routeList.find(function(s) {
                    if (s.path == path) {
                        s.meta.permission = item.permission
                        routers.push(s)
                        return;
                    }
                })
            })
        }
        createRouter(permission)
        resolve(routers)
    })
}


router.beforeEach((to, from, next) => {
    NProgress.start();
    if (Auth.authenticated()) {
        if (to.path === '/login') { //已登录不可以再次回到登录页面，再次登录需要先退出系统
            router.replace('/')
        } else {
            if (store.state.permission.list.length === 0) { //页面刷新需要重新请求
                store.dispatch('user/getUserInfo').then(res => {
                    // 匹配并生成需要添加的路由对象
                    routerMatch(res, asyncRouter).then(data => {
                        baseAsyncRouter.children = data;
                        router.addRoutes([baseAsyncRouter]);
                        next({...to })
                    })
                }).catch(() => {
                    // console.log('登录错误')
                    // store.dispatch('user/logout').then(() => {
                    // 	router.replace('/login')
                    // })
                })
            } else {
                if (to.matched.length) {
                    // if(whiteList.indexOf(to.path) < 0){
                    // 	// store.dispatch('user/actionlog', to)
                    // }
                    next()
                } else {
                    router.replace('/404')
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) >= 0) {
            next()
        } else {
            router.replace('/login')
            NProgress.done()
        }
    }

})

router.afterEach(() => {
    NProgress.done();
})


export default router