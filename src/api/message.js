import {_get, _post} from "@/api"

// 获取最近的10条消息
export const  getLatestMessage = () => {
    let req = {
        url: "/message/all",
        data:{
        },
    }

    return _get(req)
}

