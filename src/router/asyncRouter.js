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
		path: '/tags',
        name: 'tags',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/article/tags')), 'tags'),
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
		component: r => require.ensure([], () => r(require('@/views/system/permission/menu')), 'permission'),
    },
    {
		path: '/permission/list',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/system/permission/list')), 'permission'),
    },
    {
		path: '/permission/role',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/system/permission/role')), 'role'),
    },
    {
		path: '/permission/allot',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/system/permission/allot')), 'permission'),
    },
    {
		path: '/users',
        name: 'users',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/system/users/users')), 'users'),
    },
    {
		path: '/files',
        name: 'files',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/system/files/index')), 'files'),
    },
     {
		path: '/chat',
        name: 'chat',
        meta:{
            permission:[]
        },
		component: r => require.ensure([], () => r(require('@/views/chat/index')), 'chat'),
    }
    
]


export default asyncRouter;