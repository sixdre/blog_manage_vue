import Api from '@/api/api'
const state = {
    // 类型列表
    categories: [],
    // 标签
    tags:[]
}

const getters = {}

const mutations = {
    setCategories: (state, data) => {
        state.categories = data
    },
    setTags:(state, data) => {
        state.tags = data
    }
}

const actions = {
    getCategories({ state, commit }) {
        return new Promise((resolve, reject) => {
            // if (!state.categories.length) {
                 Api.getCategoryList().then((res) => {
                    // 存储权限列表
                    commit('setCategories', res.data.data);
                    resolve(res.data.data)
                }).catch(() => {
                    reject()
                })
            // }
           
        })
    },

    getTags({ state,commit }) {
        return new Promise((resolve, reject) => {
            // if (!state.tags.length) {
                Api.getTagList().then((res) => {
                    // 存储权限列表
                    commit('setTags', res.data.data);
                    resolve(res.data.data)
                }).catch(() => {
                    reject()
                })
            // } 
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}