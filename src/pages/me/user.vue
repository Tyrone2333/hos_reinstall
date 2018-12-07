<template>
    <div class="user">


        <profile-intro :userInfo="userInfo"
                       avatar-shape="squircle"
                       avatarBehavior="homePage"
                       :showUsername="false"
        ></profile-intro>

        <div class="user-article ">
            <sticky scroll-box="vux_view_box_body" :offset="46" :check-sticky-support="false">

                <tab :line-width=2 active-color="#fc378c" v-model="tabIndex">
                    <tab-item class="vux-center" v-for="(item, index) in swiperList"
                              :selected="selected === item"
                              @click="selected = item" :key="index">{{item}}
                    </tab-item>
                </tab>
            </sticky>

            <swiper class="swiper-wrapper w-e-clear-fix" v-model="tabIndex" :show-dots="false" height="400px">
                <!--文章-->
                <swiper-item>
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有文章</div>
                    <cell-list :articleList="userArticle"></cell-list>
                </swiper-item>
                <!--收藏-->
                <swiper-item>
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有收藏</div>
                    <cell-list :articleList="userCollection"></cell-list>
                </swiper-item>
                <!--回复-->
                <swiper-item>
                    <div class="user-article-title"> {{userInfo.nickname}} 的 所有评论</div>
                    <div class="user-article-list" v-if="userReply">
                        <div class="user-article-list-item" v-for="item in userReply.comment"
                             @click="readMore(item.article_id)">
                            <div class="text">
                                <div class="title">
                                    {{item.from_nickname}}
                                    在文章 <span style="color: #0f88eb">{{item.title}}</span>
                                    评论了 <strong>{{item.to_nickname}}</strong>
                                </div>
                                <div class="content" v-html="item.comment_content">
                                    <!--{{item.comment_content}}-->
                                </div>
                                <div class="info">
                                    <span class="dateline">{{ commonTime(item.timestamp)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </swiper-item>

            </swiper>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Panel, Group, Radio, Swiper, SwiperItem, Tab, TabItem, Sticky} from 'vux'

    import {getUserInfo} from "@/api/user"
    import cellList from "../../components/cellList"
    import profileIntro from "../../components/profileIntro"
    import timeTransMixins from "../../utils/timeTransMixin"


    export default {
        name: "user",
        mixins: [timeTransMixins],
        components: {
            Panel, Group, Radio, Tab, TabItem, Swiper, SwiperItem, Sticky, cellList, profileIntro
        },
        data() {
            return {
                userId: "",
                userInfo: {},   // 用户信息
                userArticle: [],    // 用户文章
                userCollection: [], // 用户收藏
                userReply: {},
                swiperList: ['文章', '收藏', '回复',],
                selected: '文章',
                tabIndex: 0,
            }
        },
        computed: {
            // ...mapGetters(["userInfo"]),
        },
        mounted() {
            this.fetchData()

            this.initSwiperHeight()
        },

        watch: {
            tabIndex(curVal, oldVal) {
                let swiper = document.getElementsByClassName("vux-swiper")[0]
                let swipers = document.getElementsByClassName("vux-swiper-item")

                swiper.style.height = swipers[curVal].offsetHeight + "px"
            },
        },
        methods: {
            changeMsg() {
                this.msg = "Hello world."
                this.msg1 = this.$refs.msgDiv.innerHTML
                this.$nextTick(() => {
                    this.msg2 = this.$refs.msgDiv.innerHTML
                })
                this.msg3 = this.$refs.msgDiv.innerHTML
            },

            initSwiperHeight() {
                let swiper = document.getElementsByClassName("vux-swiper")[0]
                let swipers = document.getElementsByClassName("vux-swiper-item")

                swiper.style.height = swipers[0].offsetHeight + "px"

            },
            getIdByURL(url) {
                let regExp = /((user)\/(\d+)$)/;
//                let str = "http://192.168.1.186:10086/#read-article/66";
                return url.match(regExp)[3]
            },
            fetchData() {
                this.userId = this.$route.params.id || this.getIdByURL(window.location.href)
                getUserInfo(this.userId).then((res) => {
                    this.userInfo = res.userInfo
                    this.userArticle = res.userArticle
                    this.userCollection = res.userCollection
                    this.userReply = res.userReply

                    console.log("用户信息: %O", res)

                }).catch(err => {
                    console.error(err)
                })

            },
            readMore(id) {
                this.$router.push({name: 'read_article', params: {articleId: id}})
            },

        },

    }
</script>

<style lang="less">
    .user {

        .user-article {
            .user-article-title {
                padding: 14px 15px 10px;
                color: #999999;
                font-size: 13px;
                position: relative;
            }
            .user-article-list {
                .user-article-list-item {
                    display: flex;
                    flex-direction: row;
                    padding: 15px;
                    position: relative;
                    .text {
                        .big-title, .content {
                            font-weight: 400;
                            font-size: 18px;
                            margin-bottom: 8px;
                            white-space: normal;
                            width: auto;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: normal;
                            word-break: break-all;
                        }
                        .title {
                            font-size: 12px;
                            margin-bottom: 8px;
                            white-space: normal;
                            width: auto;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: normal;
                            word-break: break-all;
                        }
                        .info {
                            font-size: 0.8em;
                            .dateline {
                                line-height: 12px;
                                padding: 4px 4px 4px 4px;
                                border-radius: 2px;
                                text-decoration: none;
                                color: #CECECE;
                            }
                            .agree {
                                line-height: 12px;
                                padding: 4px 4px 4px 4px;
                                border-radius: 2px;
                                text-decoration: none;
                                color: #999;
                            }

                        }
                    }

                }
            }
        }

    }

    .vux-slider > .vux-swiper > .vux-swiper-item {
        height: auto !important;
    }
</style>
