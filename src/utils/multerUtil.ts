import multer from 'koa-multer';
import path from 'path';
import fs from 'fs';
import {FileUtil} from "./FileUtil";
function getAPKFilePath(id="",one="",two=""){
    return path.resolve(__dirname, `../../static/porjectZips/${id}/${one}/${two}`);
}
// apk接收数据规则
const uploadAPKStorage = multer.diskStorage({
    destination(req:any, res:any, cb:any) {
        const {id} = req.query;
        const _basePath = getAPKFilePath(id);
        // 目录不存在，创建
        if (!fs.existsSync(_basePath)) {
            FileUtil.mkdirs(_basePath, (err:any) => {
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
        const curTime = new Date().getTime();
        cb(null, `${curTime}.zip`)
    }
});
const uploadAPKileFilter = function (req:any, file:any, cb:any) {
    if(!file.originalname.endsWith(".apk")){
        cb("不是apk文件")
    }else{
        cb(null,true);
    }
}
const uploadAPK = multer({storage: uploadAPKStorage, fileFilter: uploadAPKileFilter}).single('file');

export const multerUtil = {
    uploadAPK
}
