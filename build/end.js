const path = require('path');
const fileUtil = require('./util/fileUtil');
const target = path.resolve(__dirname, '..\\package.json');
const source = path.resolve(__dirname, '..\\dist\\package.json');
console.log("正在拷贝必要文件中...");
const copyArr = ["Dockerfile", ".dockerignore", "pm2.config.js", "docker-compose.yml"];
//拷贝Dockerfile
for (const fileName of copyArr) {
    fileUtil.copyFile(path.resolve(__dirname, `..\\${fileName}`), path.resolve(__dirname, `..\\dist\\${fileName}`))
}
//拷贝env
fileUtil.copyAll(path.resolve(__dirname, '..\\bin'), path.resolve(__dirname, '..\\dist\\bin'))
fileUtil.copyAll(path.resolve(__dirname, '..\\env'), path.resolve(__dirname, '..\\dist\\env'))
//拷贝static
fileUtil.copyAll(path.resolve(__dirname, '..\\static'), path.resolve(__dirname, '..\\dist\\static'))
//拷贝apidoc
fileUtil.copyAll(path.resolve(__dirname, '..\\public\\apidoc'), path.resolve(__dirname, '..\\dist\\public\\apidoc'))
// 拷贝package.json
fileUtil.copyReplace(target, source, (data) => {
    let package = JSON.parse(data);
    package.devDependencies = {}
    package.scripts = {
        "start": "pm2 start pm2.config.js",
        "restart": "pm2 restart node-koa2-base",
        "list": "pm2 list",
        "stop": "pm2 stop node-koa2-base",
        "log": "pm2 log node-koa2-base",
        "flush": "pm2 flush",
        "delete": "pm2 delete node-koa2-base"
    }
    return JSON.stringify(package, null, "\t");
});
console.log("编译完成!");
console.log("直接发布更新dist目录下的全部文件即可!");
console.log("如果没有安装pm2:npm install pm2 -g");
console.log("pm2启动服务: npm run start");
