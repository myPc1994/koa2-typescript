import {Context, Next} from 'koa';
import Joi from 'joi'
import {IMulterContext, IMulterUtil} from "../../core/CpcInterface";
import {ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {MulterUtil} from "../../utils/MulterUtil";
import path from "path";
import moment from "moment";
import {JsUtil} from "../../utils/JsUtil";

export const IndexJoi = {
    login: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required(),
    }),
    register: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    }),
    addUserRoles: Joi.object({
        userId: Joi.string().required(),
        roles: Joi.array().required(),
    })
}

export class IndexCtrl {
    public static async addExcel2NucleicAcid(ctx: Context, next: Next) {
        const config: IMulterUtil = {
            suffixs: [".xlsx", ".xls"],
            path: path.resolve(__dirname, `../../public/excels/nucleate`),
            filename: function (req: any, file: any, cb: Function) {
                const name = moment().format("YYYY_YY_MM_DD_HH_mm") + JsUtil.getType(file.originalname);
                cb(null, name)
            }
        }
        return MulterUtil.getMulter("nucleate", ctx, next, config).then(async () => {
            const {file, body} = (ctx as IMulterContext).req;
            if (!file) {
                return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.parameterError, "缺少参数file")
            }
            return ResponseBeautifier.success(ctx, null);
        }).catch((error: any) => {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.parameterError, "附件上传失败!", error);
        });
    }

}