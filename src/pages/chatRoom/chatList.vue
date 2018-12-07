<template>
    <div class="chat-room">


        <!--v-show="showChatList"-->
        <panel
                :header="publicHeader"
                :list="publicList"
                @on-click-item="publicItemClick"
        />

        <transition name="slide-left">
            <router-view>
                <!--父子组件,进入 chat-one-->
            </router-view>
        </transition>


    </div>

</template>

<script>
    import chat from "../../components/chat"
    // import chatOne from "./chatOne"
    import {Panel} from 'vux'

    export default {
        name: "chatList",
        components: {Panel,},
        data() {
            return {
                publicHeader: "群聊",
                publicList: [],

                privateHeader: "私信",
                privateList: [],

                privateChatList: [],
                publicChatList: [],
                showChatList: true,
                transitionName: "",
            }
        },
        mounted() {
            this.publicList = [
                {
                    src: "http://pfqu2aq6k.bkt.clouddn.com//o_1coev7ev21bsq1h7819l913b21eiqe.jpg",
                    title: "大大大 群聊",
                    articleId: 123,
                    desc: "descdescdescdescdescdescdesc"

                },
            ]
        },
        methods: {
            clickAvatar() {
                log("clickAvatar")
            },
            publicItemClick(item) {

                this.showChatList = !this.showChatList
                this.$router.push({name: "chatOne",})
            }
        },
        watch: {
            $route(to, from) {

                if (from.name === "chatOne" && to.name === "chatList") {
                    this.showChatList = true
                    this.transitionName = 'slide-right';
                }
            }
        }
    }

</script>

<style scoped lang="less">
    .chat-room {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all 600ms;
        position: absolute;
    }

    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }

    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

    .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }

</style>