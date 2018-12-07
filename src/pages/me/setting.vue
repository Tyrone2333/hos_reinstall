<template>
    <div class="setting">

        <!--头部的用户信息-->
        <!--驼峰和短横线分隔其实都可以使用-->
        <profile-intro :userInfo="userInfo"
                       avatar-shape="squircle"
                       avatarBehavior="uploadAvatar"
                       :showUsername="false"
        ></profile-intro>


        <div class="information">
            <group title="基本信息">
                <x-input title="用户名" name="name" v-model="informationDraft.nickname" placeholder="请输入用户名"></x-input>

                <x-input title="邮箱" name="email" placeholder="请输入邮箱地址" is-type="email"
                         v-model="informationDraft.email"></x-input>

                <x-switch :title="informationDraft.sex ? '男' : '女' " v-model="informationDraft.sex"></x-switch>

                <popup-picker title="你的年龄"
                              :data="ageList"
                              v-model="informationDraft.age"
                              placeholder="请选择年龄"
                ></popup-picker>

                <x-address title="你的地址"
                           v-model="informationDraft.address"
                           raw-value
                           :list="addressData"
                           value-text-align="right"></x-address>

                <cell>
                    <x-button mini type="primary" @click.native="changeInformation">修改基本信息</x-button>
                </cell>
            </group>

            <group title="密码设置">
                <x-input title="旧密码" required v-model="oldPwd"></x-input>
                <x-input title="新密码" required v-model="newPwd" :min="6" :max="15"></x-input>
                <x-input title="重复密码" required v-model="newPwd2" :min="6" :max="15" :equal-with="newPwd"></x-input>

                <cell>
                    <x-button mini type="primary" @click.native="changePwd">修改密码</x-button>
                </cell>
            </group>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
      import {XTextarea,Group,XInput,XNumber,XButton,XAddress,ChinaAddressV4Data,Cell,Rater,XSwitch,Checker,CheckerItem,PopupPicker,}from'vux'
      import {mapGetters} from 'vuex'
      import {changeInformation, changePwd} from "@/api/user"
      import profileIntro from "../../components/profileIntro"

    export default {
        name: "setting",
        components: {
            XTextarea,
            Group,
            XInput,
            XNumber,
            XButton,
            XAddress,
            ChinaAddressV4Data,
            Cell,
            Rater,
            XSwitch,
            Checker,
            CheckerItem,
            profileIntro,
            PopupPicker,
        },
        data() {
            return {
                informationDraft: {},

                addressData: ChinaAddressV4Data,    // 全国地址信息

                raterNumber: 5, // 星星
                oldPwd: '', // 改密码
                newPwd: '',
                newPwd2: '',


            }
        },
        computed: {
            ...mapGetters(["userInfo"]),

            // 年龄列表,10 - 60岁
            ageList: function () {
                let t = [[]]
                for (let i = 10; i < 60; i++) {
                    t[0].push(i)
                }
                return t
            }
        },
        mounted() {
            // 复制一下 userInfo,不需要深拷贝
            this.createInformationDraft()

        },

        methods: {


            // 创建符合 vux 组件要求的 用户信息数据
            createInformationDraft() {
                this.informationDraft = JSON.parse(JSON.stringify(this.userInfo))
                if (this.informationDraft.address == null || isEmptyStr(this.informationDraft.address)) {
                    this.informationDraft.address = []
                } else {
                    this.informationDraft.address = this.informationDraft.address.split(",")
                }
                // 年龄组件 popup-picker 需要字符串,不能用数字
                if (this.informationDraft.age == null) {
                    this.informationDraft.age = []
                } else {
                    this.informationDraft.age = [this.informationDraft.age.toString()]
                }

                // 男的时候为真,女为假
                this.informationDraft.sex = this.informationDraft.sex !== 0;

                if (this.informationDraft.email == null || isEmptyStr(this.informationDraft.email)) {
                    this.informationDraft.email = ""
                }
            },
            // 修改个人信息
            changeInformation() {
                // 将 vux 组件格式的数据改为可以存入数据库的格式
                let data = {
                    nickname: this.informationDraft.nickname,
                    age: this.informationDraft.age[0],
                    sex: this.informationDraft.sex ? 1 : 0,
                    email: this.informationDraft.email,
                    address: this.informationDraft.address.join(","),
                }
                changeInformation({...data})
                    .then((res) => {

                        this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                        // 更新用户信息
                        this.$store.commit("setUserInfo", res.userinfo)

                    })
                    .catch(err => {
                        console.error(err)
                    })


            },
            // 修改密码
            changePwd() {

                changePwd(this.oldPwd, this.newPwd)
                    .then((res) => {
                        this.$vux.toast.show({
                            text: "修改成功,请重新登录",
                            type: "success",
                        })
                        setTimeout(() => {
                            this.$router.push({path: "/login"})
                        }, 2000)
                        this.$store.dispatch("_signOut")
                    })
                    .catch(err => {
                        console.error(err)
                    })

            }
        },

    }
</script>

<style lang="less">
    .setting {

    }

</style>
