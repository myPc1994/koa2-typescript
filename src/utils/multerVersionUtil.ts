import multer from 'koa-multer';
import path from 'path';
import fs from 'fs';

import {FileUtil} from "./FileUtil";
import {VersionUpgradeCtrl} from "../db/controller/VersionUpgradeCtrl";
import {JsUtil} from "./JsUtil";

function getAPKFilePath(type: string, version_1: number, version_2: number, version_3: number) {
    return path.resolve(__dirname, `../../public/package/${type}/${version_1}/${version_2}/${version_3}`);
}

function getAPKUrlPath(data: any) {
    const {type, version_1, version_2, version_3} = data;
    return `/public/package/${type}/${version_1}/${version_2}/${version_3}/skMap.apk`;
}

// apk接收数据规则
const uploadAPKStorage = multer.diskStorage({
    async destination(req: any, res: any, cb: any) {
        const {type, version_1, version_2, version_3} = req.body;
        if (!type) {
            return cb("参数type不能缺失");
        }
        if (!version_1) {
            return cb("参数version_1不能缺失");
        }
        if (!version_2) {
            return cb("参数version_2不能缺失");
        }
        if (!version_3) {
            return cb("参数version_3不能缺失");
        }
        const data: any = await VersionUpgradeCtrl.instance.findOne({type}).sort({createTime: -1}).limit(1);
        if (!JsUtil.versionCheck(req.body, data)) {
            return cb(`版本号一定要高于最新版本:v${data.version_1}.${data.version_2}.${data.version_3}`);
        }
        const _basePath = getAPKFilePath(type, version_1, version_2, version_3);
        // 目录不存在，创建
        if (!fs.existsSync(_basePath)) {
            FileUtil.mkdirs(_basePath, (err: any) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, _basePath);
                }
            });
        } else {
            cb(null, _basePath);
        }
    },
    filename(req, file, cb) {
        cb(null, "skMap.apk")
    }
});
const uploadAPKileFilter = function (req: any, file: multer.File, cb: any) {
    if (!file.originalname.endsWith(".apk")) {
        cb("不是apk文件")
    } else {
        cb(null, true);
    }
}
const uploadAPK = multer({storage: uploadAPKStorage, fileFilter: uploadAPKileFilter}).single('file');

export const multerVersionUtil = {
    uploadAPK,
    getAPKUrlPath
}
