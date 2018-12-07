<template>
    <div class="feedback">
        <group title="基本信息">
            <x-input title="姓名" name="name" v-model="name" placeholder="请输入姓名" is-type="china-name"></x-input>

            <x-input title="邮箱" name="email" placeholder="请输入邮箱地址" is-type="email"></x-input>
            <x-input title="手机号码" mask="999 9999 9999" v-model="maskValue" :max="13"
                     is-type="china-mobile"></x-input>
        </group>

        <group title="性别 ">
            <x-switch :title="  value1 ? '男' : '女' " v-model="value1"></x-switch>
        </group>

        <group title="">
            <x-number :name="('Quantity')" title="你的年龄" v-model="age"></x-number>
        </group>

        <group label-width="5em" label-align="left">
            <x-address :title="title2" v-model="value2" raw-value :list="addressData"
                       value-text-align="left"></x-address>
        </group>

        <div class="box">
            <div class="weui-cells__title">所属行业 </div>
            <checker v-model="checkVal"
                     type="checkbox"
                     default-item-class="demo5-item"
                     selected-item-class="demo5-item-selected">
                <checker-item v-for="(val,key) in industry" :key="key" :value="key">
                    {{val}}
                </checker-item>
            </checker>
        </div>

        <group title="给我打分">
            <cell title="给我评个分" inline-desc="">
                <rater v-model="raterNumber"></rater>
            </cell>
        </group>


        <group title="验证码" class="weui-cells_form">
            <x-input title="验证码" class="weui-cell_vcode">
                <img slot="right" class="weui-vcode-img" src="https://i.loli.net/2017/09/18/59bf7f32425d5.jpg">
            </x-input>
            <x-input title="发送验证码" class="weui-vcode">
                <x-button slot="right" type="primary" mini>发送验证码</x-button>
            </x-input>
        </group>


        <group title="建议意见吐槽">
            <x-textarea :max="200" placeholder="" @on-focus="onEvent('focus')"
                        @on-blur="onEvent('blur')"></x-textarea>
        </group>

        <group>
            <x-button type="warn" @click.native="submit">提交反馈</x-button>
        </group>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XTextarea, Group, XInput, XNumber, XButton, XAddress, ChinaAddressV4Data, Cell, Rater, XSwitch,Checker, CheckerItem,} from 'vux'

    export default {
        name: "feedback",
        components: {
            XTextarea,
            Group,
            XInput, XNumber, XButton, XAddress, ChinaAddressV4Data, Cell, Rater, XSwitch,Checker, CheckerItem,
        },
        data() {
            return {
                name: "",
                value: "",
                title: '默认为空',
                value_0_1: [],
                value1: true,
                title2: '你的地址',
                value2: ['福建省', '泉州市', '鲤城区'],
                value3: ['广东省', '中山市', '--'],
                addressData: ChinaAddressV4Data,
                value4: [],
                value5: ['广东省', '深圳 市', '南山区'],
                showAddress: false,
                raterNumber: 5,
                password: '123465',
                password2: '',
                enterText: '',
                valid1: false,
                valid2: false,
                iconType: '',
                age: 20,
                be2333: function (value) {
                    return {
                        valid: value === '2333',
                        msg: 'Must be 2333'
                    }
                },
                style: '',
                disabledValue: 'hello',
                debounceValue: '',
                maxValue: '',
                maskValue: '13545678910',
                maskValue2: '',
                checkVal:[2, 3],
                industry: ['电子商务', '社交网络','产品运营',"云计算","游戏","程序员","物联网","非互联网行业"],

            }
        },
        methods: {
            onEvent(event) {
                console.log('on', event)
            },
            getValid1() {
                this.valid1 = this.$refs.input01.valid
            },
            getValid2() {
                this.valid2 = this.$refs.input02.valid
            },
            change(val) {
                console.log('on change', val)
            },
            onBlur(val) {
                console.log('on blur', val)
            },
            onFocus(val, $event) {
                console.log('on focus', val, $event)
            },
            onEnter(val) {
                console.log('click enter!', val)
            },
            submit(){
                if(isEmptyStr(this.name) ){
                    this.$vux.toast.show({
                        text: "姓名必填哦",
                        type: "warn",
                    })
                } else {
                    this.$vux.toast.show({
                        text: "提交成功",
                        type: "success",
                    })
                }

            }
        },
    }
</script>

<style lang="less">
    .feedback{
        .box {
            padding: 15px 0;
        }
        .demo5-item {
            width: 100px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border-radius: 3px;
            border: 1px solid #ccc;
            background-color: #fff;
            margin-right: 6px;
        }
        .demo5-item-selected {
            background: #ffffff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3G+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC) no-repeat right bottom;
            border-color: #ff4a00;
        }
    }

</style>
