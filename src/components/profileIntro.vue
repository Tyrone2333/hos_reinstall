<template>
    <div class="profile-intro">

        <!--以用户信息为类名-->
        <div class="user-info">
            <div class="avatar" @click="avatarClick">
                <upload-avatar v-if="avatarBehavior === 'uploadAvatar'" :username="userInfo.username"
                               ></upload-avatar>
                <img :class="avatarShape" :src="userInfo.avatar">
            </div>
            <div class="text">
                <div class="nickname">
                    {{userInfo.username}} <br>
                </div>
                <div class="username" v-if="showUsername">User : {{userInfo.username}}</div>
                <div class="register-info" v-else>第 {{userInfo.id}} 号用户,加入于{{commonTime(userInfo.register_time)}}</div>
            </div>
        </div>
    </div>
</template>

<script>

    import timeTransMixins from "../utils/timeTransMixin"
    import uploadAvatar from "./uploadAvatar"

    export default {
        name: "profileIntro",
        mixins: [timeTransMixins],
        components: {
            uploadAvatar,
        },

        props: {
            userInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            // 头像形状
            avatarShape: {
                type: String,
                // 正方形 / 圆角正方形 / 圆形
                // square / squircle  / round
                validator: function (value) {
                    // 这个值必须匹配下列字符串中的一个
                    // 我想让传入的错误值被替换为默认值,但 vue 好像没这个功能
                    return ['square', 'squircle', 'round'].indexOf(value) !== -1
                },
                default: "squircle",
            },
            // 点击头像的行为
            avatarBehavior: {
                type: String,
                default: "none" // homePage
            },
            // 用于显示右侧是 注册信息 or 用户名
            showUsername: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        },
        mounted() {
            if (this.avatarBehavior === "uploadAvatar") {
               console.log("当前点击头像可上传文件")
            }
        },
        methods: {
            avatarClick() {
                if (this.avatarBehavior === "homePage") {
                    this.$router.push({name: 'me'})
                } else if (this.avatarBehavior === "user") {
                    this.$router.push({name: 'user', params: {id: this.userInfo.id}})
                }

                this.$emit("avatarClick")
            },


        }
    }
</script>

<style lang="less" scoped>
    .profile-intro {
        .user-info {
            display: flex;
            padding: 5px 15px;
            .text {
                flex-direction: column;
                margin-left: 20px;
                color: #4d555d;
                .nickname {
                    font-size: 1.2em;
                }
                .username {
                    font-size: 1em;
                    color: #ccc;
                }
                .register-info {
                    font-size: 0.9em;
                    color: #ccc;
                }
            }
            .avatar {
                /*padding-top: 10px;*/
                position: relative;
                text-align: center;
                img {
                    width: 60px;
                    height: 60px;
                }
                .squircle {

                    border-radius: 20%;
                }
                .round {
                    border-radius: 50%;
                }
                .square {
                    border: none;
                }

            }
        }
    }
</style>