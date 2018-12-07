export default {
    state: {
        // 用户登录信息
        user: {
            id: "",
            username: "",
            nickname: "",
            token: "",
            avatar: "",
            age: "",
            email: "",
            register_time: "",
        },
        token: "",
        status: "unAuth",// 用户状态,登录后变ok,过期的话会变unAuth

    },

    getters: {
        userInfo: state => state.user,
    },
    mutations: {
        // 将用户数据存入store
        setUserInfo(state, payload) {
            state.user = {...payload}
            localStorage.setItem("user", JSON.stringify(payload))
            state.status = "ok"
        },
        changeAvatar(state, payload){
            state.user.avatar = payload
        },
        setToken(state, payload) {
            state.token = payload
            localStorage.setItem("token", JSON.stringify(payload))
        },
        changeUserStatus(state, payload) {
            // payload 必须是 "unAuth" or "ok"
            state.status = payload
        },

        // 从localStorage取出数据赋给store用户信息
        _initUser(state) {
            if (localStorage.user && localStorage.token && localStorage.user !== "undefined" && localStorage.token !== "undefined") {
                state.user = JSON.parse(localStorage.user)
                state.token = JSON.parse(localStorage.token)
                state.status = "ok"
            }
        },
        // 清除用户信息
        _clearUser(state){
            state = {
                // 用户登录信息
                user: {
                    id: "",
                    username: "",
                    nickname: "",
                    token: "",
                    avatar: "",
                    age: "",
                    email: "",
                    register_time: "",
                },
                token: "",
                status: "unAuth",// 用户状态,登录后变ok,过期的话会变unAuth

            }
        }

    },

    actions: {},
}