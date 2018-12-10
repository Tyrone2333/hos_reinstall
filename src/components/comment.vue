<template>
    <div class="comment">
        <!--发表评论-->
        <div class="top-title">
            <div class="left ">精彩评论</div>
            <!--<div class="right icon  icon-quill" @click="replyDialogShow()">写评论</div>-->
        </div>

        <!--评论列表-->
        <div class="comments" v-if="commentList.length ">
            <div class="comment-wrapper" v-for="(val,key) in commentList">
                <div class="avatar" @click="clickSomebody(val.from_id)">
                    <img :src="val.avatar" alt="">
                </div>
                <div class="comment-right">
                    <div class="nickname">{{val.from_nickname}}
                        <span class="reply_by_author" v-if="authorId === val.from_id">作者</span>
                    </div>
                    <div class="content">
                        <span @click="clickSomebody(val.to_id)" class="at-someone">{{!val.is_for_author ?"@" +val.to_nickname + "\t" :"" }}</span>
                        <div v-html="val.content" style="display: inline-block"></div>
                        <!--{{val.content}}-->
                    </div>
                    <div class="footer">
                        <span class="left">{{key + 1}}楼 {{formatMsgTime(val.timestamp * 1000)}}</span>
                        <span class="right icon icon-question_answer" @click="replyDialogShow(val)"></span>
                    </div>
                </div>
            </div>
        </div>
        <!--没有评论-->
        <div class="comments no-comment" v-else>
            暂无评论
        </div>

        <!--回复-->
        <div v-transfer-dom>
            <x-dialog v-model="showReplyDialog"
                      :hide-on-blur="true">

                <div class="reply">
                    <form>
                        <textarea name="content" maxlength="10000" class="mll" id="reply_content"
                                  v-model="commentContent"
                                  :placeholder="replyPlaceholder"
                                  style="overflow: hidden; word-wrap: break-word; resize: none; height: 112px;"></textarea>
                    </form>

                    <span class="weui-btn weui-btn_mini btn-none" @click="showReplyDialog=false">取消</span>
                    <span class="weui-btn weui-btn_mini weui-btn_primary" @click="replySend">确认</span>
                    <!--上面是直接写类名，不引入 x-button 样式不会加进来生效-->
                    <x-button mini type="primary" style="display: none">primary</x-button>
                </div>
            </x-dialog>
        </div>
    </div>
</template>

<script>
    import * as utils from "../utils/common"
    import {TransferDomDirective as TransferDom} from 'vux'
    import {XDialog, XButton} from 'vux'
    import {reply} from "../api/article.js"

    export default {
        name: "commentList",
        components: {
            XDialog, XButton,
        },
        directives: {
            TransferDom
        },
        props: {
            commentList: {
                type: Array,
                // 对象或数组默认值必须从一个工厂函数获取
                default: function () {
                    return [];
                }
            },
            // 必须传入所在文章的作者id,否则评论不能用,还用于显示评论是否来自作者
            authorId: {
                type: Number,
                required: true,
            }
        },
        data() {
            return {
                commentReply: {},    // 要回复的那条评论信息
                commentContent: "",  // 评论的内容
                replyPlaceholder: "",
                showReplyDialog: false,

            }
        },
        methods: {
            // 这写起来就很狗了
            formatMsgTime(timestamp) {
                return utils.formatMsgTime(timestamp)
            },
            clickSomebody(userId) {
                this.$router.push({name: 'user', params: {id: userId}})
            },

            clickReply() {
                this.$emit("clickReply")
            },
            // 用于显示评论框, @别人 会有一个 placeholder 样式
            replyDialogShow(commentInfo) {

                this.showReplyDialog = true
                this.commentReply = commentInfo || {}

                this.replyPlaceholder = this.commentReply.from_nickname ? "@" + this.commentReply.from_nickname : ""
                // setTimeout(function () {
                //     document.getElementById("reply_content").focus()
                // }, 1)
                this.$nextTick(() => {
                    document.getElementById("reply_content").focus()
                })

                /**
                 * 有bug,放在最底部可以这样,如果reply组件底下还有东西就不行
                 *
                 * 现在换成x-dialog,不用滚动到底下
                 *
                 let offsetTop = document.querySelector('.reply').offsetTop
                 setTimeout(() => {
                    this.$parent.$parent.$parent.$refs.viewBox.scrollTo(offsetTop)
                }, 0)
                 *
                 */
            },
            replySend() {
                let url = window.location.href
                this.articleId = this.$route.params.articleId || this.getIdByURL(url)

                let data = {

                    from_id: this.$store.state.user.user.id,
                    to_id: this.commentReply.from_id || this.authorId || 0,
                    content: this.commentContent,
                    article_id: this.articleId,
                }
                reply({...data}).then((res) => {

                    this.commentContent = ""
                    this.showReplyDialog = false
                    this.$vux.toast.show({
                        text: res,
                        type: "success",
                    })
                    // 触发评论更新
                    this.$emit("updateReply", res.data)
                }).catch(err => {
                    console.error(err)
                })

            },
        }

    }
</script>

<style lang="less" scoped>

    .top-title {
        display: flex;
        justify-content: space-between;
        margin: 10px 10px;
        .left {

        }
        .right {
            float: right;
            color: #3194d0;
            line-height: 22px;
        }

    }

    .comments {
        & :first-child .comment-right {
            border: none !important;
        }
        .comment-wrapper {
            display: flex;
            .comment-right {
                flex: 4;
                flex-direction: column;
                border-top: 1px solid #e8e8e8;
                margin-right: 1em;
                & > div {
                    margin: 5px 0;
                }
                .nickname {
                    font-size: .8rem;
                    line-height: 1.2rem;
                    color: #303030;
                }
                .reply_by_author {
                    color: #fff;
                    background-color: #6ba44e;
                    padding: 2px;
                    font-size: .8rem;
                }
                .content {
                    color: #606060;
                    font-size: .9rem;
                    line-height: 1.2rem;
                    word-wrap: break-word;
                    text-align: left;
                    padding-top: .4rem;
                    padding-bottom: .35rem;
                    font-weight: 400;
                }
                .footer {
                    color: silver;
                    line-height: 1.05rem;
                    font-size: .8rem;
                    padding-bottom: .6rem;
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                }
            }
            .avatar {
                flex: 1;
                img {
                    margin: 10px;
                    height: 50px;
                    width: 50px;
                }
            }

        }

        &.no-comment {
            text-align: center;
        }
    }

    // 评论css
    .reply {
        .btn-none {
            border: none !important;
            background: transparent !important;
            color: black;
            &.btn-none:after {
                content: none;
            }
        }
    }
</style>