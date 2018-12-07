<template>
    <div class="article-list">

        <!-- 简单场景 -->
        <Scroll
                ref="scroll"
                :autoUpdate="true"
                :startY="-44"
                @pullingDown="loadRefresh"
                @pullingUp="loadMore"
                @scroll="onScroll"
        >
            <!-- 滚动的内容 -->
            <panel
                    :header="'这不是彩蛋'"
                    :list="articleList"
                    :type="type"
                    @on-click-item="readArticle"
                    @on-click-header="egg"
            />

        </Scroll>

    </div>
</template>

<script>
    import {Panel, Group, Radio} from 'vux'
    import {LoadMore} from "vux"

    import {getAritcleList,} from "@/api/article.js"
    import * as utils from "../../utils/common"

    // TODO 直接把这个scroll提出来
    import Scroll from 'vue-slim-better-scroll'

    export default {
        components: {
            Panel,
            Group,
            Radio, LoadMore, Scroll
        },
        data() {
            return {
                showFather: true,
                resData: "",
                articleList: [],
                type: '5',  // vux panel 的类型，第5种

                page: 1, // 文章的页数
                articleId: 0,

                loadingFooter: true,
                loadingFooterSymbol: true,
                loadingFooterText: "正在加载",

            }
        },
        beforeMount() {
            this.getAritcleList(1)
        },

        watch: {
            resData(curVal, oldVal) {
                let articleList = this.articleList
                let newList = this.transformList(this.resData)

//                articleList尚未赋值时
                if (isEmptyArr(this.articleList)) {
                    this.articleList = newList
                } else {
                    for (let i in newList) {
                        articleList.push(newList[i])
                    }
                }
            },
        },
        methods: {
            test(pos) {

                log(pos)

                log("滚动 Y: ", this.$refs.scroll)
                this.$refs.scroll.scrollTo(0, -350, 0)

            },
            onScroll(pos) {
                log(pos)
            },
            loadRefresh() {
                // 下拉重新刷新数据
                this.refreshAritcleList().then(() => {
                    log("已重新刷新数据")
                }).catch(err => {
                    console.error(err)
                })

            },
            loadMore() {
                this.getMoreArticle().then((res) => {
                    log("已加载更多")
                }).catch(err => {
                    console.error(err)
                })

            },
            readArticle(item) {
                // 在 this.$router.push() 方法中path不能和params一起使用，否则params将无效。需要用name来指定页面
                this.$router.push({name: 'read_article', params: {articleId: item.articleId}})

                // 神奇??? 用了这个 this.articleId 从文章页回来竟然会不能滑动?? 还不能缓存原来的滚动距离??
                // this.articleId = item.articleId
                // this.$router.push({name: 'read_article', params: {articleId: this.articleId}})
            },
            async getAritcleList(page) {

                await getAritcleList(page).then((res) => {
                    if (res.length > 0) {
                        this.resData = res
                        this.page++
                    } else {
                        this.$refs.scroll.update(true)
                    }
                }).catch(err => {
                    console.error(err)
                })
            },
            async getMoreArticle() {
                // this.loadingFooter = true
                await this.getAritcleList(this.page)
            },
            refreshAritcleList() {
                return new Promise((resolve, reject) => {
                    getAritcleList(1).then((res) => {
                        if (res.length > 0) {
                            this.articleList = this.transformList(res)
                        } else {
                            this.$refs.scroll.update(true)
                        }
                        resolve()
                    }).catch(err => {
                        console.error(err)
                        reject(err)
                    })
                })

            },
            //  把后台传入的数据转化为 panel 组件需要的数据形式
            transformList(resData) {
                return resData.map((item) => {
                    return {
                        src: item.banner_img,
                        title: item.title,
                        articleId: item.id,
                        meta: {
                            source: this.formatSource(item.tags),
                            date: utils.formatMsgTime(item.dateline * 1000),
                            other: item.author
                        }
                    }
                })
            },

            // 用于列表的标签分割,最多显示3个
            formatSource(tags) {
                if (tags === "" || tags === null) {
                    return ""
                }
                let arr = tags.split(",")
                if (arr.length > 3) {
                    arr.splice(3, arr.length - 2)
                }
                return "<span class=\"tag\">" + arr.join(" ") + "</span>\n" + " &nbsp;•&nbsp; "
            },
            isInArticle() {
                let url = window.location.href
                var regExp = /((read_article)\/(\d+)$)/;
                return regExp.test(url)
            },

            egg() {
                // window.location.href = "http://t.cn/RHrvjVI";
                alert("等下一个彩蛋吧")
            },
        },
    }
</script>

<style lang="less">
    .article-list {
        width: 100%;
        height: 100%;

        .weui-media-box__title {
            white-space: normal;
        }
    }

    .get-more-article {
        color: #586C94;
        margin: 15px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    .tag {
        line-height: 12px;
        padding: 4px 4px 4px 4px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        text-decoration: none;
        color: #999;
    }
</style>
