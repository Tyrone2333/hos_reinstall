<template>
    <div class="upload-avatar">
        <!--头像上传,透明度设为0隐藏-->
        <input id="uploadInput" type="file"
               accept="image/gif,image/jpeg,image/jpg,image/png">
    </div>


</template>

<script>
    export default {
        name: "uploadAvatar",
        props: {
            // 必须传入头像所属的 username
            username: {
                type: String,
                required: true,
            },

        },
        mounted() {
            this.uploadInput = document.getElementById("uploadInput")

                this.uploadInput.addEventListener('change', this.uploadAvatar);


        },
        methods: {
            uploadAvatar() {
                // 只传一个文件
                let curFiles = this.uploadInput.files[0]
                log(curFiles)
                // import axios from 'axios'
                const axios = require("axios")

                let formData = new FormData()
                formData.append("username", this.username)
                // 用 type 区分文章配图,头像,以及后续的其他图片
                formData.append("type", "avatar")
                formData.append("file", curFiles)

                axios({
                    // url: process.env.BASE_API + "/console/upload_file_test.php?n=" + Math.random(),
                    // url: "http://127.0.0.1:80" + "/console/upload_file_test.php?n=" + Math.random(),
                    url: process.env.BASE_API + "/upload/avatar",
                    method: 'post',
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data', 'Authorization': this.$store.state.user.token},
                }).then((response) => {
                    let res = response.data
                    if (res.errno === 0) {
                        this.$store.commit("changeAvatar", res.avatarUrl)
                        this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                    } else {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "warn",
                        })
                    }
                    console.log("修改头像:", res)
                })

            },

        }
    }
</script>

<style lang="less" scoped>
    .upload-avatar {

        #uploadInput {
            position: absolute;
            width: 100%;
            height: 100%;
            /*font-size: 100px;*/
            right: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
        }
    }

</style>