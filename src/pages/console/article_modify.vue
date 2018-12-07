<template>
    <div class="article_modify">
        <h1>修改文章</h1>

        请输入文章id: <input type="text" v-model="articleId">
        <button @click="getArticle">getArticle</button>
        <div v-if="resData">
            源码显示：
            <textarea cols="50" rows="8" v-model="editorHtmlValue"></textarea>
            <button @click="uploadimg">只是一个功能按钮</button>

            <h1>编辑文章</h1>
            文章标题: <input type="text" v-model="title" name="title" id="title"> <br>
            文章描述:
            <textarea v-model="description" name="description" id="" cols="50" rows="7"></textarea>
            <!--<input type="text" v-model="description" id="description"> -->
            <br>
        </div>

        <div id="editor">
            <mavon-editor ref="mavon-editor" style="height: 80%"
                          v-model="editorValue"
                          default_open="edit"
                          @change="onEditorChange"
                          @htmlcode="onShowHtml"
                          @imgAdd="$imgAdd"
                          @imgDel="$imgDel"></mavon-editor>
        </div>

        <button @click="modifyArticle">提交修改</button>

        <toast v-model="showToast" :type="toastType" :time="2000" is-show-mask :text="toastText"
               position="default"></toast>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Toast,} from 'vux'
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import axios from 'axios'

    export default {
        components: {
            mavonEditor, Toast,
        },
        data() {
            return {
                resData: null,
                articleId: 76,
                isLoading: false,
                editorValue: "",
                editorHtmlValue: "",
                editorMDValue: "",
                img_file: {},
                title: "",
                author: "enzo",
                description: "",
                showPop: false,
                popupText: null,
                showToast: false,
                toastType: "default",
                toastText: "hello world",
            }
        },
        beforeMount() {
            this.fetchData()
        },

        methods: {
            uploadimg() {
                let _this = this
                _this.contentCheck()

            },
            modifyArticle() {
                let _this = this
                if (_this.contentCheck()) {
                    return
                }

                ajax({
                    type: "post",
                    url: process.env.BASE_API + "/console/modify_article.php?id=" + _this.articleId + "&n=" + Math.random(),
                    timeOut: 5000,
                    data: {
                        id: _this.articleId,
                        article: _this.editorHtmlValue,
                        description: _this.description,
                        title: _this.title,
                        author: _this.author,
                        md: _this.editorMDValue,
                    },
                    before: function () {
//                        console.log("before");
                    },
                    success: function (str) {
                        var res = JSON.parse(str)
                        console.log(res)
                        if (res.errno == 0) {
                            _this.toastSuccess(res.msg.receiveMsg)
                        } else {
                            _this.toastWarn(res.msg.errMsg)
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            },
            onShowHtml(status, value) {
                // value 是 markdown 代码
            },
            onEditorChange(value, render) {
//                编辑区发生变化的回调事件(render: value 经过markdown解析后的结果)
                this.editorHtmlValue = render
                this.editorMDValue = value
            },
            $imgAdd(pos, $file) {
                let _this = this
                console.log('imgAdd', pos, $file);
                this.img_file[pos] = $file;

                var formData = new FormData();
                formData.append("file", $file);
                formData.append("author", _this.author);

                axios({
                    url: process.env.BASE_API + "/console/upload_file_test.php?n=" + Math.random(),
                    method: 'post',
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data'},
                }).then((res) => {
                    _this.resData = res.data
                    _this.$refs["mavon-editor"].$imgUpdateByUrl(pos, res.data.data[0]);
                    _this.$refs["mavon-editor"].$img2Url(pos, res.data.data[0]);
                    console.log(res.data);
                })
//                console.log('this.img_file',this.img_file);
            },
            $imgDel(pos) {
                console.log('imgDel', pos);
                delete this.img_file[pos];
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
            fetchData() {
                let _this = this
                ajax({
                    type: "get",
                    url: process.env.BASE_API + "/console/get_article.php?articleId=" + this.articleId + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        var res = JSON.parse(data)
                        _this.resData = res
                        log(_this.resData)

                        // 用来给编辑器赋数据库的文章内容
                        _this.editorValue = _this.resData.data.md
                        _this.title = _this.resData.data.title
                        _this.description = _this.resData.data.description
                    },
                    error() {
                        alert("无法获取服务器数据")
                    }
                })
            },
            getArticle() {
                this.fetchData()
            },
            contentCheck() {

                if (isEmptyStr(this.title)) {
                    this.toastWarn("标题不能为空")
                    return true
                }
                if (isEmptyStr(this.description)) {
                    this.toastWarn("描述不可为空")
                    return true
                }
                if (isEmptyStr(this.editorMDValue)) {
                    this.toastWarn("内容不可为空")
                    return true
                }
            },

        },
        watch: {
            resData(curVal, oldVal) {
            },
        },
    }
</script>

<style>

</style>
