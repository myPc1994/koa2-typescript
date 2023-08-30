/* eslint-disable */
const path = require('path');
const fileUtil = require('./util/fileUtil');
//清空输出文件
fileUtil.clearAll(path.resolve(__dirname, '..\\dist'));
console.log("正在编译typeScript文件中...");