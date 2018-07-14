import $http from '@/services/http'
export default {

    //首页统计
    graph() {
        return $http.get('/sys/graph');
    },
    getUserInfoById(id) {
        return $http.get(`/api/users/${id}/info`);
    },
    /**
     * 登录
     */
    login(username, password) {
        return $http.post('/sys/login', { username: username, password: password });
    },
    //创建用户
    createUser(data) {
        return $http.post('/sys/regist', data);
    },
    //获取登录用户信息
    getUserInfo() {
        return $http.get('/api/userInfo');
    },
    //获取文章列表
    getArticleList(params) {
        return $http.get('/api/articles', { params });
    },
    //获取文章详情
    getArticleInfo(id) {
        return $http.get('/api/articles/' + id);
    },
    //获取文章类型和标签
    getCateAnTags() {
        return $http.get('/api/catetag');
    },
    //发表文章
    createArticle(data) {
        return $http.post('/api/articles', { article: data });
    },
    //创建草稿
    createDraft(data) {
        return $http.post('/api/draft', { article: data });
    },
    //获取草稿
    getDraft() {
        return $http.get('/api/me/drafts');
    },
    //更新文章
    updateArticle(id, data) {
        return $http.put('/api/articles/' + id, { article: data });
    },
    //删除文章
    removeArticle(id) {
        return $http.delete('/api/articles/' + id);
    },
    //恢复文章
    recoverArticle(id) {
        return $http.put(`/api/articles/${id}/recover/`);
    },
    //获取分类列表
    getCategoryList() {
        return $http.get('/api/categories');
    },
    //添加分类
    createCategory(name) {
        return $http.post('/api/categories', { name });
    },
    //删除分类
    removeCategory(id) {
        return $http.delete('/api/categories/' + id);
    },
    //获取标签列表
    getTagList() {
        return $http.get('/api/tags');
    },
    //添加标签
    createTag(name) {
        return $http.post('/api/tags', { name });
    },
    //删除标签
    removeTag(id) {
        return $http.delete('/api/tags/' + id);
    },
    getFileList(params) {
        return $http.get('/sys/allFiles', { params });
    },
    addFile(formData, callback) {
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        return $http({
            method: 'post',
            url: '/sys/upload/addFile',
            data: formData,
            config,
            onUploadProgress: function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    if (callback && typeof callback == 'function') {
                        callback(progressEvent)
                    }
                }
            }
        });
    },
    upload(formData, callback) {
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        return $http({
            method: 'post',
            url: '/sys/upload',
            data: formData,
            config,
            onUploadProgress: function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    if (callback && typeof callback == 'function') {
                        callback(progressEvent)
                    }
                }
            }
        });
    },
    //创建权限
    createPermission(data) {
        return $http.post('/sys/permission', data);
    },
    //更新权限
    updatePermission(id, data) {
        return $http.put('/sys/permissions/' + id, data);
    },
    //获取权限列表
    getPermissionList({ page = 1, limit = 5, group = 0 }) {
        return $http.get('/sys/permissions', { params: { page, limit, group } });
    },
    //保存角色权限
    saveRolePermission(roleId, menuIds, permissionIds) {
        return $http.post('/sys/roles/' + roleId + '/permission', { menuIds, permissionIds });
    },
    //获取tree类型菜单
    getMenuList() {
        return $http.get('/sys/menus');
    },
    //创建菜单
    createMenu(data) {
        return $http.post('/sys/menus', data);
    },
    //删除菜单
    removeMenu(id) {
        return $http.delete('/sys/menus/' + id);
    },
    //更新菜单
    updateMenu(id, data) {
        return $http.put('/sys/menus/' + id, data);
    },
    //获取角色的权限
    getRolePermission(roleId) {
        return $http.get('/sys/roles/' + roleId + '/permission');
    },
    //获取角色列表
    getRoles() {
        return $http.get('/sys/roles');
    },
    //创建角色
    createRole(name) {
        return $http.post('/sys/roles', { name });
    },
    //获取用户列表
    getUsers({ page = 1, limit = 5 }) {
        return $http.get('/sys/users', { params: { page, limit } });
    },
    //删除用户
    removeUser(id) {
        return $http.delete('/sys/users/' + id);
    },
    //更新或分配用户的角色
    updateUserRole(userId, roleId) {
        return $http.post('/sys/users/' + userId + '/role', { roleId });
    },

}