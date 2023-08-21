const pkg = require("../package.json");
const path = require('path');
const fileUtil = require('./util/fileUtil');
const target = path.resolve(__dirname, '..\\package.json');
const source = path.resolve(__dirname, '..\\dist\\package.json');
console.log("正在拷贝必要文件中...");
const copyArr = ["Dockerfile", ".dockerignore", "pm2.config.js", "start.bat", "start.sh", "rm.bat", "rm.sh"];
//拷贝Dockerfile
for (const fileName of copyArr) {
    fileUtil.copyFile(path.resolve(__dirname, `..\\${fileName}`), path.resolve(__dirname, `..\\dist\\${fileName}`))
}
//拷贝env
fileUtil.copyAll(path.resolve(__dirname, '..\\bin'), path.resolve(__dirname, '..\\dist\\bin'));
fileUtil.copyAll(path.resolve(__dirname, '..\\env'), path.resolve(__dirname, '..\\dist\\env'));
//拷贝static
fileUtil.copyAll(path.resolve(__dirname, '..\\static'), path.resolve(__dirname, '..\\dist\\static'));
//拷贝apidoc
fileUtil.copyAll(path.resolve(__dirname, '..\\public\\apidoc'), path.resolve(__dirname, '..\\dist\\public\\apidoc'));
//拷贝src内除了.ts文件外的其他文件
fileUtil.copyAll(path.resolve(__dirname, '..\\src'), path.resolve(__dirname, '..\\dist\\src'), /^.*\.(?!ts).*$/);
// 拷贝package.json,同时去除开发环境包，替换sript标签内容
fileUtil.copyReplace(target, source, (data) => {
    let package = JSON.parse(data);
    package.devDependencies = {}
    package.scripts = {
        "start": "pm2 start pm2.config.js",
        "init":`pm2 install pm2-logrotate && pm2 set pm2-logrotate:max_size "100M" && pm2 set pm2-logrotate:retain 7 && pm2 set pm2-logrotate:compress true && pm2 set pm2-logrotate:dateFormat "YYYY-MM-DD" && pm2 set pm2-logrotate:workerInterval 3600 && pm2 set pm2-logrotate:rotateInterval "0 0 * * *" && pm2 set pm2-logrotate:rotateModule true && pm2 set pm2-logrotate:rotateModuleKeep 10`,
        "restart": "pm2 restart " + pkg.name,
        "logrotateConfig": "pm2 conf pm2-logrotate",
        "list": "pm2 list",
        "stop": "pm2 stop " + pkg.name,
        "log": "pm2 log " + pkg.name,
        "flush": "pm2 flush",
        "delete": "pm2 delete " + pkg.name
    }
    return JSON.stringify(package, null, "\t");
});
console.log("编译完成!");
