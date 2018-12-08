var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    HOST: `'${getIPAddress()}'`,
    PORT: '10088',
    // BASE_API: '"http://192.168.1.142:80"', // 本机php
    // BASE_API: '"http://127.0.0.1:80"',
    // BASE_API: '"http://192.168.1.142:10010/hos_api"',// 本机node 宿舍

    // BASE_API: '"http://127.0.0.1:10010/hos_api"',// 本机node
    // BASE_API: '"http://192.168.36.171:10010/hos_api"',// 本机node 公司

    BASE_API: `'http://${getIPAddress()}:10010/hos_api'`,// 本机node
    CHAT_WS_SERVER: `'ws://${getIPAddress()}:10010'`,
    APP_NAME: '"机yo"'

})

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    // return '0.0.0.0';
    return '127.0.0.1';
}