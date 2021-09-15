import {Context, Next} from 'koa';
import Router from 'koa-router';
import {ResponseBeautifier, ResponseInfo} from "../utils/ResponseBeautifier";
import {NucleicAcidCtrl} from "../db/controller/NucleicAcidCtrl";
import {excelFormat, uploadExcel} from "../utils/importExcelUtil";
import {multerVersionUtil} from "../utils/multerVersionUtil";
import {IMulterContext} from "../core/CpcInterface";
import {VersionUpgrade} from "../db/controller/VersionUpgrade";

const usersRouter = new Router({
    prefix: '/safety'
});

/**
 * @api {get} /safety/getStatistics 获取最新统计信息
 * @apiGroup safety
 * @apiParam  {String} [county] 区县名称，默认：全市
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {Number} data.updateTime 最后更新时间
 * @apiSuccess (200) {Number} data.everyDay 日常检测累计
 * @apiSuccess (200) {Number} data.allPeople 全民检测累计
 * @apiSuccess (200) {Object} data.preDay  前一天的统计信息
 * @apiSuccess (200) {Object} data.preDay.updateTime  前一天的统计信息-最后更新时间
 * @apiSuccess (200) {Object} data.preDay.everyDay  前一天的统计信息-日常检测
 * @apiSuccess (200) {Object} data.preDay.allPeople  前一天的统计信息-全民检测
 * @apiSuccess (200) {Object} data.preDay.countEveryDay  前一天的统计信息-日常检测累计
 * @apiSuccess (200) {Object} data.preDay.countAllPeople  前一天的统计信息-全民检测累计
 * @apiSuccess (200) {Object} data.countyMap 各区县统计信息
 * @apiSuccess (200) {Object} data.countyMap.everyDay 各区县统计信息-日常检测
 * @apiSuccess (200) {Object} data.countyMap.allPeople 各区县统计信息-全民检测
 * @apiSuccess (200) {Array} data.totalTrend  累计趋势
 * @apiSuccess (200) {Array} data.totalTrend.time  累计趋势-时间节点
 * @apiSuccess (200) {Array} data.totalTrend.data  累计趋势-数据
 * @apiSuccess (200) {Array} data.totalTrend.data.allPeople  累计趋势-全民检测
 * @apiSuccess (200) {Array} data.totalTrend.data.everyDay  累计趋势-日常检测
 * @apiSuccess (200) {Array} data.totalTrend.data.countEveryDay  累计趋势-日常检测累计
 * @apiSuccess (200) {Array} data.totalTrend.data.countAllPeople  累计趋势-全民检测累计
 * @apiSuccessExample {json} Success-Response:
 *  {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "1631721199",
        "everyDay": 35014,
        "allPeople": 42007,
        "preDay": {
            "updateTime": "1631721599",
            "everyDay": 10004,
            "allPeople": 12002
        },
        "countyMap": {
            "鼓楼区": {
                "everyDay": 15006,
                "allPeople": 18003,
                "countEveryDay": 18003,
                "countallPeople": 18003
            }
        },
        "totalTrend": [
             {
                "time": "2021-09-14",
                "data": {
                    "allPeople": 235040,
                    "everyDay": 111373,
                    "countAllPeople": 362407,
                    "countEveryDay": 296625
                }
            }
        ]
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.get('/getStatistics', async (ctx: Context, next: Next) => {
    const {county} = ctx.request.query;
    await NucleicAcidCtrl.instance.getStatistics(ctx, next,county as any);
})

/**
 * @api {get} /safety/getDataByRang 获取指定区间的统计信息
 * @apiGroup safety
 * @apiParam  {Number} st  起始时间（时间戳）
 * @apiParam  {Number} et  结束时间（时间戳）
 * @apiParam  {String} [county] 区县名称，默认：全市
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.updateTime 更新时间
 * @apiSuccess (200) {Number} data.everyDay 日常检测
 * @apiSuccess (200) {Number} data.allPeople 全民检测
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "1234567830",
        "everyDay": 15006,
        "allPeople": 18003
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.get('/getDataByRang', async (ctx: Context, next: Next) => {
    const {st, et, county} = ctx.request.query;
    if (!st || !et) {
        return ResponseBeautifier.fail(ctx, ResponseInfo.parameterError)
    }
    const data = await NucleicAcidCtrl.instance.getDataByRang(st as any, et as any, county as any);
    ResponseBeautifier.success(ctx, data);
});


/**
 * @api {post} /safety/addNucleicAcid 导入统计数据
 * @apiGroup safety
 * @apiParam  {String} [everyDay]  日常检测，默认为0
 * @apiParam  {String} [allPeople]  全民检测，默认为0
 * @apiParam  {String} updateTime 更新时间(时间戳)
 * @apiParam  {String} county 区县名称
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.updateTime 更新时间
 * @apiSuccess (200) {Number} data.everyDay 日常检测
 * @apiSuccess (200) {Number} data.allPeople 全民检测
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "1234567830",
        "everyDay": 15006,
        "allPeople": 18003
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.post('/addNucleicAcid', async (ctx: Context, next: Next) => {
    const {everyDay=0, allPeople=0, updateTime, county} = ctx.request.body;
    if (!updateTime || !county) {
        return ResponseBeautifier.fail(ctx, ResponseInfo.parameterError);
    }
    console.log(everyDay, allPeople, updateTime, county);
    const data = await NucleicAcidCtrl.instance.save({everyDay, allPeople, updateTime, county});
    ResponseBeautifier.success(ctx, data);
})
/**
 * @api {post} /safety/addExcel2NucleicAcid 导入excel格式的统计数据
 * @apiGroup safety
 * @apiParam  {File} file     excel文件
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.updateTime 更新时间
 * @apiSuccess (200) {Number} data.everyDay 日常检测
 * @apiSuccess (200) {Number} data.allPeople 全民检测
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "1234567830",
        "everyDay": 15006,
        "allPeople": 18003
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.post('/addExcel2NucleicAcid', async (ctx: Context, next: Next) => {
    return uploadExcel(ctx, next).then(async () => {
        const {file, body} = (ctx as IMulterContext).req;
        if (!file) {
            return ResponseBeautifier.fail(ctx, ResponseInfo.parameterError, "缺少参数file");
        }
        const arrItems = excelFormat((file as any).path);
        const data =  await NucleicAcidCtrl.instance.saves(arrItems);
        return ResponseBeautifier.success(ctx, data,"入库成功");
    }).catch((error: any) => {
        return ResponseBeautifier.fail(ctx, ResponseInfo.parameterError, error);
    });
})

export default usersRouter;
