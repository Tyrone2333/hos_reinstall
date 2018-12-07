import {_get, _post} from "@/api"

export const getAritcleList = (page) => {
    let req = {
        url: "/article",
        data: {
            page,
            n: Math.random(),
        },

    }
    return _get(req)
}
export const getAritcleById = (id,userId) => {
    let req = {
        url: "/article/" + id,
        data:{
            userId: userId || 0
        }
    }
    return _get(req)
}

export const public_article = ({id, token, username, title, author, author_id, description, content, md, banner_img, dateline, fuck_date, tags}) => {
    let req = {
        data: {
            id, token, username,
            title, author, author_id, description, content, md, banner_img, fuck_date, tags
        },
        url: '/article/public'
    }
    return _post(req);
}

export const reply = ({from_id, to_id, content, timestamp, article_id}) => {
    let req = {
        data: {

            from_id, to_id, content, timestamp, article_id
        },
        url: '/article/reply'
    }
    return _post(req);
}

export const setZan = (typeId, userId, action) => {
    let req = {
        data: {
            typeId, userId, action
        },
        url: '/article/setZan'
    }
    return _post(req);
}

