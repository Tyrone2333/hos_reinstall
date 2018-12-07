<template>
    <div class="mavon_editor_test">

        <input type="text" v-model="draft.title" name="title" id="title" placeholder="请输入标题">
        <br>
        <br>

        <!--<button @click="aTestBtn" class="btn-publish">只是一个功能按钮</button>-->

        <div id="editor">
            <mavon-editor ref="mavon-editor" style="height: 80%"
                          v-model="draft.editorValue"
                          default_open="edit"
                          @change="onEditorChange"
                          @htmlcode="onShowHtml"
                          placeholder="提交“待验证”的预言、个人判断、思路"
                          @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
        </div>

        <div class="tag-panel">
            <div class="joinTopic ">
                <span class="field">已加入的话题:</span>
                <transition-group name="list-complete" tag="p">
                <span v-for="(item,idx) in draft.joinTopicList"
                      @click="joinClick(item,idx)"
                      v-bind:key="item"
                      class="list-complete-item tag">{{item}}</span>
                </transition-group>
            </div>
            <div class="options">
                <span class="field">待选话题:</span>

                <transition-group name="list-complete-botton" tag="p">
                <span v-for="(item,idx)  in draft.optionsList "
                      @click="optionsClick(item,idx)"
                      v-bind:key="item"
                      class="list-complete-item tag"
                >{{item}}</span>
                </transition-group>
            </div>
        </div>


        <!--<group>-->
        <!--<datetime title="验证时间"-->
        <!--v-model="draft.minuteListValue"-->
        <!--format="YYYY-MM-DD HH:mm"-->
        <!--:minute-list="['00', '15', '30', '45']"-->
        <!--@on-change="dateTimechange"-->
        <!--:min-year=2018-->
        <!--:max-year=2099-->
        <!--&gt;</datetime>-->
        <!--</group>-->


        <div class="major-publish">
            <button class="btn-publish" @click="uploadArticle">提交文章</button>
        </div>

        <div>
            <popup v-model="showPop" position="bottom" :show-mask="false">
                <div class="popup-text">
                    {{popupText}}
                </div>
            </popup>
        </div>
        <loading :show="isLoading" text="数据加载中..."></loading>
        <toast v-model="showToast" :type="toastType" :time="2000" is-show-mask :text="toastText"
               position="default"></toast>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Loading, Popup, Group, Cell, XInput, XButton, XSwitch, Toast, Datetime} from 'vux'
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import axios from 'axios'
    import {mapGetters} from 'vuex'

    import {public_article} from "../../api/article";

    /**
     *   也有用过 wangeditor,效果不理想,展示没合适的替代品,移动端的 md 编辑器体验都不好
     */
    export default {

        data() {
            return {
                draft: this.$store.state.article.draft,
                isLoading: false,
                img_file: {}, // 图片列表
                resData: null,

                showPop: false,
                popupText: null,
                showToast: false,
                toastType: "default",
                toastText: "hello world",
            }
        },
        components: {
            Loading,
            mavonEditor,
            Popup,
            Group,
            Cell,
            XSwitch, Datetime,
            Toast,
            XButton, XInput,
        },
        methods: {
            aTestBtn() {
                log(this.draft)

                // log(this.$store.state.user.token)

            },
            uploadArticle() {

                if (this.contentCheck()) {
                    return
                }

                let data = {
                    // id,token,username,
                    // title, author,author_id, description, content, md,banner_img,fuck_date,tags,
                    id: this.$store.state.user.user.id,
                    token: this.$store.state.user.token,
                    username: this.$store.state.user.user.username,

                    content: this.draft.editorHtmlValue,
                    description: this.draft.description,
                    title: this.draft.title,
                    author: this.$store.state.user.user.nickname,
                    author_id: this.$store.state.user.user.id,
                    md: this.draft.editorMDValue,
                    banner_img: this.draft.banner_img,
                    fuck_date: this.draft.fuckDate,
                    tags: this.draft.tags || this.draft.joinTopicList.join(",")
                }
                // this.contentCheck()

                public_article({...data}).then((res) => {
                    this.toastSuccess(res.message)
                }).catch(err => {
                    console.error(err)
                })

            },
            onShowHtml(status, value) {
                // value 是 markdown 代码
            },
            onEditorChange(value, render) {
//                编辑区发生变化的回调事件(render: value 经过markdown解析后的结果)
                this.draft.editorHtmlValue = render
                this.draft.editorMDValue = value
            },
            $imgAdd(pos, $file) {

                console.log('$imgAdd:', pos, $file)
                this.img_file[pos] = $file

                /**
                 *  巨坑!必须把文件放在最底下,否则在后台会先收到文件,这时用 multer.diskStorage 处理会获取不到req.body
                 *  因为req.body还没收到.
                 *  github 相关 issue: https://github.com/expressjs/multer/issues/146
                 */
                let formData = new FormData()
                formData.append("author", this.$store.state.user.user.username)
                // 用 type 区分文章配图,头像,以及后续的其他图片
                formData.append("type", "article")
                formData.append("file", $file)

                axios({
                    // url: process.env.BASE_API + "/console/upload_file_test.php?n=" + Math.random(),
                    // url: "http://127.0.0.1:80" + "/console/upload_file_test.php?n=" + Math.random(),
                    url: process.env.BASE_API + "/upload/article_img",
                    method: 'post',
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data', 'token': this.$store.state.user.token},
                }).then((res) => {
                    this.resData = res.data
                    this.$refs["mavon-editor"].$imgUpdateByUrl(pos, res.data.data[0])
                    this.$refs["mavon-editor"].$img2Url(pos, res.data.data[0])
                    this.draft.banner_img = res.data.data[0]
                    console.log(res.data)
                })
//                console.log('this.img_file',this.img_file)
            },
            $imgDel(pos) {
                console.log('imgDel', pos)
                delete this.img_file[pos]
            },
            toastWarn(text) {
                this.toastType = "warn"
                this.toastText = text
                this.showToast = true
            },
            toastSuccess(text) {
                this.toastType = "success"
                this.toastText = text
                this.showToast = true
            },
            contentCheck() {

                this.draft.tags = this.draft.joinTopicList.join(",")

                if (isEmptyStr(this.draft.title)) {
                    this.toastWarn("标题不能为空")
                    return true
                }
                if (isEmptyStr(this.draft.editorMDValue)) {
                    this.toastWarn("内容不可为空")
                    return true
                }
                if (this.draft.tags === "") {
                    this.toastWarn("至少加入一个话题")
                    return true
                }
            },
            joinClick: function (item, idx) {
                this.draft.joinTopicList.splice(idx, 1)
                // 从"已加入的话题"点击选项回到"待选话题"时随机顺序
                this.draft.optionsList.splice(this.randomIndex(this.draft.optionsList), 0, item)
                console.log(item)
            },
            optionsClick: function (item, idx) {
                this.draft.optionsList.splice(idx, 1)
                this.draft.joinTopicList.push(item)
                console.log(item)
            },
            randomIndex: function (items) {
                return Math.floor(Math.random() * items.length)
            },
            dateTimechange: function (value) {
                console.log('change', value)
                let dates = value.split(" ")
                let date = dates[0].split("-")
                let time = dates[1].split(":")
                let humanTime = new Date(Date.UTC(date[0], date[1] - 1, date[2], time[0] - 8, time[1], 0))
                this.draft.fuckDate = humanTime.getTime() / 1000
            },

        },
        watch: {
            showPop(val) {
                log(val)
                if (val) {
                    setTimeout(() => {
                        this.showPop = false
                    }, 1000)
                }
            },
            draft(curVal, oldVal) {
                this.$store.commit("setdraft", curVal)
            }
        },
    }
