
export default {
    state: {
        collectList: [],
    },
    // 由于分了模块，在组件里面不能直接用　...mapState 分发一个数组，要用
    //              collectList: state => state.collect.collectList
    // 所以使用getter
    getters: {
        collectList: state => state.collectList,
    },

    mutations: {
        setcollectList(state, payload) {
            state.collectList = payload == undefined ? [] : payload
            localStorage.setItem("collectList", JSON.stringify(state.collectList))
            log("在vuex,localStorage保存收藏列表")
        },
    },

    actions: {


    },
}