/**
 * 这里目前只放了文章的草稿
 */
export default {
    state: {
        // 草稿
        draft: {
            editorValue: "**这是草稿演示**", // 编辑器的内容
            editorHtmlValue: "",
            editorMDValue: "",
            title: "草稿演示",
            author: "enzo",
            description: "",
            banner_img: "", // 文章列表显示的略缩图(最后一次上传的图片)
            joinTopicList: ["客户端测试"],
            optionsList: ["玩机技巧", "游戏","分享","问答", "编程"],
            minuteListValue: '2019-01-01 09:00',
            fuckDate: "1546275661",
            tags: "",
        },
    },
    getters: {
        draft: state => state.draft,
    },

    mutations: {
        setdraft(state, payload) {
            state.draft = payload
        },
    },

    actions: {

    },
}