<template>
    <div class="collect">
        <div class="collect-title">主题收藏</div>
        <cell-list :articleList="collectList"></cell-list>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapState} from 'vuex'
    import {getCollectList} from "@/api/collect.js"
    import cellList from "../../components/cellList"

    export default {
        name: "collect",
        data() {
            return {
                // articleList: null,
                resData: null

            }
        },
        computed: {
            ...mapGetters(["collectList", "userInfo"])
        },
        components: {cellList},
        methods: {},

        mounted() {

            getCollectList(this.userInfo.id,)
                .then((res) => {
                    this.$store.commit("setcollectList", res)
                })
                .catch(err => {
                    console.error(err)
                })
        },
        watch: {},
    }
</script>

<style lang="less">
    .collect {
        .collect-title {
            padding: 14px 15px 10px;
            color: #999999;
            font-size: 13px;
            position: relative;
        }

    }
</style>
