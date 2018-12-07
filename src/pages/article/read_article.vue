<template>
    <div class="read-article" v-if="resData">

        <h2>{{resData.title}}</h2>


        <div class="article-info">
            <span>{{resData.author}} 写于 {{commonTime(resData.dateline)}}</span>
        </div>

        <div class="article-page-split-line"></div>

        <div class="content" v-html="resData.content"></div>

        <div class="tab-wrapper">
               <span v-if="tags" v-for="(item,idx) in tags"
                     :key="item"
                     class="list-complete-item tag"
                     id="tag"
               >{{item}}</span>
        </div>


        <!--分界线-->
        <div class="article-page-split-line"></div>


        <!--TODO 评论要分页-->
        <!--评论列表-->
        <comment
                ref="comment"
                :commentList="commentList"
                :authorId="resData.author_id"
                @updateReply="updateReply"

        ></comment>

        <div class="fixed-footer">

            <div class="reply-wrapper" @click="clickReply">
                <i class=" icon  icon-quill"></i>
                写评论
            </div>


            <div class="right">
                <!--<div class="zan-wrapper">-->
                <div class="zan-wrapper" @click="clickZan">
                    <i class="icon" :class="isZan ?  'icon icon-thumbs-up': 'icon icon-thumbs-o-up'"></i>
                    {{zanCount}}
                </div>
                <!--</div>-->

                <!--收藏的图标-->
                <div class="collection-wrapper" @click="toggleCollect">
                    {{collection}}
                </div>
            </div>


        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    import {getAritcleById, setZan} from "../../api/article.js"
    import {collect} from "../../api/collect";
    import timeTransMixins from "../../utils/timeTransMixin"

    import comment from "../../components/comment"
    import {mapGetters} from 'vuex'


    export default {
        components: {
            comment
        },
        mixins: [timeTransMixins],
        data() {
            return {
                resData: null,
                articleId: 0,
                collected: false,
                collection: "  ☆ 收藏​",
                isZan: false,
                zanCount: 0,
                tags: [],
                commentList: [],    // 评论列表

                countDownTime: "",  // 打脸日倒计时
            }
        },
        computed: {
            ...mapGetters(["collectList", "userInfo"])
        },

        beforeMount() {
            this.fetchData()
            this.initcollectList()

            this.$nextTick(function () {
                // 隐藏外面的tabbar
                document.getElementById("tabbar-footer").style.visibility = "hidden"
                // 回顶部
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
            })
        },
        mounted() {
        },
        beforeDestroy() {
            document.getElementById("tabbar-footer").style.visibility = "visible"
        },

        methods: {
            // 底栏的点赞
            clickZan() {
                if (this.userInfo.id > 0) {
                    setZan(this.articleId, this.userInfo.id, this.isZan ? "cancelZan" : "zan").then((res) => {
                        this.isZan = !this.isZan
                        this.isZan ? this.zanCount++ : this.zanCount--
                    }).catch(error => {
                        console.error(error.message)
                    })
                } else {
                    this.$vux.toast.show({
                        text: "请先登录",
                        type: "warn",
                    })
                }

            },
            //  底栏的回复按钮
            clickReply() {
                this.$refs.comment.replyDialogShow()
            },
            getIdByURL(url) {
                let regExp = /((read-article)\/(\d+)$)/;
//                let str = "http://192.168.1.186:10086/#read-article/66";
                return url.match(regExp)[3]
            },
            fetchData() {

                let url = window.location.href
                this.articleId = this.$route.params.articleId || this.getIdByURL(url)

                getAritcleById(this.articleId, this.userInfo.id).then((res) => {
                    this.resData = res.data[0]
                    this.isZan = this.resData.is_zan === 1 ? true : false
                    this.zanCount = this.resData.agree
                    console.log("文章信息: %O", this.resData)
                    this.getTagsList(this.resData.tags)
                    this.commentList = res.reply
                }).catch(error => {
                    console.error(error.message)
                })

            },
            // 评论更新了,需要重新加载
            updateReply() {
                this.fetchData()
                this.initcollectList()
            },

            toggleCollect() {
                if (!this.$store.state.user.user.id) {
                    this.$vux.toast.show({
                        text: "请先登录",
                        type: "warn",
                    })
                    return
                }
                this.collected = !this.collected
                this.collection = this.collected
                    ? "  ★ 已收藏​"
                    : "  ☆ 收藏​"
                this.commitCollect()
            },
            commitCollect() {
                let articleId = this.articleId
                let collectAction = this.collected ? 1 : 0  // 1 是执行收藏,0 是取消收藏

                collect(articleId, collectAction)
                    .then((res) => {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                        // 刷新收藏列表
                        let list = res.data;
                        this.$store.commit("setcollectList", list)

                    })
                    .catch(err => {
                        console.error(err)
                    })
            },

            getTagsList(tagString) {
                if (tagString === "" || tagString === null) {
                    // this.tags = []
                    return
                }
                this.tags = tagString.split(",")
            },
            initcollectList() {
               console. log("this.collectList: ",this.collectList)
                for (let k in this.collectList) {
                    if (this.articleId === this.collectList[k].article_id) {
                        this.collected = true
                        this.collection = this.collected ? "  ★ 已收藏​" : "  ☆ 收藏​"
                    }
                }
            },
            // 倒计时
            getCountDown(timestamp) {
                window.clearInterval(this.$store.state.clock)
                let clo = setInterval(() => {
                    let nowTime = new Date();
                    let endTime = new Date(timestamp * 1000);
                    let t = endTime.getTime() - nowTime.getTime();
                    if (t <= 0) {
                        this.countDownTime = "已过期"
                        return
                    }
                    let d = Math.floor(t / 1000 / 60 / 60 / 24);
                    let hour = Math.floor(t / 1000 / 60 / 60 % 24);
                    let min = Math.floor(t / 1000 / 60 % 60);
                    let sec = Math.floor(t / 1000 % 60);

                    this.countDownTime = d + " 天 " + hour + " 时 " + min + " 分 " + sec + " 秒 ";

                }, 1000);

            }


        },

        watch: {
            /**
             * 同一个地址只变化id，页面不重载的问题 https://github.com/vuejs/vue-router/issues/296
             * 由于这个问题的解决，通过URL来获取id变得无用，而且由于组件是复用的，并不会触发 beforeMount 钩子
             * @param curVal
             * @param oldVal
             */
            $route(curVal, oldVal) {
                console.log("通过路由进入文章页,正刷新数据")
                this.fetchData()
            },
            resData(curVal, oldVal) {
                this.getCountDown(curVal.fuck_date)
            },
        },

    }
