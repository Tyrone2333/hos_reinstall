/**
        时间转换相关的 mixins

        从utils引过来不能在 template 直接用,还必须得脱裤子放屁:
        commonTime(time) {
            return commonTime(time)
        },
        这时候用 mixin 就完美了

        由于只一个函数,就暂放 utils ,不另开文件夹
 */

export default {
    methods: {

        // Unix 时间戳转正常时间
        commonTime(timestamp) {
            // js 中用的是毫秒
            let unixTimestamp = new Date(timestamp * 1000)
            return unixTimestamp.toLocaleString()
        },
    }
}