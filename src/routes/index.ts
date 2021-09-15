import {Context, Next} from 'koa';
import Router from 'koa-router';
import {VersionUpgrade} from "../db/controller/VersionUpgrade";
import {ResponseBeautifier, ResponseInfo} from "../utils/ResponseBeautifier";
import {multerVersionUtil} from "../utils/multerVersionUtil";
import {IMulterContext} from "../core/CpcInterface";

const indexRouter = new Router();
/**
 * @api {post} /addVersion 上传新的版本
 * @apiGroup Version
 * @apiParam  {String} type      类型:[android,ios,pc]
 * @apiParam  {String} title          更新标题
 * @apiParam  {String} description     更新版本描述
 * @apiParam  {String} version_1     第一级：重大重构
 * @apiParam  {String} version_2     第二级：重大功能改进
 * @apiParam  {String} version_3     第三极：小升级或者BUG修复
 * @apiParam  {Boolean} hasUpgrade     是否强制升级
 * @apiParam  {File} file     apk文件
 * @apiSuccess (200) {Number} status 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.url 下载的地址（相对路径）
 * @apiSuccess (200) {Number} data.version_1 第一级：重大重构
 * @apiSuccess (200) {Number} data.version_2 第二级：重大功能改进
 * @apiSuccess (200) {Number} data.version_3  第三极：小升级或者BUG修复
 * @apiSuccess (200) {String} data.type 类型:[android,ios,pc]
 * @apiSuccess (200) {Boolean} data.hasUpgrade  是否强制升级
 * @apiSuccess (200) {String} data.title  更新的标题
 * @apiSuccess (200) {String} data.description 更新版本描述
 * @apiSuccess (200) {Number} data.createTime  创建时间(时间戳)
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "version_1": "0",
        "version_2": "0",
        "version_3": "0",
        "type": "android",
        "title": "标题",
        "hasUpgrade": false,
        "description": "描述",
        "_id": "613f69fb7f80cb827ca8fbaf",
        "createTime": "1631545851720",
        "__v": 0,
        "url": "/public/apk/android/1/1/5/skMap.apk"
    }
}
 * @apiVersion 1.0.0
 */
indexRouter.post('/addVersion', (ctx: Context, next: Next) => {
    return multerVersionUtil.uploadAPK(ctx, next).then(async () => {
        const {file, body} = (ctx as IMulterContext).req;
        if (!file) {
            return ResponseBeautifier.fail(ctx, ResponseInfo.parameterError, "缺少参数file");
        }
        //  保存到数据库
        const {title, description, type, version_1, version_2, version_3} = body;
        const data = await VersionUpgrade.instance.save({
            title,
            description,
            type,
            version_1,
            version_2,
            version_3
        });
        return ResponseBeautifier.success(ctx, data);
    }).catch((error: any) => {
        return ResponseBeautifier.fail(ctx, ResponseInfo.parameterError, error);
    });
})
/**
 * @api {get} /latestVersion 获取最新的版本
 * @apiGroup Version
 * @apiParam  {String} type      类型:[android,ios,pc]
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.url 下载的地址（相对路径）
 * @apiSuccess (200) {Number} data.version_1 第一级：重大重构
 * @apiSuccess (200) {Number} data.version_2 第二级：重大功能改进
 * @apiSuccess (200) {Number} data.version_3  第三极：小升级或者BUG修复
 * @apiSuccess (200) {String} data.type 类型:[android,ios,pc]
 * @apiSuccess (200) {Boolean} data.hasUpgrade  是否强制升级
 * @apiSuccess (200) {String} data.title  更新的标题
 * @apiSuccess (200) {String} data.description 更新版本描述
 * @apiSuccess (200) {Number} data.createTime  创建时间(时间戳)
 * @apiSuccessExample {json} Success-Response:
 *  {
        "code": 200,
        "message": "操作成功!",
        "data": {
            "version_1": "0",
            "version_2": "0",
            "version_3": "1",
            "type": "android",
            "title": "升级标题",
            "description": "升级内容",
            "createTime": "1631545851720",
            "__v": 0
        }
    }
 * @apiVersion 1.0.0
 */
indexRouter.get('/latestVersion', async (ctx: Context, next: Next) => {
    const type = ctx.query.type;
    const data: any = (await VersionUpgrade.instance.findOne({type}).sort({createTime: -1}).limit(1))?.toJSON();
    if (data) {
        data.url = multerVersionUtil.getAPKUrlPath(data);
    }
    ResponseBeautifier.success(ctx, data);
})


export default indexRouter;
