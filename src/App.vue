<template>
    <div id="app">


        <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
                  :title="title"
                  :right-options="{showMore: true}"
                  @on-click-more="onClickMore"
                  @on-click-title="onClickTitle">
            <!--<a slot="right">Feedback</a>-->
        </x-header>

        <div>
            <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
        </div>

        <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="45px">

            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"/>
            </keep-alive>

            <router-view v-if="!$route.meta.keepAlive"/>

            <!--<router-view/>-->


            <tabbar class="tabbar-footer" id="tabbar-footer" slot="bottom">
                <tabbar-item link="/article">
                    <img src="./assets/PNG/file-text.png" slot="icon" alt="icon">
                    <span slot="label">首页</span>
                </tabbar-item>

                <!--图标点击切换-->
                <!--<tabbar-item @on-item-click="toNews">-->
                <!--<img slot="icon-active" src="./assets/example.png">-->
                <!--<x-icon slot="icon" type="ios-ionic-outline" size="30"></x-icon>-->
                <!--<span slot="label">谈笑风生</span>-->
                <!--</tabbar-item>-->

                <tabbar-item link="/mavon_editor_test">
                    <img src="./assets/PNG/quill.png" slot="icon" alt="icon">
                    <span slot="label">写动态</span>
                </tabbar-item>

                <tabbar-item link="/collect">
                    <img src="./assets/PNG/star-empty.png" slot="icon" alt="icon">
                    <span slot="label">收藏</span>
                </tabbar-item>

                <tabbar-item link="/me">
                    <img src="./assets/PNG/user.png" slot="icon" alt="icon">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>

    </div>
</template>

<script>

    import {Tab, TabItem, Sticky} from 'vux'
    import {ViewBox} from 'vux'
    import {Tabbar, Actionsheet, TabbarItem, XHeader, XImg} from 'vux'
    import BScroll from 'better-scroll'

    import {tokenLogin} from "./api/user";

    export default {
        name: 'app',
        components: {
            Tab, TabItem, Sticky, ViewBox, Tabbar, TabbarItem, XHeader, XImg, Actionsheet
        },
        data() {
            return {
                showMenu: false,
                menus: {
                    'language.noop': '<span class="menu-title">Language</span>',
                    'zh-CN': '中文',
                    'en': 'English'
                },
                showMenus: false,
                drawerVisibility: false,
                showMode: 'push',
                showModeValue: 'push',
                showPlacement: 'left',
                showPlacementValue: 'left',
                title: process.env.APP_NAME,
                states: {
                    scrollTop: 0,
                },
            }
        },
        methods: {
            onClickMore() {
                this.showMenus = true
            },
            scrollToBefore(s) {
                this.$refs.viewBox.scrollTo(s)
            },
            onClickTitle() {
                log(this.$refs)
                this.$refs.viewBox.scrollTo(0)
            },
        },

        mounted() {

            // 每次打开如果token没过期就会自动刷新,很久未访问就要重新登录
            if (localStorage.token && localStorage.token !== "undefined") {
                tokenLogin().then((res) => {

                    // 登录成功,保存必要信息进localStorage TODO 增加收藏列表
                    this.$store.commit("setUserInfo", res.userinfo)
                    this.$store.commit("setToken", res.token)
                    console.log("已刷新token和用户信息")
                })
            }
        },
        watch: {
            // $route(to, from) {

            /**
             * 这一段可以用来判断 tabbar-item 的高亮,不过现在觉得没这个必要去弄
             *
             *   let arr = [
             ["article", "read"],
             ["me", "setting", [
             "edit","about",[
             "sb"
             ]
             ]]
             ]

             function findOffset(arr, val, position) {
                    let res = '';

                    function _find(arr, val, position) {
                        let temp = '';
                        arr.forEach((item, index) => {
                            temp = position ? position + ',' + index : index;
                            if (item === val) {
                                res = temp;
                                // return;
                            } else if (item instanceof Array) {
                                temp = _find(item, val, temp);
                            }
                        })
                    }

                    _find(arr, val, position);
                    return res;
                }
             console.log(
             findOffset(arr, "sb")
             )
             *
             */


            //     /**
            //      *  旧版文章回退写的不好,现在已经用 keep-alive 替换
            //      */
            //     let scrTop = this.$refs.viewBox.getScrollTop()
            //     // 从列表到具体文章时保存之前的滚动距离
            //     if (to.name === "read_article" && from.name === "article") {
            //         log("从列表到具体文章" + scrTop)
            //         this.states.scrollTop = scrTop
            //     }
            //     // 从文章退回列表跳转到之前的位置
            //     if (to.name === "article" && from.name === "read_article") {
            //         log("从文章退回列表 this.states.scrollTop: " + this.states.scrollTop)
            //         // 都可以
            //         // setTimeout(() => {
            //         //     this.scrollToBefore(this.states.scrollTop)
            //         // }, 0)
            //         this.$nextTick(() => {
            //             this.scrollToBefore(this.states.scrollTop)
            //         })
            //     }
            // },
        },
    }
</script>

<style lang="less">

    @import '~vux/src/styles/reset.less';

    body {
        background-color: #fbf9fe;
    }

    html, body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }

    #app {
        height: 100%;
    }

    .icon-user {
        width: 27px;
        height: 27px;
        color: #5d0500 !important;
    }

    .weui-bar__item_on .weui-tabbar__label span {
        color: #0870e3;
    }

    .weui-tabbar__icon {
        width: 22px !important;
        height: 22px !important;
    }

    /*固定底部vue-router的样式*/
    .tabs {
        display: flex;
        text-align: center;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .active {
            color: #f01414;
        }
        .tab-item {
            flex: 1;
            font-size: 14px;
            line-height: 40px;
            width: 100%;
            height: 40px;
            color: #4d555d;
            a {
                display: block;
            }
        }
    }

</style>
