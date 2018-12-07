import {_get, _post} from "@/api"

export const  getCollectList = (id) => {
    let req = {
        url: "/collection",
        data:{
            id,// 用户的id

        },
    }

    return _post(req)
}

export const  collect = (articleId,collect) => {
    let req = {
        url: "/collection/collect",
        data:{
           articleId,collect
        },
    }

    return _post(req)
}

