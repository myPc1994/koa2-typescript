import multer from 'koa-multer';
import path from 'path';
import fs from 'fs';
import {FileUtil} from "./FileUtil";
import moment from 'moment';
import {JsUtil} from "./JsUtil";
import xlsx from "node-xlsx";

const excelType = [".xlsx", ".xls"];

function getFilePath() {
    return path.resolve(__dirname, `../../public/excels`);
}

// Excel接收数据规则
const uploadExcelStorage = multer.diskStorage({
    async destination(req: any, res: any, cb: any) {
        const _basePath = getFilePath();
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
        const name = moment().format("YYYY_MM_DD_HH_MM") + JsUtil.getType(file.originalname);
        cb(null, name)
    }
});
const uploadExcelileFilter = function (req: any, file: multer.File, cb: any) {
    console.log();
    const type = JsUtil.getType(file.originalname);
    if (excelType.indexOf(type) === -1) {
        cb("不是excel文件")
    } else {
        cb(null, true);
    }
}
export const uploadExcel = multer({storage: uploadExcelStorage, fileFilter: uploadExcelileFilter}).single('file');
export const excelFormat = function (path: string) {
    const obj = xlsx.parse(path);
    const result = [];
    for (const table of obj) {
        for (let index = 0; index < table.data.length; index++) {
            if (index <= 0) {
                continue;
            }
            const item = table.data[index];
            if(JsUtil.isEmpty(item)){
                result.push({
                    "updateTime": moment(item[0] as any).valueOf(),
                    "allPeople": item[1],
                    "everyDay": item[2],
                    "county": item[3]
                })
            }
        }
    }
    return result;
}
