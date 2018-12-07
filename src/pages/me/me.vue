<template>
    <div class="me">

        <!--用户信息-->
        <profile-intro :userInfo="userInfo"
                       avatar-shape="round"
                       avatarBehavior="user"
                       :showUsername="true"
        ></profile-intro>

        <group title="">
            <cell title="我的主页" value="" is-link :link="/user/+userInfo.id">
                <span class="cellIcon small-icon icon-user" slot="icon"></span>
            </cell>

            <cell title="尬聊室(beta)" value="" is-link link="/chatRoom">
                <span class="cellIcon small-icon icon-user" slot="icon"></span>
            </cell>


            <cell title="与我相关"
                  is-link
                  :border-intent="false"
                  :arrow-direction="showContent ? 'up' : 'down'"
                  @click.native="showContent = !showContent"></cell>
            <div class="slide" :class="showContent?'animate':''">
                <!--<cell-box is-link link="/article_edit">-->
                <!--<del>发布文章 使用wang_editor</del>-->
                <!--</cell-box>-->
                <cell title="我的收藏" value="" is-link link="/collect">
                    <span class="cellIcon small-icon icon-bookmark" slot="icon"></span>
                </cell>
                <cell title="消息中心" value="" is-link link="/collect">
                    <span class="cellIcon small-icon icon-notifications" slot="icon"></span>
                    <span>
                    <span class="vertical-middle">新提醒</span>
                    <badge text="16"></badge>
                </span>
                </cell>
            </div>

            <cell title="设置" value="" is-link link="/setting">
                <span class="cellIcon small-icon icon-cog" slot="icon"></span>
            </cell>
        </group>

        <group title="开发者">
            <cell title="版本" @click.native="clickVision" :inline-desc=" 'v' + version">
                <x-icon class="cellIcon" slot="icon" type="ios-information" size="30"></x-icon>
            </cell>

            <cell title="反馈" inline-desc="搞个大新闻,再把我批判一番" is-link link="/feedback">
                <span class="cellIcon icon-question-circle-o" slot="icon"></span>
            </cell>

            <x-button @click.native="signOut" type="warn">退出账户</x-button>

        </group>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, XButton, Badge} from 'vux'
    import {mapGetters} from 'vuex'
    import profileIntro from "../../components/profileIntro"


    export default {
        components: {
            Group, Cell, CellBox, XButton, Badge, profileIntro
        },
        data() {
            return {
                showContent: true,
                avatar: localStorage.avatar ? localStorage.avatar : "https://pic4.zhimg.com/354a338c01699ca3bf7556bcd8e4e9ea_xl.jpg",
            }
        },
        methods: {
            clickVision() {

                console.log("%c" + "  当前版本 v " + this.version + " %c",
                    "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
                    "background:transparent")

                this.$vux.toast.show({
                    text: "  当前版本 v " + this.version,
                    type: "text",
                })
            },
            signOut() {
                this.$store.dispatch("_signOut")
                location.reload()
            }

        },
        computed: {
            ...mapGetters(["userInfo", "version"]),
        },

    }
</script>

<style scoped lang="less">
    .me {
        .small-icon {
            /*height: 16px;*/
            /*width: 16px;*/
            font-size: 16px;
        }
    }

    .slide {
        padding: 0 20px;
        overflow: hidden;
        max-height: 0;
        transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    }

    .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
    }

    .cellIcon {
        margin-right: 20px;
        width: 30px;
        height: 30px;
        font-size: 30px;
    }

    .icon-chrome {
        font-size: 2em;
    }
</style>
