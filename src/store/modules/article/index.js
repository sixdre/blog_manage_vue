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
    getCateTag({ state, commit }) {
        return new Promise((resolve, reject) => {
            Api.getCateAnTags().then((res) => {
                commit('setCategories', res.data.data.categories);
                commit('setTags', res.data.data.tags);
                resolve(res.data.data)
            }).catch(() => {
                reject()
            })
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