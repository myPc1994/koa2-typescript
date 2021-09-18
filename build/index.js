const path = require('path');
const fileUtil = require('./util/fileUtil');
const target = path.resolve(__dirname, '../package.json');
const source = path.resolve(__dirname, '../dist/package.json');
//清空输出文件
// fileUtil.clearAll(rootDis + "/dist");
//替换version
fileUtil.copyReplace(target,source, (data) => {
  let package = JSON.parse(data);
  package.devDependencies = {}
  //保留pm2开头
  console.log(package);
  return JSON.stringify(package, null, "\t");
});
