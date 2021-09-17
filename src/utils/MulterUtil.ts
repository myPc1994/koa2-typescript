import {IKeyValue, IMulterUtil} from "../core/CpcInterface";
import {FileUtil} from "./FileUtil";
import {JsUtil} from "./JsUtil";
import fs from 'fs';
import {Context, Next} from "koa";
import multer from 'koa-multer';

export class MulterUtil {
    public static getMulter(key: string, ctx: Context, next: Next, config: IMulterUtil) {
        let multerU = MulterUtil.keyMapMulter[key];
        if (multerU) {
            return multerU(ctx, next);
        }
        const {path, filename, suffixs} = config;
        const _basePath = typeof path === "function" ? path() : path;
        // Excel接收数据规则
        multerU = multer({
            storage: multer.diskStorage({
                async destination(req: any, res: any, cb: any) {
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
                filename
            }),
            fileFilter: function (req: any, file: multer.File, cb: any) {
                const type = JsUtil.getType(file.originalname);
                if (suffixs.indexOf(type) === -1) {
                    cb("不是excel文件")
                } else {
                    cb(null, true);
                }
            }
        }).single('file');
        MulterUtil.keyMapMulter[key] = multerU;
        return multerU(ctx, next);
    }
    private static keyMapMulter: IKeyValue = {};
}
