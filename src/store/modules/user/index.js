import Api from '@/api/api'
import Auth from '@/services/auth'
import { Message } from 'element-ui';


const state = {
    // 用户名
    username: Auth.getUserName(),
    // token
    token: Auth.getToken(),
    // 角色分组
    role: Auth.getRole(),
    // 头像
    avatar: Auth.getAvatar(),
    userInfo: {}
}

const getters = {}

const mutations = {
    setToken: (state, data) => {
        if (data) {
            Auth.login(data)
        } else {
            Auth.logout()
        }
        state.token = data
    },
    setAvatar: (state, data) => {
        Auth.setAvatar(data);
        state.avatar = data
    },
    setName: (state, data) => {
        Auth.setUserName(data);
        state.username = data
    },
    setRole: (state, data) => {
        Auth.setRole(data);
        state.role = data
    },
    setUserInfo: (state, data) => {
        state.userInfo = data
    },
}

const actions = {
    login({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
            Api.login(username, password).then(res => {
                if (res.data.code === 1) {
                    commit('setName', username);
                    commit('setToken', res.data.token);
                    commit('setRole', res.data.userInfo.role);
                    commit('setAvatar', res.data.userInfo.avatar);
                }
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 登出
    logout({ commit }) {
        return new Promise((resolve) => {
            commit('setToken', '')
            commit('setRole', '')
            commit('setName', '')
            commit('setAvatar', '')
            commit('permission/setResources', [], { root: true });
            commit('permission/setList', [], { root: true }) // 调用permission模块的 mutations
            resolve()
        })
    },
    //获取当前登录用户信息
    getUserInfo({ commit }) {
        return new Promise((resolve, reject) => {
            Api.getUserInfo().then((res) => {
                // 存储权限列表
                commit('permission/setList', res.data.menus, { root: true });
                commit('setUserInfo', res.data.userInfo);
                resolve(res.data.menus)
            }).catch(() => {
                reject()
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}