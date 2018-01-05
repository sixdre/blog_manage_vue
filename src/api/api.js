import $http from '@/services/http'

export default {
    /**
     * 登录
     */
    login(username, password) {
        return $http.post('/api/admin_login', { username: username, password: password });
    },
    //获取登录用户信息
    getUserInfo() {
        return $http.get('/api/userInfo');
    },
    //获取文章列表
    getArticleList(params) {
         return $http.get('/api/articles',{params});
    },
    //发表文章
    createArticle(data) {
        return $http.post('/api/articles', {article: data});
    },
    //删除文章
    removeArticle(id) {
         return $http.delete('/api/articles/'+id);
    },

    //获取分类列表
    getCategoryList() {
        return $http.get('/api/categories');
    },
    //获取标签列表
    getTagList() {
        return $http.get('/api/tags');
    },























    //创建权限
    createPermission(data) {
        return $http.post('/api/permission', data);
    },
    //更新权限
    updatePermission(id,data) {
        return $http.put('/api/permissions/'+id, data);
    },
    //获取权限列表
    getPermissionList({page=1,limit=5,group=0}) {
        return $http.get('/api/permissions',{params:{page,limit,group}});
    },
    //保存角色权限
    saveRolePermission( roleId, menuIds,permissionIds) {
         return $http.post('/api/roles/'+roleId+'/permission', { menuIds,permissionIds});
    },
    //获取tree类型菜单
    getMenuList() {
        return $http.get('/api/menus');
    },
    //创建菜单
    createMenu(data) {
        return $http.post('/api/menus', data);
    },
    //删除菜单
    removeMenu(id) {
        return $http.delete('/api/menus/'+id);
    },
    //更新菜单
    updateMenu(id,data) {
        return $http.put('/api/menus/'+id,data);
    },
    //获取角色的权限
    getRolePermission(roleId) {
         return $http.get('/api/roles/'+roleId+'/permission');
    },
    //获取角色列表
    getRoles() {
        return $http.get('/api/roles');
    },
    //创建角色
    createRole(name) {
        return $http.post('/api/roles', { name });
    },
    //获取用户列表
    getUsers({ page = 1, limit = 5 }) {
        return $http.get('/api/users',{params:{page,limit}});
    },
    //创建用户
    createUser(data) {
        return $http.post('/api/users', data);
    },
    //删除用户
    removeUser(id) {
        return $http.delete('/api/users/'+id);
    },
    //更新或分配用户的角色
    updateUserRole(userId, roleId) {
        return $http.post('/api/users/role', { userId, roleId });
    },

}