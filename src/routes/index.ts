import {Context,Next} from 'koa';
import Router from 'koa-router';
import {VersionUpgrade} from "../db/controller/VersionUpgrade";
import {ResponseBeautifier, ResponseInfo} from "../utils/ResponseBeautifier";
import {multerUtil} from "../utils/multerUtil";

const indexRouter = new Router();

indexRouter.post('/addVersion', async (ctx: Context, next: Next) => {
    const {id} = ctx.query;
    if (!id) {
        ResponseBeautifier.fail(ctx,ResponseInfo.parameterError,"id不能为空");
    }
    // multerUtil.uploadAPK(req, res, async function (err) {
    //     if (err) {
    //         return _dataFormat.resSend(res, 403, "上传失败!", err);
    //     }
    //     if (!req.file) {
    //         return _dataFormat.resSend(res, 405, "找不到上传文件!");
    //     }
    //
    // });


    // const data =  await VersionUpgrade.instance.save({version_1:0,version_2:0,version_3:2,type:"android",title:"title",description:"test"})
    // ResponseBeautifier.success(ctx,data);
})

indexRouter.get('/latestVersion', async (ctx: Context, next: Next) => {
   const data = await VersionUpgrade.instance.findOne().sort({createTime:-1}).limit(1);
   ResponseBeautifier.success(ctx,data);
})


export default indexRouter;
