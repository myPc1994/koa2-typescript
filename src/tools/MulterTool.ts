import {IKeyValue, IMulterUtil} from "../core/CpcInterface";
import fs from 'fs';
import {Context, Next} from "koa";
import multer from 'koa-multer';
import {FileTool} from "./FileTool";
import {JsTool} from "./JsTool";

/**
 * 文件上传处理工具类
 */
export class MulterTool {
    public static getMulter(key: string, ctx: Context, next: Next, config: IMulterUtil) {
        let multerU = MulterTool.keyMapMulter[key];
        if (multerU) {
            return multerU(ctx, next);
        }
        const {path, filename, suffixs} = config;
        const _basePath = typeof path === "function" ? path() : path;
        // Excel接收数据规则
        multerU = multer({
            storage: multer.diskStorage({
                async destination(req: any, res: any, cb: any) {
                    const {password} = req.body;
                    if (password !== "ascs.123") {
                        return cb("password秘钥错误!");
                    }
                    // 目录不存在，创建
                    if (!fs.existsSync(_basePath)) {
                        FileTool.mkdirs(_basePath, (err: any) => {
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
                if (!suffixs) {
                    return cb(null, true);
                }
                const type = JsTool.getType(file.originalname);
                if (suffixs.indexOf(type) === -1) {
                    cb("该类型文件不被支持!")
                } else {
                    cb(null, true);
                }
            }
        }).single('file');
        MulterTool.keyMapMulter[key] = multerU;
        return multerU(ctx, next);
    }

    private static keyMapMulter: IKeyValue = {};
}
