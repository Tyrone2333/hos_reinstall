import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

import collect from './modules/collect'
import article from './modules/article'
import user from './modules/user'
import websocket from './modules/websocket'

export const store = new Vuex.Store({
    state: {
        // 一些特殊的 state 写在这里,内容多了再另分模块
        clock: 0,  //打脸倒计时的Interval ID
        version: 1.1
    },
    getters: {
        version: state => state.version,
    },
    mutations: {
        //写法与 getters 相类似
        //组件想要对于 vuex 中的数据进行的处理
        //组件中采用 this.$store.commit('方法名') 的方式调用，实现充分解耦
        //内部操作必须在此刻完成(同步)
    },
    actions: {
        _signOut(context) {
            localStorage.clear()
            context.commit('_clearUser')
        }

    },
    modules: {
        //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
        collect, article, user,websocket
    },
});