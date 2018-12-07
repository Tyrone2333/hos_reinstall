import {_get, _post} from "@/api"

//  登录
export const login = (username, password) => {
    let req = {
        data: {
            "username": username,
            "pwd": password,
        },
        url: '/user/login'
    }
    return _post(req);
}
export const tokenLogin = () => {
    let req = {
        data: {
            // "username": username,
            // "token": token,
        },
        url: '/user/token_login'
    }
    return _post(req);
}

//  注册
export const register = (data) => {
    // 注册所填信息不定,username,pwd为必须
    //     let data = {
    //     "username": username,
    //     "pwd": password,
    //     "nickname": nickname,
    // }
    let req = {
        data,
        url: '/user/register'
    }
    return _post(req);
}

//  改密码
export const changePwd = (oldPwd, newPwd) => {
    let req = {
        data: {
            oldPwd, newPwd
        },
        url: '/user/password'
    }
    return _post(req);
}

// 改用户信息,传过来的是一个 obj
export const changeInformation = ({nickname, age, sex, email, address}) => {
    let req = {
        data: {
            nickname, age, sex, email, address
        },
        url: '/user/information'
    }
    return _post(req);
}
// 获取用户信息
export const getUserInfo = (id) => {
    let req = {
        url: "/user/" + id,
    }
    return _get(req)
}