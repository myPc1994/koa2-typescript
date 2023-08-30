/* eslint-disable */
const path = require('path');
const fileUtil = require('./util/fileUtil');
console.log("开始加密中....")
//代码加密
global.encryptionError = {};//加密错误信息
fileUtil.encryptionPath(path.resolve(__dirname, '..\\dist\\src'), path.resolve(__dirname, '..\\dist\\src'), /\.js$/)
if (Object.keys(global.encryptionError).length === 0) {
    console.log("全部加密成功!")
    console.log("源代码加密完成!");
    console.log("直接发布更新dist目录下的全部文件即可!");
    console.log("如果没有安装pm2:npm install pm2 -g");
    console.log("pm2启动服务: npm run start");
} else {
    console.error("加密失败!", global.encryptionError)
    console.error("加密失败个数:", Object.keys(global.encryptionError).length)
}

