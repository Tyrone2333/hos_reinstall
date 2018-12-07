import Vue from 'vue'
import {ToastPlugin, LoadingPlugin} from 'vux'
import router from "../router"

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

const BASE_URL = process.env.BASE_API

log("BASE_URL:" + BASE_URL)
const axios = require('axios').create({
    baseURL: BASE_URL,            //api请求的baseURL
    timeout: 6000,
    // withCredentials: true, // 允许跨域 cookie ! 后端Access-Control-Allow-Credentials 必须设置 true
    // headers: {'X-Requested-With': 'XMLHttpRequest'},
    // headers: {'token': JSON.parse(localStorage.token) || ""},
    maxContentLength: 2000,
    transformResponse: [function (data) {
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {}
        }
        return data
    }],
})

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = JSON.parse(localStorage.token)
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    })

// 设置重试次数及重试延迟
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000
// http response 拦截器
axios.interceptors.response.use(
    response => {
        // 如请求正确,则将 loading 关闭
        Vue.$vux.loading.hide()
        if (response.data.errno === 200) {
            return response
        }

        // 统一管理error的错误
        if (response.data.errno === 401) {
            Vue.$vux.toast.show({
                text: response.data.message,
                type: "warn",
            })

            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            })
        } else if (response.data.errno === -1
            || response.data.errno === 1
            || response.data.errno === 3
            || response.data.errno === 500
        ) {
            Vue.$vux.toast.show({
                text: response.data.message || "出错了",
                type: "warn",
            })
        } else {
            Vue.$vux.toast.show({
                text: response.data.message || "返回了不正确的 errno: " + response.data.errno,
                type: "warn",
            })
        }


        // 没有 return , response 会传下去 undefined
        return response
    },
    error => {

        // 统一管理非 200 的状态,组件里就只需关心正确的请求

        // 弹窗显示后台404 500 错误
        if (error.response) {
            switch (error.response.status) {

                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // 处理没写好会造成重复bug重复跳到登录
                    // 所以使用response拦截后台已经预料到的401
                    // router.replace({
                    //     path: 'login',
                    //     query: {redirect: router.currentRoute.fullPath}
                    // })
                    break
                case 404:
                    Vue.$vux.toast.show({
                        text: "404啦,请联系管理员",
                        type: "warn",
                    })
                    break
                case 500:
                    Vue.$vux.toast.show({
                        text: "服务器错误,请联系管理员",
                        type: "warn",
                    })
                    break

            }
        }

        // 请求超时后重试
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            let config = error.config
            // 如果 config 不存在，或 retry 未设置, reject
            if (!config || !config.retry) {
                return Promise.reject(error)
            }

            // 保存重试次数
            config.__retryCount = config.__retryCount || 0

            // 重试次数大于设置的次数，reject
            if (config.__retryCount >= config.retry) {
                Vue.$vux.loading.hide()
                return Promise.reject(error)
            }
            console.log(`请求超时,第 ${config.__retryCount + 1} 次重试`)

            // 重试统计 +1
            config.__retryCount += 1

            // 创建一个 promise 处理新请求
            return new Promise(resolve => {
                setTimeout(resolve, config.retryDelay || 1)
            }).then(() => {

                // 显示一个loading
                if (!Vue.$vux.loading.isVisible()) {
                    Vue.$vux.loading.show({
                        text: "请求超时，正在重试",
                    })
                }
                return axios(config)
            })


        }

        Vue.$vux.toast.show({
            text: `出错啦, ${error.message}`,
            type: "warn",
        })
        // 不给 reject 就会跑到 then 里面
        // 在组件的 catch 只用  console.error 定位一下错误位置即可,
        // 错误提示的弹窗都在这里统一处理了
        return Promise.reject(error)
    },
)

// get
export const _get = (req) => {

    return new Promise((resolve, reject) => {
        axios.get(req.url, {params: req.data}).then(response => {
            if (response !== undefined && response.data.errno === 200) {
                // response.data 才是服务器返回的东西,其他都是 axios 加的
                resolve(response.data.data)
            } else {
                console.log("GET 请求失败了:")
                reject(response)
            }
        }).catch(error => {
            console.log("GET 请求发生错误:")
            reject(error)
        })
    })
    // return axios.get(req.url, {params: req.data})
}

// post
export const _post = (req) => {

    return new Promise((resolve, reject) => {
        axios({method: 'post', url: req.url, data: req.data}).then(response => {
            if (response !== undefined && response.data.errno === 200) {
                // response.data 才是服务器返回的东西,其他都是 axios 加的
                resolve(response.data.data)
            } else {
                console.log("POST 请求失败了:")
                reject(response)
            }
        }).catch(error => {
            console.log("POST 请求发生错误:")
            reject(error)
        })
    })

    // return axios({method: 'post', url: req.url, data: req.data})
}