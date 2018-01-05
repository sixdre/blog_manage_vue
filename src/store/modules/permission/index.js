import Api from '@/api/api'
import Auth from '@/services/auth'
// import { Message } from 'element-ui';

const state = {
    // 完整权限列表（菜单列表）
    list: [],
    // 权限列表（后台可请求的API）
    resources:[]
}

const getters = {}

const mutations = {
    setList: (state, data) => {
        state.list = data
    },
    setResources:(state, data) => {
        state.resources = data
    }
}

const actions = {
  
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}