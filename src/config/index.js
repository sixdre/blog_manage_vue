let baseUrl;
if (process.env.NODE_ENV == 'development') {
    baseUrl = ''
} else if (process.env.NODE_ENV == 'production') {
    baseUrl = 'http://47.94.206.86:7893'
}
export default {
    baseUrl,
    avatar: 'USER_AVATAR',
    userName: 'userName',
    role: 'roleName',
    userToken: 'tk',
    uid: 'uid',
    routerMode: 'history',
    imgBaseUrl: ''
}