const getters = {
    navList: state => state.permission.list,
    role: state => state.user.role,
    username: state => state.user.username,
    userInfo: state => state.user.userInfo,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    categories: state => state.article.categories,
    tags: state => state.article.tags
}
export default getters