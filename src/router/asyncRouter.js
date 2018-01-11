// 需要权限访问的完整路由表
// 获取权限后和该表匹配的则被加入到正式路由中。该表必须完整的包含工程页面
// path 页面跳转地址
// permission字段内容从后台获取，代表该页内部详细权限，以key:value形式存储


const asyncRouter = [
    {
        path: '/article',
        redirect: '/article/publish',
        meta:{
            permission:[]
        },
        component: r => require.ensure([], () => r(require('@/layouts/empty')), 'article'),
    },
    {
        path: '/article/publish',
        meta:{
            permission:[]
        },
        component: r => require.ensure([], () => r(require('@/views/article/publish')), 'article'),
    },
    {
        path: '/article/list',
        meta:{
            permission:[]
        },
        component: r => require.ensure([], () => r(require('@/views/article/list')), 'article'),
    },
    {
		path: '/permission',
        meta:{
            permission:[]
        },
        component: r => require.ensure([], () => r(require('@/layouts/empty')), 'permission'),
    },
    {
		path: '/permission/menu',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/permission/menu')), 'permission'),
    },
    {
		path: '/permission/list',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/permission/list')), 'permission'),
    },
    {
		path: '/permission/role',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/permission/role')), 'role'),
    },
    {
		path: '/permission/allot',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/permission/allot')), 'permission'),
    },
    {
		path: '/users',
        name: 'users',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/users/users')), 'users'),
    },
    {
		path: '/files',
        name: 'files',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/files/index')), 'files'),
    },
    {
		path: '/tags',
        name: 'tags',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/tags/index')), 'tags'),
    }
    
]


export default asyncRouter;