import {Context, Next} from 'koa';
import Router from 'koa-router';
import {IMulterContext, IMulterUtil} from "../core/CpcInterface";
import {JsUtil} from "../utils/JsUtil";
import path from "path";
import moment from "moment";
import {MulterUtil} from "../utils/MulterUtil";
import {EResponseType, ResponseBeautifier} from "../utils/ResponseBeautifier";
import {Excel2dbFormatUtil} from "../utils/Excel2dbFormatUtil";

const indexRouter = new Router();
indexRouter.post('/addExcel2NucleicAcid', async (ctx: Context, next: Next) => {
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
            return ResponseBeautifier.fail(ctx, EResponseType.parameterError, "缺少参数file");
        }
        return ResponseBeautifier.success(ctx, null, "入库成功");
    }).catch((error: any) => {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error);
    });
})

export default indexRouter;
