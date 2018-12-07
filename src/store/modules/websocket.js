/**
 * 用于记录 websocket 状态
 * 改成 socket.io 后就没用这个了
 */
export default {
    state: {
        pushWSServer: {},
        chatWSServer: {
            connecting: false,
            status: false,
        }
    },
    getters: {
        chatWSServer: state => state.chatWSServer,
        pushWSServer: state => state.pushWSServer,
    },

    mutations: {
        setchatWSServerStatus(state, payload) {
            state.chatWSServer.status = payload
            console.info("websocket聊天服务器当前状态: " + state.chatWSServer.status)
        },
    },

    actions: {},
}