</script>

<style lang="less">
    .icon-chrome {
        color: #5d0500;
        width: 30px;
        height: 30px;
    }

    .popup-text {
        background-color: #30415e;
        color: #fafbfc;
        text-align: center;
        padding: 20px;
    }

    #title {
        width: 98%;
        border: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: transparent;
        color: inherit;
        height: 1.41176471em;
        margin: 3px 2px;
        font-size: 20px;
        font-weight: bold;
        line-height: 1.5;
        /*border-top: 1px solid #D9D9D9;*/
        border-bottom: 1px solid #D9D9D9;
        &:focus {
            border-bottom: 2px solid #0f88eb;
        }
    }

    .major-publish {
        &:after {
            content: " ";
            display: block;
            visibility: hidden;
            clear: both;
        }
        .btn-publish {
            float: right;
            text-align: center;
            padding: 6px 14px;
            line-height: normal;
            font-size: 14px;
            vertical-align: middle;
            height: auto;
            background: #0f88eb;
            color: #fff;
            border-radius: 3px;
            /*border: none;*/
            z-index: 103;
            margin: 16px;
            border: 1px solid #0f88eb;
        }
    }

    .tag-panel {
        /*.options */
        .tag {
            display: inline-block;
            white-space: nowrap;
            margin: 6px;
            padding: 3px 13px;
            line-height: 1.62;
            background-color: #f5f5f5;
            font-size: 13px;
            letter-spacing: normal;
            word-spacing: normal;
            vertical-align: top;
            color: #37a;
            border: 1px solid #e5e5e5;
        }

        /*.joinTopic span {*/
        /*padding: 5px 8px;*/
        /*background-color: #0f88eb;*/
        /*border-radius: 2px;*/
        /*margin: 5px;*/
        /*}*/

    }

    .field {
        background-color: #fff !important;
        color: #757575;
        padding-right: .4em;
    }

    /*添加标签的动画css*/
    .list-complete-item {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }

    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(10px);
    }

    .list-complete-leave-active {
        position: absolute;
    }

    .list-complete-item-botton {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }

    .list-complete-botton-enter, .list-complete-botton-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(-10px);
    }

    .list-complete-botton-leave-active {
        position: absolute;
    }

</style>