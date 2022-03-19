const path = require("path");
const apidoc = require("apidoc");
const fs = require('fs');
const src = path.resolve(__dirname, 'src/routes/');
const dest = path.resolve(__dirname, 'public/apidoc/');
const doc = apidoc.createDoc({src, dest})
if (typeof doc !== 'boolean') {
    replaceFile(dest + "/vendor/webfontloader.js","//fonts.googleapis.com/css","");
    console.log("成功生成文档!");
    const config = require("./env/development.js");
    console.log("访问地址：http://127.0.0.1:"+config.port+"/public/apidoc/index.html")
}
function replaceFile(filePath, sourceRegx, targetStr) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return err;
        }
        let str = data.toString();
        str = str.replace(sourceRegx, targetStr);
        fs.writeFile(filePath, str, function (err) {
            if (err) return err;
        });
    });
}