</script>

<style lang="less" type="less">
    @import "article_markdown.css";

    .read-article {
        .count-down {
            margin: 3px auto 3px 0;
            font-size: 1em;
            color: #606060;
            padding-left: 10px;
        }

        .icon {
            font-size: 18px;
            color: #000;
        }
        .tab-wrapper {
            margin: 25px auto 0;
            /*padding: 0 0 25px;*/
            /*text-align: center;*/
            #tag {
                background-color: #ececec;
                margin-left: 10px;
                margin-top: 5px;
                padding: 10px;
                border-radius: 3px;
            }
        }

        // 固定底部
        .fixed-footer {
            display: flex;
            position: fixed;
            z-index: 500;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 10px 10px;
            background-color: #F7F7FA;
            font-size: 18px;
            color: #858585;

            .reply-wrapper {
                i {
                    color: #858585;
                }
            }
            .right {
                position: absolute;
                right: 0;
                .zan-wrapper {
                    /*float: right;*/
                    display: inline-block;
                    /*vertical-align: middle;*/
                    .icon-thumbs-up {
                        color: black;
                    }
                    .icon-thumbs-o-up {
                        color: #858585;
                    }
                }
                .collection-wrapper {
                    display: inline-block;

                    /*float: right;*/
                    margin-right: 18px;
                    margin-left: 18px;
                    transition: all 1s;
                }
            }

        }

        .article-page-split-line {
            height: 10px;
            background-color: #f4f4f4;
            width: 100%;
            margin: 10px 0;
        }
        .at-someone {
            color: #3194d0;
            text-decoration: none;
            word-break: break-all;
            cursor: pointer;

        }
        a {
            text-decoration: none;
        }

    }

    .article-info {
        color: #999;
    }

    .mll {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        border-radius: 3px;
        font-size: 14px;
        border: 1px solid #ccc;
        display: block;
        height: 8em;
        overflow-y: auto;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
        resize: vertical;
    }

    // END 评论css

</style>
