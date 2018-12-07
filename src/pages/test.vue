<template>
    <div class="test">
        {{resData}}

        <form @submit.prevent="submitBtnClick">
            username: <input type="text" v-model="username" name="username">
            <input type="submit" value="submit">
            <div>{{username}}</div>
        </form>

        <div class="nextTickTest" @click="nextTickTest">nextTickTest</div>

        <div class="websocket">
            <p>websocket test:</p>
            <input type="text" v-model="username">
        </div>

        <h2 @click="test">test</h2>

        <h2 style="color: #005cc5" @click="getCnodeArticleBulk">批量发文章(会爆卡)</h2>

        <h2 style="color: #c56857" @click="getCnodeUserBulk">批量获取用户</h2>

        <p @click="getChatRoomMessage">获取聊天室</p>

        <div class="transform-test">
            <div class="transform-test-item">
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {_get, _post} from "@/api"
    import {getAritcleList} from "@/api/article.js"
    import {login, register} from "../api/user";
    import {public_article, reply} from "../api/article";

    import axios from "axios"

    export default {
        name: "test",
        data() {
            return {
                resData: "",
                username: "username",
            }
        },
        computed: {
            addUsername() {
                if (this.username === "") {
                    return false
                }
                return this.username + "addUsername"
            },
            cheerio() {
                // return require('cheerio')
                return "ii"
            }
        },
        mounted() {
        },
        methods: {
            test() {
                let req = {
                    url: "https://cnodejs.org/api/v1/topic/5b8f2a474cdb88f72f5a907b",
                    data: {}
                }
                axios(req).then((response) => {
                    let res = response.data.data

                    let replyArr = res.replies

                    replyArr.forEach(async item => {
                        let data = {
                            from_id: 63,
                            to_id: 1,
                            content: item.content,
                            article_id: 1224,
                        }
                        await reply({...data}).then((res) => {

                            log(res)
                        }).catch(err => {
                            console.error(err)
                        })
                    })


                }).catch((error) => {
                    console.log(error);
                })


            },

            getChatRoomMessage() {
                let req = {
                    url: "http://172.28.82.1:10010/hos_api/message/all",
                    data: {
                        uid: "63a9f0ea7bb98050796b649e85481845",
                        // uid:"6b5b0dd03c9c85725032ce5f3a0918ae",
                        page: 1
                    }
                }
                _get(req).then((response) => {
                    let res = response.data

                    log(res)

                }).catch((error) => {
                    console.log(error);
                })
            },
            async getCnodeUserBulk() {
                // 1、获取文章里面的用户(包括作者)
                // 2、把用户加入数据库
                // 3、查出对应的 cnode author_id 对应自己的数据库中 id
                //       查出一个用户 id 和 username 对应的 obj
                // 4、把 @ 替换
                // 5、太麻烦不搞了! 哼
                let req = {
                    url: "https://cnodejs.org/api/v1/topic/5b8f2a474cdb88f72f5a907b",
                    data: {}
                }
                axios(req).then((response) => {
                    let res = response.data.data

                    let replyArr = res.replies


                }).catch((error) => {
                    console.log(error);
                })
            },
            replaceAtSomebody(dom) {
                var $ = this.cheerio.load(dom)
                return $("a")
            },

            // 获取 cnode 第 XX 页 问答板块,并讲结果插入数据库
            async getCnodeArticleBulk() {
                for (let i = 1; i <= 53; i++) {
                    await this.getCnode(i)
                }
            },
            // 获取 cnode 第 xx 页 问答板块
            getCnode(page, tab) {
                let req = {
                    url: "https://cnodejs.org/api/v1/topics",
                    data: {
                        tab: tab === undefined ? "ask" : tab,   // 问答板块
                        mdrender: true,  // 是否渲染 md 文本
                        page: page,
                    }
                }
                _get(req).then(response => {
                    let res = response.data.data

                    // log(this.parseDom(res[0].content))
                    this.publicArticleBulk(res)


                }).catch(err => {
                    log(err)
                })
            },
            publicArticleBulk(articleArr) {
                // 转化为自己的数据格式
                let tt = articleArr.map(item => {
                    let banner = this.getBannerImg(item.content)
                    return {
                        content: item.content,
                        description: "",
                        title: item.title,
                        author: item.author.loginname,
                        author_id: 63,
                        md: "",
                        banner_img: banner === undefined ? "" : banner,
                        fuck_date: 1546275661,
                        tags: "客户端测试",
                    }
                })
                tt.forEach(async item => {
                    await public_article(item).then((res) => {

                        log(res.article_id + " : " + res.message)
                    }).catch(err => {
                        console.log(err)
                    })
                })

            },
            getBannerImg(dom) {
                var $ = this.cheerio.load(dom)
                return $("img").attr("src")
            },
            // 获取 cnode 第 xx 页 问答板块 END


            // 一些测试
            async submitBtnClick() {
                let req = {
                    url: process.env.BASE_API + '/test',
                    data: {
                        "username": "en20",
                        age: 11,
                        "password": "seohidnoasdgn"
                    }
                }

                await _get(req).then((res) => {
                    log(res)
                })
                log("await get complete")
            },
            axiosTest() {

                // _post(req).then(function (response) {
                //     console.log(response.data);
                //     _this.resData = response.data
                // })
                //     .catch(function (error) {
                //         console.log(error);
                //     })

                // axios.post(req.url, {params: req.data})
                //     .then(function (response) {
                //         console.log(response.data);
                //         _this.resData = response.data
                //     })


                // 官方建议的
                // const params = new URLSearchParams();
                // params.append('param1', 'value1');
                // params.append('param2', 'value2');
                // axios.post(process.env.BASE_API + '/console/article_list.php', params);

                // axios.post
                // axios.post(process.env.BASE_API + '/console/article_list.php', {
                //     firstName: 'Fred',
                //     lastName: 'Flintstone'
                // }).then(function (response) {
                //         console.log(response);
                //     })
                //     .catch(function (error) {
                //         console.log(error);
                //     });

                // 发送 POST 请求
                // axios({
                //     method: 'post',
                //     url: 'http://192.168.1.186/console/get_article.php',
                //     data: {
                //         firstName: 'Fred',
                //         lastName: 'Flintstone'
                //     }
                // }).then(function (response) {
                //         console.log(response);
                //     })
                //     .catch(function (error) {
                //         console.log(error);
                //     })
            },
            nextTickTest() {
                // 修改数据
                this.username = 'Hello'
                // DOM 还没有更新
                this.$nextTick(function () {
                    // DOM 更新了
                    log(" this.nextTick")
                })

                // 2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise
                this.$nextTick().then(function () {
                    // DOM 更新了
                    log(" this.nextTick().then(function () {")

                })
                log("在$nextTick之后的内容先输出")
            },

        },

    }
</script>

<style>

</style>
