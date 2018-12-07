<template>
    <div class="news">
        <div>
            <tab :line-width=2 active-color="#fc378c" v-model="index">
                <tab-item class="vux-center" :selected="demo2 === item" v-for="(item, index) in list" @click="demo2 = item" :key="index">{{item}}</tab-item>
            </tab>
            <swiper v-model="index" height="100px" :show-dots="false">
                <swiper-item v-for="(item, index) in list" :key="index">
                    {{item }} 板块建设中
                </swiper-item>
            </swiper>
        </div>

        <group>
            <scroller lock-y :scrollbar-x=false>
                <div class="box1">
                    <div class="box1-item" v-for="i in 7"><span>{{' ' + i + ' '}}</span></div>
                </div>
            </scroller>
        </group>


        <!--<divider>我是有底线的</divider>-->
    </div>
</template>

<script type="text/ecmascript-6">
    import { Tab, TabItem,Swiper, SwiperItem,GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'
    import { Divider } from 'vux'
    import { Scroller } from 'vux'
    import { AjaxPlugin } from 'vux'

    export default {
        components: {
            Tab, TabItem,Swiper, SwiperItem,
            Group,
            GroupTitle,
            Cell,
            XInput,
            Selector,
            PopupPicker,
            XAddress,
            Datetime,
            XNumber,
            XTextarea,
            XSwitch,
            Divider,
            Scroller,
        },
        data (){
            return {
                list : [ "科学", "体育", "时尚", "经济", "政治"],
                demo2: '美食',
                index: 0,
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .box1 {
        height: 100px;
        position: relative;
        width: 1490px;
    }
    .box1-item {
        width: 200px;
        height: 100px;
        background-color: #ccc;
        display:inline-block;
        margin-left: 15px;
        float: left;
        text-align: center;
        line-height: 100px;
    }
    .box1-item:first-child {
        margin-left: 0;
    }
    .box2-wrap {
        height: 300px;
        overflow: hidden;
    }
    .news{
        padding-bottom: 56px;
    }
</style>
