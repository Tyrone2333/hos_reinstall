function log(message) {
    if(arguments.length>1){
        console.log(...arguments)
        return
    }
    const date = new Date()
    const time = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]\t`

    if (typeof message === "string"  ) {
        console.log("%c " + message + " %c",
            "background:#fff; padding: 1px; color: #1b54f2", "background:transparent")
    } else if (typeof message === "number"){
        console.log("%c " + message + " %c",
            "background:#41b883 ; padding: 1px; border-radius: 3px ;  color: #fff", "background:transparent")
    }else if (Array.isArray(message)){
        console.table(message)
    }
    else {
        // console.log(time, ...arguments)
        console.log(message)
    }
}
window.log = log;

function isEmptyArr(value) {
    return (Array.isArray(value) && value.length === 0)
        || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
function isEmptyStr(str) {
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (str.length === 0 || str.replace(/(^s*)|(s*$)/g, "").length === 0 || str == null || re.test(str))
    {
        return true
    }else {
        return false
    }
}



