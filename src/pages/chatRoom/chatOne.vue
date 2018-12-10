<template>
    <div class="chat-one">


        <div class="chat-wrapper" v-if="chatList">

            <div class="rounded-messages reveal-messages  messages-width-medium msg-animation-fast">

                <!--这边是用来演示的消息-->
                <div class="time msg"><strong>Yesterday</strong> 12:25 pm</div>
                <div class="left msg">Hello!</div>
                <div class="time msg"><strong>Yesterday</strong> 12:25 pm</div>
                <div class="right-msg msg">Hey, how are you?</div>

                <!--<div>-->
                <!--<div class="user-info">-->
                <!--<img :src="item.avatar" alt="">-->
                <!--<div class="nickname">{{item.nickname}}</div>-->
                <!--</div>-->
                <!--<div class="item-wrapper msg">I'm doing well</div>-->
                <!--</div>-->
                <div class=" msg">I'm doing well</div>
                <div class="msg">What about you?</div>
                <div class="right-msg msg">Hardy har har.</div>
                <div class="right-msg msg"><img
                        src="https://tse4.mm.bing.net/th?id=OIP.Ma51851cded2f1d4bf2da6ff1e98df912o0&pid=15.1">I'm
                    doing great! ;)
                </div>
                <div class="right-msg msg">LOL</div>
                <div class="time  msg"><strong>Yesterday</strong> 3:44pm</div>
                <div class="msg">Heck, yea! FOOTBALL!</div>
                <!--演示消息 END-->

                <div class="clearfix"></div>

                <!--消息 + 时间 容器-->
                <div v-for="(item,idx) in chatList"
                >
                    <!--消息体-->
                    <div v-if="item.type !== 'time'"
                         class="item-wrapper"
                         :class="userInfo.username === item.username ? 'right-item-wrapper' : 'left-item-wrapper'"
                    >
                        <!--左边的头像-->
                        <div class="avatar" @click="clickSomeOneAvatar(item)">
                            <img :src="item.avatar" alt="avatar">
                        </div>
                        <!--右边是 昵称 和 消息-->
                        <div class="right-wrapper">
                            <!--昵称-->
                            <div class="nickname">{{item.nickname}}
                                <span v-if="item.to_uid === uid">(仅你可见)</span>
                            </div>

                            <!--消息-->
                            <div class=" msg msg-visible"
                                 :class="userInfo.username === item.username ? 'right-msg' : 'left'">{{item.message}}
                            </div>
                        </div>
                    </div>

                    <!--如果上条消息和本条时间超过了1分钟就会在消息上面添加一个时间-->
                    <div v-else class="time  msg">
                        {{commonTime(item.timeStamp)}}
                    </div>
                </div>

            </div>
        </div>

        <div class="foot-wrapper">
            <input class="chat-input" type="text" v-model="message" :placeholder="chatPlaceholder"
                   @keyup.enter="sendMessage">

            <button class="chat-send" @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex"
    import timeTransMixins from "../../utils/timeTransMixin"
    import {createUid} from "../../utils/common";
    import {getLatestMessage} from "../../api/message";

    /**
     *   进入组件触发 beforeCreate, created, mounted
     *
     *   触发 webpack 的热更新会先后触发 beforeCreate,created , beforeDestroy,  mounted
     *
     */
    export default {
        name: "chatOne",
        mixins: [timeTransMixins],
        props: {
            chatFor: {
                type: String,
                default: ""
            },
        },
        data() {
            return {
                message: "ws 随机消息:" + Math.random(),
                chatList: [], // 消息数组,存放所有聊天消息
                maxChatSize: 20,  // 能保存的最大消息数,DOM太多会严重影响性能
                chatPosition: "left",
                // 设置重试次数及重试延迟
                retry: 2,
                retryCount: 0,   //  以 _ 或 $ 开头的属性 不会 被 Vue 实例代理
                retryDelay: 2000,

                chatPlaceholder: "",
                privateFor: "",

                uid: "",
            }
        },
        computed: {
            ...mapGetters(["chatWSServer", "userInfo",]),
        },
        // created() {
        //     // 防止热加载调试建立多个ws连接
        //     this.wsConnecting = false
        //     // this.creatw3cSocket()
        // },
        beforeDestroy() {
            // 重新显示tabbar
            let tabbar = document.getElementsByClassName("weui-tabbar")[0]
            tabbar.style.visibility = "visible"

            // 触发下线,服务器要自己设定断开与 client 的连接
            let obj = {
                action: "offline",
                nickname: this.userInfo.nickname,
                username: this.userInfo.username,
                userId: this.userInfo.id,
                timeStamp: Math.round(new Date().getTime() / 1000),
            }
            this.io.emit("offline", obj)

        },
        activated() {
            log(this.$route)
        },
        beforeMount() {
            log(this.$route)
            this.createSocketIOClient()

            // 获取最近的10条消息
            getLatestMessage().then((res) => {
                // 要把 res 从后往前遍历
                let i = res.length
                while (i) {
                    this.addMsgToChatList(res[i - 1])
                    this.scrollToChatBottom()
                    i--
                }
            }).catch(err => {
                console.error(err)
            })
        },
        mounted() {
            // 隐藏底部的 tabbar
            let tabbar = document.getElementsByClassName("weui-tabbar")[0]
            tabbar.style.visibility = "hidden"

            // 临时!!! ,自动发送
            this.$nextTick((res) => {
                // this.sendMessage()
            })

        },
        methods: {
            ...mapMutations(["setchatWSServerStatus",]),
            test() {
                // close 发送 code,reason 是在后台的关闭事件接收,而非本地的 onclose 事件(原生 WS)
                // this.ws.close(3333, "离开聊天室,关闭 websocket 连接")
                // this.io.close(1000, "用户离开聊天室")
            },
            // 点击进入私聊, TODO 需要加一个聊天对象
            clickSomeOneAvatar(msgItem) {
                this.chatPlaceholder = `与 ${msgItem.nickname} 私聊`
                this.privateFor = msgItem.from_uid
                log(`点击头像: `, msgItem)

                // 触发下线,服务器要自己设定断开与 client 的连接
                let obj = {
                    action: "offline",
                    nickname: this.userInfo.nickname,
                    username: this.userInfo.username,
                    userId: this.userInfo.id,
                    timeStamp: Math.round(new Date().getTime() / 1000),
                }
                this.io.emit("offline", obj)

                // 清空消息,替换头部
                this.chatList = []
                document.querySelector(".reveal-messages").innerHTML = ""

                // 然后重新创建一条线路
                this.createSocketIOClient()

                // 通知父组件把聊天列表重新加载
            },

            // 创建 ws 连接,并监听各种事件
            createSocketIOClient() {
                let _this = this

                const io = require('socket.io-client');
                this.io = io(process.env.CHAT_WS_SERVER)
                this.uid = createUid(this.userInfo.username)    // 用户的 uid

                // 连接
                this.io.on('connect', () => {
                    // 这里的 socket 是 undefined
                    // let token = socket.handshake.query.token;

                    log("ws 已连接")
                    // ws 连接后就触发上线
                    let obj = {
                        action: "online",
                        nickname: this.userInfo.nickname,
                        username: this.userInfo.username,
                        userId: this.userInfo.id,
                        uid: this.uid,
                        timeStamp: Math.round(new Date().getTime() / 1000),
                    }
                    this.io.emit("online", obj)
                    console.log("ws 已触发上线")

                })

                // 群聊
                this.io.on('message', (data) => {
                    _this.addMsgToChatList(data)
                    _this.scrollToChatBottom()
                })

                // 收到提醒
                this.io.on('notice', (data) => {
                    // 添加提醒
                    _this.addNoticeToChatList(data, data.type)
                    _this.scrollToChatBottom()
                })

                // 断开连接
                this.io.on('disconnect', (socket) => {
                    log("ws 断开连接")
                })

            },

            // 发送消息
            sendMessage() {
                if (this.message === "") return

                let obj = {
                    action: "message",
                    from_uid: this.uid,
                    to_uid: this.privateFor,   // 私聊的对象 || ""

                    nickname: this.userInfo.nickname,
                    username: this.userInfo.username,
                    avatar: this.userInfo.avatar,
                    message: this.message.toString(),
                    message_type: "text",

                    timeStamp: Math.round(new Date().getTime() / 1000),
                }

                this.io.emit('message', obj)
                // 清空输入框
                // this.message = ""
            },

            addMsgToChatList(msg) {
                let lastestMsg = this.chatList[this.chatList.length - 1]
                //  如果上条消息和本条时间超过了1分钟就会在消息上面添加一个时间
                if (this.chatList.length === 0 || (msg.timeStamp - lastestMsg.timeStamp) > 60) {
                    let time = {
                        type: "time",
                        timeStamp: msg.timeStamp
                    }
                    this.chatList.push(time)
                }
                this.chatList.push(msg)
            },
            addNoticeToChatList(data, type) {
                let msg
                if (type === "online") {
                    msg = `<div class="online  msg"><strong>${data.nickname}</strong> 上线了,现在有<strong>${data.userNum}</strong>人</div>`
                } else if (type === "offline") {
                    msg = `<div class="online  msg"><strong>${data.nickname}</strong> 下线了,现在有<strong>${data.userNum}</strong>人</div>`
                }
                let chat = document.getElementsByClassName("rounded-messages")[0]

                chat.append(this.parseDom(msg))
            },

            scrollToChatBottom() {
                let chat = document.getElementsByClassName("rounded-messages")[0]
                // dom 更新再滚动,否则是滚动到原来的高度
                this.$nextTick(() => {
                    chat.scrollTop = chat.scrollHeight
                })

            },
            parseDom(arg) {
                // 用于把模版字符串的 dom 转成真正的 dom (只能有一个父元素)
                var objE = document.createElement("div");

                objE.innerHTML = arg;

                return objE.childNodes[0];
            },

        },
        watch: {
            chatList(curVal, oldVal) {
                if (curVal.length > this.maxChatSize) {
                    // TODO 截断列表有问题,新消息不能插进来
                    // curVal.pop()
                }
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .clearfix ::after {
        content: " ";
        display: block;
        clear: both;
    }

    .chat-one {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        /*animation: changebox 2000ms;*/
        @keyframes changebox {
            0% {
                transform: translate3d(100%, 0, 0);
            }
            100% {
                transform: translate3d(0, 0, 0);
            }
        }
        .chat-wrapper {
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            /*底部 tabbar 高度,加了之后 ff 正常,不加 chrome 正常*/
            /*padding-bottom: 48px;*/

            /*消息框公共部分*/
            .item-wrapper {
                display: flex;
                flex-wrap: nowrap;
                position: relative;
                .avatar {
                    width: 100%;
                    flex-basis: 40px;
                    img {
                        width: 36px;
                        height: 36px;
                    }
                }
                .right-wrapper {
                    /*width: 100%;*/
                    flex: 1;
                    position: relative;
                    .nickname {
                    }
                }
            }
            /*消息在左边的情况*/
            .left-item-wrapper {
                .avatar {
                    /*order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。*/
                    order: -1;
                }
                .right-wrapper {
                    .nickname {
                        padding-left: 15px;
                        font-size: 12px;
                        color: #555;
                    }
                }
            }
            /*消息在右边的情况*/
            .right-item-wrapper {
                .avatar {
                    /*order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。*/
                    order: 2;
                    align-self: flex-end;
                }
                .right-wrapper {
                    .nickname {
                        display: none;
                    }
                }
            }

            /*codepen 的气泡特效*/
            .messages-width-small {
                /*width: 300px;*/
            }

            .messages-width-medium {
                /*width: 400px;*/
                width: 100%;
                box-sizing: border-box;
            }

            .messages-width-large {
                /*width: 500px;*/
            }

            .messages-width-full {
                width: 100%;
            }

            /* Basic List Styling */
            div.rounded-messages {

                width: 100%;
                height: 100%;
                /*overflow: auto;*/
                overflow-x: hidden;
                overflow-y: scroll;

                list-style: none;
                display: inline-block;
                /*overflow: hidden;*/
                font-size: 16px;
                padding: 10px;
            }

            /* Animation */
            @keyframes message-reveal-animation {
                from {
                    opacity: 0;
                    margin-bottom: 40px;
                }
                to {
                    opacity: 1;
                    margin-bottom: 10px;
                }
            }
            div.rounded-messages.reveal-messages .msg {
                /*visibility: hidden;*/
            }

            div.rounded-messages.msg-animation-superfast .msg.msg-visible,
            div.rounded-messages.msg-animation-fast .msg.msg-visible,
            div.rounded-messages.msg-animation-slow .msg.msg-visible,
            div.rounded-messages.msg-animation-normal .msg.msg-visible,
            div.rounded-messages .msg.msg-visible {
                animation: message-reveal-animation;
                animation-duration: 0.3s;
                /* Default Animation Length */
                animation-iteration-count: 1;
                visibility: visible;
            }

            div.rounded-messages.msg-animation-superfast .msg.msg-visible {
                animation-duration: 0.2s;
                /* Super Fast Animation Length */
            }

            div.rounded-messages.msg-animation-slow .msg.msg-visible {
                animation-duration: 0.5s;
                /* Slow Animation Length */
            }

            /* Message Bubbles */
            div.rounded-messages .msg {
                position: relative;
                clear: both;
                display: block;
                height: auto;
                width: auto;
                max-width: 70%;
                word-wrap: break-word;
                word-break: keep-all;
                font-family: sans-serif;
                text-align: left;
                line-height: 1.5em;
                margin: 5px 15px;
                padding: 10px;
                cursor: default;
                border-radius: 15px;

            }

            /* Left Message Bubble */
            div.rounded-messages .msg:not(.right-msg),
            div.rounded-messages .msg.left-msg {
                float: left;
                color: #292929;
                background: #E3E2DF;
            }

            div.rounded-messages .msg:not(.right-msg)::before,
            div.rounded-messages .msg.left-msg::before {
                /* Left Message Bubble Tail */
                content: "";
                position: absolute;
                top: 5px;
                left: -10px;
                border-top: 15px solid #E3E2DF;
                border-left: 15px solid transparent;
            }

            /* Right Message Bubble */
            div.rounded-messages .msg.right-msg {
                float: right;
                color: #F8F8F8;
                background: #27AE60;
            }

            div.rounded-messages .msg.right-msg::before {
                /* Right Message Bubble Tail */
                content: "";
                position: absolute;
                bottom: 5px;
                right: -10px;
                border-bottom: 15px solid #27AE60;
                border-right: 15px solid transparent;
            }

            /* Bubble with image */
            div.rounded-messages .msg img {
                display: block;
                max-width: 100%;
                border-radius: 5px;
                margin-bttom: 5px;
            }

            /* Bubble with no tail */
            div.rounded-messages .msg.no-tail::before,
            div.rounded-messages .msg.time::before,
            div.rounded-messages .msg.online::before {
                content: "";
                display: none;
            }

            /* Time Stamp */
            div.rounded-messages .msg.time,
            div.rounded-messages .msg.online {
                float: none;
                width: 100%;
                max-width: 100%;
                background: transparent;
                margin: 0px;
                font-size: 12px;
                text-align: center;
                color: #555555;
            }

            /*@media screen and (max-width: 500px) {*/
            /*!* Fit the screen for all chats *!*/
            /*div.rounded-messages,*/
            /*.messages-width-large,*/
            /*.messages-width-medium,*/
            /*.messages-width-small {*/
            /*width: 100%;*/
            /*display: block;*/
            /*}*/
            /*}*/

        }

        .foot-wrapper {
            height: 48px;
            width: 100%;
            display: flex;
            position: absolute;
            bottom: -48px;
            box-sizing: border-box;

            background: #f2f3f2;
            padding: 5px;
            .chat-input {
                flex: 90%;
                border: none;
                background: transparent;
                border-bottom: 1px solid #ccc;
            }
            .chat-input:focus {
                /*border: none;*/
                outline: none;
                cursor: pointer;
            }
            .chat-send {
                flex: 10%;
                border: none;
                background: none;
                color: #0078d7;
                &:focus {
                    border: none;
                    outline: none;
                }
            }
        }
    }

</style>
