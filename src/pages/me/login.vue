<template>
    <div>
        <div class="login-in" v-if="inLogin">
            <form @submit.prevent="loginBtnClick">
                <x-input name="username" v-model="username" @on-change="checkName"
                         placeholder="用户名/邮箱"></x-input>
                <x-input v-model="password" :type="pwdType" placeholder="登录密码">
                    <span :class="pwdClass" @click="pwdTypeChange" slot="right"></span>
                </x-input>
                <button class="handleSubmitBtn" type="submit">登录</button>
            </form>

            <!--用来显示登录数据,正式版会关闭-->
            <!--<div v-if="resData" v-for="(val,key) in resData">-->
            <!--<span>{{key}}</span> ==> <span>{{val}}</span>-->
            <!--</div>-->

        </div>
        <!--<divider>我是有底线的</divider>-->

        <div class="register" v-if="!inLogin">
            <group title="填写基本信息">
                <form @submit.prevent="registerBtnClick">

                    <x-input title="昵 称" name="nickname" v-model="nickname" placeholder="昵称"></x-input>
                    <!--禁用内置验证才能显示成功或者错误样式-->
                    <x-input title="用户名" @on-change="checkName" novalidate
                             :icon-type="iconType"
                             :show-clear="false"
                             name="username" v-model="username" placeholder="请输入用户名(用于登录)"></x-input>

                    <x-input title="密码" type="text" :is-type="bePwd" placeholder="" v-model="password"
                             :min="2"></x-input>
                    <x-input title="确认密码" type="text" v-model="password2" placeholder=""
                             :equal-with="password"></x-input>

                    <button class="handleSubmitBtn" type="submit">注册</button>
                </form>
            </group>


            <group title="非必填">
                <x-input title="手机号码" name="tel" v-model="tel" placeholder="请输入手机号码" keyboard="number"
                         is-type="china-mobile"></x-input>
                <x-input title="邮箱" name="email" v-model="email" placeholder="请输入邮箱地址" is-type="email"></x-input>
            </group>


            <loading :show="isLoading" text="正在加载中..."></loading>
        </div>

        <div class="togleLogin" @click="togleLogin">
            {{togleInfo}}
        </div>
    </div>

</template>

<script>
    import {mapMutations} from 'vuex'

    import {XInput, Group, XButton, Cell} from 'vux'
    import {AjaxPlugin} from 'vux'
    import {Loading} from 'vux'
    import {Divider} from 'vux'
    import {login, register} from "../../api/user";

    export default {
        components: {
            XInput, XButton, Group, Cell, AjaxPlugin, Loading, Divider,
        },
        data() {
            return {
                password: 'admin',
                password2: "",
                resData: "",
                enterText: '',
                iconType: '',
                tel: "",
                email: "",
                username: "root",
                nickname: "",
                pwdType: "password",    //用于显示隐藏密码
                pwdClass: "cell-icon icon-eye-hidden",

                isLoading: false,
                inLogin: true, // 用于切换显示注册页,登录页
                submitBtnType: "primary",   // AjaxPlugin、axios 测试用变量
                submitBtnLodingState: false,
                submitBtnDisabled: false,

            }
        },
        computed: {
            togleInfo() {
                return this.inLogin ? "或者,创建账户" : "已有账户,登录"
            },
        },
        methods: {
            bePwd: function (value) {
                let reg = /^[A-Za-z0-9]{6,12}$/
                if (reg.test(value)) {
                    return {
                        valid: true,
                    }
                } else {
                    return {
                        valid: false,
                        msg: '6-12位大小写字母加数字'
                    }
                }

            },
            pwdTypeChange() {
                this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
                this.pwdClass = this.pwdType === 'password' ? 'cell-icon icon-eye-hidden' : 'cell-icon icon-eye'
            },

            checkName(val) {
                let reg = /^[A-Za-z][A-Za-z0-9]{5,12}$/
                if (reg.test(val)) {
                    this.iconType = "success"
                } else {
                    this.iconType = "error"
                }
            },
            togleLogin() {
                this.inLogin = !this.inLogin
            },

//            AjaxPlugin 在移动端兼容性都不好，不使用
//             submitForm() {
//                 let username = this.username
//                 let tel = this.tel
//                 let email = this.email
//                 let password = this.password
//
//                 this.submitBtnLodingState = true
// //                this.submitBtnDisabled = true
//
//
//                 let fromData = [
//                     ["username", username],
//                     ["password", password],
//                 ]
//                 let params = new URLSearchParams(fromData);
//
//                 /**
//                  * AjaxPlugin 在UC和夸克都无法提交表单
//                  *
//                  * */
// //                AjaxPlugin.$http.post(process.env.BASE_API + "/phpstorm_test/phpstorm_test/hos_api.php", params)
// //                    .then((response) => {
// //                    _this.resData = response.data
// //                        console.log(this.resData)
// //                    })
//             },

            // 登录按钮事件
            loginBtnClick() {
                let username = this.username
                let password = this.password

                login(username, password).then((res) => {

                    this.resData = res
                    console.log(res);

                    // 登录成功,保存必要信息进localStorage
                    this.$store.commit("setUserInfo", res.userinfo)
                    this.$store.commit("setToken", res.token)

                    // 登录成功 路由跳转并显示 Toast
                    let redirect = this.$router.currentRoute.query.redirect
                    if (redirect) {
                        this.$vux.toast.show({
                            text: "登录成功,2秒后转入之前页面",
                            type: "success",
                        })
                        setTimeout(() => {
                            this.$router.push({path: redirect})
                        }, 2000)
                    } else {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                        setTimeout(() => {
                            this.$router.push({path: "/me"})
                        }, 2000)
                    }
                }).catch(err => {
                    console.log(err)
                })

            },

            // 注册按钮事件
            registerBtnClick() {
                let username = this.username
                let tel = this.tel
                let email = this.email
                let password = this.password
                let password2 = this.password2
                let nickname = this.nickname

                if (isEmptyStr(password) || password2 !== password) {
                    this.$vux.toast.show({
                        text: "请检查密码",
                        type: "warn",
                    })
                    return
                }

                let data = {
                    "username": username,
                    "pwd": password,
                    "nickname": nickname,
                }
                register(data).then((res) => {
                    // 注册成功
                    // 显示 Toast
                    this.$vux.toast.show({
                        text: res.message,
                        type: "success",
                    })
                    // 跳转到登录页,并放置注册的用户名
                    setTimeout(() => {
                        this.inLogin = true
                        this.username = username
                        this.password = ""
                    }, 1500)
                }).catch(err => {
                    console.log(err)
                })
            },

        },
        beforeMount() {
            // 有重定向,说明用户需要登录,这时应该更改用户状态为未验证(或清除localStorage的数据?)
            let redirect = this.$router.currentRoute.query.redirect
            if (redirect) {
                this.$store.commit("changeUserStatus", "unAuth")
            }
        },
    }
</script>
<style lang="less" scoped>
    .login-in {
        .cell-icon {
            color: #8590a6;
        }
    }

    .handleSubmitBtn {
        position: relative;
        display: block;
        margin-left: auto;
        margin-right: auto;
        padding-left: 14px;
        padding-right: 14px;
        box-sizing: border-box;
        font-size: 18px;
        text-align: center;
        text-decoration: none;
        color: #FFFFFF;
        line-height: 2.33333333;
        border-radius: 5px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        overflow: hidden;
        width: 100%;
        border-width: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: #1AAD19;
    }

    .togleLogin {
        text-align: center;
        position: fixed;
        bottom: 100px;
        left: 50%;
        margin-left: -50px;
        color: #1e88e5;
    }
</style>