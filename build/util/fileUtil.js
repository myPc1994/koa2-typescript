const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const execSync = require('child_process').execSync;

function loopCopy(target, source, regexp) {
    const exit = fs.existsSync(target);
    if (!exit) {
        console.error("拷贝的目标不存在", target);
        return;
    }
    const stats = fs.statSync(target);
    if (!stats) {
        console.error("无法读取stats!");
        return;
    }
    if (stats.isFile()) {
        if (!regexp || (regexp && regexp.test(target))) {
            // 拷贝文件
            fs.writeFileSync(source, fs.readFileSync(target));
        }
        return;
    } else if (stats.isDirectory()) {
        //目标文件夹是否存在，不存在则新建
        if (!fs.existsSync(source)) {
            mkdirs(source);
        }
        // 递归读取文件夹中的内容
        fs.readdirSync(target).forEach(function (path) {
            const _target = target + '/' + path;
            const _source = source + '/' + path;
            loopCopy(_target, _source, regexp);
        });
    }
    //目标文件夹是否存在，不存在则新建
    if (!fs.existsSync(source)) {
        mkdirs(source);
    }
}

function mkdirs(dirpath) {
    if (!fs.existsSync(path.dirname(dirpath))) {
        mkdirs(path.dirname(dirpath));
    }
    fs.mkdirSync(dirpath);
}

//拷贝所有
exports.copyAll = function (target, source, regexp, cb) {
    loopCopy(target, source, regexp)
    cb && cb();
};
//拷贝文件
exports.copyFile = function (target, source) {
    const exit = fs.existsSync(target);
    if (!exit) {
        console.error("拷贝的目标不存在", target);
        return;
    }
    const stats = fs.statSync(target);
    if (!stats) {
        console.error("无法读取stats!");
        return;
    }
    if (stats.isFile()) {
        //目标文件夹是否存在，不存在则新建
        const dir = source.substr(0, source.lastIndexOf("\\"));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);

        }
        // 拷贝文件
        fs.writeFileSync(source, fs.readFileSync(target));
    } else {
        console.error("拷贝失败,不是文件");
    }
};
//清空所有
exports.clearAll = function (folder,isDeleteDir) {
    console.warn("清空文件夹", folder);
    const exit = fs.existsSync(folder);
    if (exit) {
        fse.emptyDirSync(folder);
        if(isDeleteDir){
            fse.removeSync(folder);
        }
    }
};
//文件替换
exports.replace = function (file, cb) {
    const exit = fs.existsSync(file);
    if (!exit) {
        console.error("替换的目标不存在", file);
        return;
    }
    const stats = fs.statSync(file);
    if (!stats) {
        console.error("无法读取stats!");
        return;
    }
    if (stats.isFile()) {
        const data = fs.readFileSync(file)
        fs.writeFileSync(file, cb(data));
    } else {
        console.error("替换失败,不是文件");
    }
}
//拷贝，同时替换掉修改后的内容
exports.copyReplace = function (target, source, cb) {
    const exit = fs.existsSync(target);
    if (!exit) {
        console.error("替换的目标不存在", target);
        return;
    }
    const stats = fs.statSync(target);
    if (!stats) {
        console.error("target无法读取stats!");
        return;
    }
    if (stats.isFile()) {
        //目标文件夹是否存在，不存在则新建
        const dir = source.substr(0, source.lastIndexOf("\\"));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const data = fs.readFileSync(target)
        fs.writeFileSync(source, cb(data));
    } else {
        console.error("替换失败,target不是文件");
    }
}

//路径下的文件加密
function encryptionPath(target, source,regexp,cb){
  const exit = fs.existsSync(target);
  if (!exit) {
    console.error("拷贝的目标不存在", target);
    return;
  }
  const stats = fs.statSync(target);
  if (!stats) {
    console.error("无法读取stats!");
    return;
  }
  if (stats.isFile()) {
    if (!regexp || (regexp && regexp.test(target))) {
      // 文件加密
      encryptionFile(target,source)
    }
    return;
  } else if (stats.isDirectory()) {
    //目标文件夹是否存在，不存在则新建
    if (!fs.existsSync(source)) {
      mkdirs(source);
    }
    // 递归读取文件夹中的内容
    fs.readdirSync(target).forEach(function (path) {
      const _target = target + '/' + path;
      const _source = source + '/' + path;
      encryptionPath(_target, _source, regexp,cb);
    });
  }
  //目标文件夹是否存在，不存在则新建
  if (!fs.existsSync(source)) {
    mkdirs(source);
  }
}
exports.encryptionPath = encryptionPath;
let index = 0;
//代码文件加密
function encryptionFile(target, source) {
  try {
    execSync(`javascript-obfuscator ${target}  --output ${source}`);
    console.log(`文件:${target}------------加密成功`);
  }catch (error) {
    global.encryptionError[target] = error;
  }
}
exports.encryptionFile = encryptionFile;
