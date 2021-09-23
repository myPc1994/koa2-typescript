import {Context, Next} from 'koa';
import Router from 'koa-router';
import {EResponseType, IReturnInfo, ResponseBeautifier} from "../utils/ResponseBeautifier";
import {NucleicAcidCtrl} from "../db/controller/NucleicAcidCtrl";
import {IMulterContext, IMulterUtil} from "../core/CpcInterface";
import {CluesMopaiCtrl} from "../db/controller/CluesMopaiCtrl";
import {MulterUtil} from "../utils/MulterUtil";
import {JsUtil} from "../utils/JsUtil";
import {Excel2dbFormatUtil} from "../utils/Excel2dbFormatUtil";
import path from 'path';
import moment from 'moment';
import {KeyAreaCtrl} from "../db/controller/KeyAreaCtrl";
import {SceneDirectoryCtrl} from "../db/controller/SceneDirectoryCtrl";

const usersRouter = new Router({
    prefix: '/safety'
});

// region 核酸大数据
/**
 * @api {get} /safety/getStatistics 获取核酸大数据的最新统计信息
 * @apiGroup 核酸大数据
 * @apiParam  {String} [county] 区县名称，默认：全市
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {Number} data.updateTime 最后更新时间
 * @apiSuccess (200) {Number} data.num 当前检测
 * @apiSuccess (200) {Object} data.preDayNum  前一天的检测
 * @apiSuccess (200) {Object} data.preDay.updateTime  前一天的统计信息-最后更新时间
 * @apiSuccess (200) {Object} data.countyMap 各区县统计信息
 * @apiSuccess (200) {Object} data.countyMap.num 各区县统计信息-检测累计
 * @apiSuccess (200) {Object} data.countyMap.preDayNum 各区县统计信息-前一天的检测
 * @apiSuccess (200) {Array} data.totalTrend  累计趋势
 * @apiSuccess (200) {Array} data.totalTrend.time  累计趋势-时间节点
 * @apiSuccess (200) {Array} data.totalTrend.data  累计趋势-数据
 * @apiSuccess (200) {Array} data.totalTrend.data.num  当天
 * @apiSuccess (200) {Array} data.totalTrend.data.countNum  累计趋势
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "21/09/16 23:59",
        "num": 700142,
        "preDayNum": 268093,
        "countyMap": {
            "鼓楼区": {
                "num": 109346,
                "preDayNum": 38938
            }
        },
        "totalTrend": [
            {
                "time": "21/09/15",
                "data": {
                    "num": 432049,
                    "countNum": 432049
                }
            }
        ]
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.get('/getStatistics', async (ctx: Context, next: Next) => {
    const {county} = ctx.request.query;
    const res: IReturnInfo = await NucleicAcidCtrl.instance.getStatistics(county as any);
    ResponseBeautifier.response(ctx, res);
})

/**
 * @api {get} /safety/getDataByRang 获取指定区间的统计信息
 * @apiGroup 核酸大数据
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
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError)
    }
    const data: IReturnInfo = await NucleicAcidCtrl.instance.getDataByRang(st as any, et as any, county as any);
    ResponseBeautifier.response(ctx, data);
});

/**
 * @api {post} /safety/addExcel2NucleicAcid 导入excel格式的核酸大数据
 * @apiGroup 核酸大数据
 * @apiParam  {String} password  秘钥
 * @apiParam  {File} file     excel文件
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.count 入库数据总数
 * @apiSuccess (200) {Number} data.abnormalData 异常数据信息
 * @apiSuccessExample {json} Success-Response:
 {
        "code": 200,
        "message": "入库成功",
        "data": {
            "count": 65,
            "abnormalData": []
        }
    }
 * @apiVersion 1.0.0
 */
usersRouter.post('/addExcel2NucleicAcid', async (ctx: Context, next: Next) => {
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
        const formatData = Excel2dbFormatUtil.general("核酸统计", (file as any).path);
        if (formatData.type !== EResponseType.success) {
            return ResponseBeautifier.response(ctx, formatData);
        }
        const {normalData, abnormalData} = formatData.data;
        const data = await NucleicAcidCtrl.instance.saveOrFilterSame2(["county", "updateTime", "No"], normalData);
        return ResponseBeautifier.success(ctx, {count: data.length, abnormalData}, "入库成功");
    }).catch((error: any) => {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error);
    });
})
//endregion
// region 摸排
/**
 * @api {get} /safety/moPaiStats 获取摸排的最新统计信息
 * @apiGroup 摸排
 * @apiParam  {String} [county] 区县名称，默认：全市
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {Number} data.updateTime 最后更新时间
 * @apiSuccess (200) {Number} data.receivingNum 接收人数
 * @apiSuccess (200) {Number} data.haveCheck 已核查
 * @apiSuccess (200) {Number} data.haveCheckCent 已核查(百分比)
 * @apiSuccess (200) {Number} data.notCheck 未核查
 * @apiSuccess (200) {Number} data.verifyNum 核实人数(有效)
 * @apiSuccess (200) {Number} data.countyMap 区县信息
 * @apiSuccess (200) {Number} data.countyMap.county 区县
 * @apiSuccess (200) {Number} data.countyMap.receivingNum 接收人数
 * @apiSuccess (200) {Number} data.countyMap.haveCheck 已核查
 * @apiSuccess (200) {Number} data.countyMap.notCheck 未核查
 * @apiSuccess (200) {Number} data.countyMap.updateTime 最后更新时间
 * @apiSuccess (200) {Number} data.countyMap.verifyNum 核实人数(有效)
 * @apiSuccess (200) {Number} data.countyMap.invalidCombin 无效合计
 * @apiSuccess (200) {Number} data.countyMap.duplicateData 重复数据
 * @apiSuccess (200) {Number} data.countyMap.notToAffectedArea 未到疫区
 * @apiSuccess (200) {Number} data.countyMap.infoNotComplete 信息不全
 * @apiSuccess (200) {Number} data.countyMap.outProvinceNum 在省外总数
 * @apiSuccess (200) {Number} data.countyMap.inProvinceNum 在省内总数
 * @apiSuccess (200) {Number} data.countyMap.highRisk 高风险来闽
 * @apiSuccess (200) {Number} data.countyMap.middleRisk 中风险来闽
 * @apiSuccess (200) {Number} data.countyMap.lowRisk 低风险来闽
 * @apiSuccess (200) {Number} data.countyMap.haveCheckCent 已核查(百分比)
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "21/09/15 14:00",
        "receivingNum": 347646,
        "haveCheck": 176912,
        "haveCheckCent": "50.89%",
        "notCheck": 170734,
        "verifyNum": 108269,
        "countyMap": [
            {
                "county": "鼓楼区",
                "receivingNum": 45592,
                "haveCheck": 25163,
                "notCheck": 20429,
                "updateTime": 1631685600000,
                "verifyNum": 16448,
                "invalidCombin": 7516,
                "duplicateData": 2765,
                "notToAffectedArea": 987,
                "infoNotComplete": 3764,
                "outProvinceNum": 2829,
                "inProvinceNum": 13619,
                "highRisk": 607,
                "middleRisk": 226,
                "lowRisk": 12786,
                "createTime": "1631763072454",
                "haveCheckCent": "55.19%"
            }
        ]
     }
    }
 * @apiVersion 1.0.0
 */
usersRouter.get('/moPaiStats', async (ctx: Context, next: Next) => {
    const {county} = ctx.request.query;
    const res:IReturnInfo =  await CluesMopaiCtrl.instance.moPaiStats(county as any);
    ResponseBeautifier.response(ctx,res);
})
/**
 * @api {get} /safety/moPaiStatsTrend 获取摸排的趋势图
 * @apiGroup 摸排
 * @apiParam  {String} [county] 区县名称，默认：全市
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {Number} data.totalTrend 累计趋势图
 * @apiSuccess (200) {Number} data.totalTrend.time 时间
 * @apiSuccess (200) {Number} data.totalTrend.data 数据
 * @apiSuccess (200) {Number} data.totalTrend.data.receivingNum 接收人数
 * @apiSuccess (200) {Number} data.totalTrend.data.verifyNum 核实人数(有效)
 * @apiSuccess (200) {Number} data.totalTrend.data.inProvinceNum 在省内总数
 * @apiSuccess (200) {Number} data.totalTrend.data.highRisk 高风险来闽
 * @apiSuccess (200) {Number} data.totalTrend.data.middleRisk 中风险来闽
 * @apiSuccess (200) {Number} data.totalTrend.data.lowRisk 低风险来闽
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "totalTrend": [
            {
                "time": "21/09/15",
                "data": {
                    "receivingNum": 11111,
                    "verifyNum": 199586,
                    "inProvinceNum": 159517,
                    "highRisk": 8949,
                    "middleRisk": 6898,
                    "lowRisk": 143670
                }
            }
        ]
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.get('/moPaiStatsTrend', async (ctx: Context, next: Next) => {
    const {county} = ctx.request.query;
    const res:IReturnInfo =  await CluesMopaiCtrl.instance.moPaiStatsTrend(county as any);
    ResponseBeautifier.response(ctx,res);
})
/**
 * @api {post} /safety/addExcel2MoPai 导入excel格式的摸排数据
 * @apiGroup 摸排
 * @apiParam  {String} password  秘钥
 * @apiParam  {File} file     excel文件
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.count 入库数据总数
 * @apiSuccess (200) {Number} data.abnormalData 异常数据信息
 * @apiSuccessExample {json} Success-Response:
 {
        "code": 200,
        "message": "入库成功",
        "data": {
            "count": 65,
            "abnormalData": []
        }
    }
 * @apiVersion 1.0.0
 */
usersRouter.post('/addExcel2MoPai', async (ctx: Context, next: Next) => {
    const config: IMulterUtil = {
        suffixs: [".xlsx", ".xls"],
        path: path.resolve(__dirname, `../../public/excels/mopai`),
        filename: function (req: any, file: any, cb: Function) {
            const name = moment().format("YYYY_YY_MM_DD_HH_mm") + JsUtil.getType(file.originalname);
            cb(null, name)
        }
    }
    return MulterUtil.getMulter("moPai", ctx, next, config).then(async () => {
        const {file, body} = (ctx as IMulterContext).req;
        if (!file) {
            return ResponseBeautifier.fail(ctx, EResponseType.parameterError, "缺少参数file");
        }
        const formatData = Excel2dbFormatUtil.general("线索摸排", (file as any).path);
        if (formatData.type !== EResponseType.success) {
            return ResponseBeautifier.response(ctx, formatData);
        }
        const {normalData, abnormalData} = formatData.data;
        const data = await CluesMopaiCtrl.instance.saveOrFilterSame2(["county", "updateTime"], normalData);
        return ResponseBeautifier.success(ctx, {count: data.length, abnormalData}, "入库成功");
    }).catch((error: any) => {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error);
    });
})
//endregion
// region 时空伴随-重点区域
/**
 * @api {get} /safety/keyAreaStats 获取重点区域的最新统计信息
 * @apiGroup 时空伴随-重点区域
 * @apiParam  {String} [county] 区县名称，默认：全市
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {Number} data.updateTime 最后更新时间
 * @apiSuccess (200) {Number} data.receivingNum 接收人数
 * @apiSuccess (200) {Number} data.haveCheck 已核查
 * @apiSuccess (200) {Number} data.notCheck 未核查
 * @apiSuccess (200) {Number} data.countyMap 区县信息
 * @apiSuccess (200) {Number} data.countyMap.county
 * @apiSuccess (200) {Number} data.countyMap.receivingNum 接收人数
 * @apiSuccess (200) {Number} data.countyMap.haveCheck 已核查
 * @apiSuccess (200) {Number} data.countyMap.notCheck 未核查
 * @apiSuccess (200) {Number} data.countyMap.notCheck24H 超24小时未核查
 * @apiSuccess (200) {Number} data.countyMap.updateTime 更新时间
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": {
        "updateTime": "21/09/16 08:00",
        "receivingNum": 20679,
        "haveCheck": 19125,
        "notCheck": 1554,
        "notCheck24H": 1,
        "countyMap": [
            {
                "county": "鼓楼区",
                "receivingNum": 2138,
                "haveCheck": 2114,
                "notCheck": 24,
                "notCheck24H": 0,
                "updateTime": 1631750400000
            }
        ]
    }
}
 * @apiVersion 1.0.0
 */
usersRouter.get('/keyAreaStats', async (ctx: Context, next: Next) => {
    const {county} = ctx.request.query;
    const res:IReturnInfo = await KeyAreaCtrl.instance.keyAreaStats(county as any);
    ResponseBeautifier.response(ctx,res);
})
/**
 * @api {post} /safety/addExcel2KeyArea 导入excel格式的数据到时空伴随-重点区域
 * @apiGroup 时空伴随-重点区域
 * @apiParam  {String} password  秘钥
 * @apiParam  {File} file     excel文件
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.count 入库数据总数
 * @apiSuccess (200) {Number} data.abnormalData 异常数据信息
 * @apiSuccessExample {json} Success-Response:
 {
        "code": 200,
        "message": "入库成功",
        "data": {
            "count": 65,
            "abnormalData": []
        }
    }
 * @apiVersion 1.0.0
 */
usersRouter.post('/addExcel2KeyArea', async (ctx: Context, next: Next) => {
    const config: IMulterUtil = {
        suffixs: [".xlsx", ".xls"],
        path: path.resolve(__dirname, `../../public/excels/keyArea`),
        filename: function (req: any, file: any, cb: Function) {
            const name = moment().format("YYYY_YY_MM_DD_HH_mm") + JsUtil.getType(file.originalname);
            cb(null, name)
        }
    }
    return MulterUtil.getMulter("keyArea", ctx, next, config).then(async () => {
        const {file, body} = (ctx as IMulterContext).req;
        if (!file) {
            return ResponseBeautifier.fail(ctx, EResponseType.parameterError, "缺少参数file");
        }
        const formatData = Excel2dbFormatUtil.general("重点区域及时空伴随", (file as any).path);
        if (formatData.type !== EResponseType.success) {
            return ResponseBeautifier.response(ctx, formatData);
        }
        const {normalData, abnormalData} = formatData.data;
        const data = await KeyAreaCtrl.instance.saveOrFilterSame2(["county", "updateTime"], normalData);
        return ResponseBeautifier.success(ctx, {count: data.length, abnormalData}, "入库成功");
    }).catch((error: any) => {
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error);
    });
})
//endregion
// region 场景菜单目录树
/**
 * @api {get} /safety/getSceneDirectory 获取 场景菜单目录树
 * @apiGroup  场景菜单目录树
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {Number} data.name 显示名称
 * @apiSuccess (200) {Number} data.active 是否是初始化场景
 * @apiSuccess (200) {Number} data.value 场景名称
 * @apiSuccess (200) {Number} data.image base64图片
 * @apiSuccessExample {json} Success-Response:
 {
    "code": 200,
    "message": "操作成功!",
    "data": [
       data: {
            "name": "福清市核酸检测点（共513个）",
            "active": false,
            "value": "核酸检测机构分布（福清市）",
            "image": "base64图片",
            "createTime": "1631949695080",
        },
        GISURL:"xxx"
    ]
}
 * @apiVersion 1.0.0
 */
usersRouter.get('/getSceneDirectory', async (ctx: Context, next: Next) => {
    const data = await SceneDirectoryCtrl.instance.find(undefined, {__v: 0, createTime: 0, _id: 0});
    // 后期会换掉，就写死，不入库了
    const GISURL = "http://leader.view.cityworks.cn:39360/city-rainbow/view/?id=3ab7a67111914aa29f770fea273c0ea3";
    ResponseBeautifier.success(ctx, {data, GISURL})
})
/**
 * @api {post} /safety/addExcel2SceneDirectory 导入excel格式的数据到场景目录树
 * @apiGroup  场景菜单目录树
 * @apiParam  {String} password  秘钥
 * @apiParam  {String} initSceneName  初始化场景名称
 * @apiParam  {File} file     excel文件
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 信息
 * @apiSuccess (200) {String} data.count 入库数据总数
 * @apiSuccess (200) {Number} data.abnormalData 异常数据信息
 * @apiSuccessExample {json} Success-Response:
 {
        "code": 200,
        "message": "入库成功",
        "data": {
            "count": 65,
            "abnormalData": []
        }
    }
 * @apiVersion 1.0.0
 */
usersRouter.post('/addExcel2SceneDirectory', async (ctx: Context, next: Next) => {
    const config: IMulterUtil = {
        suffixs: [".xlsx", ".xls"],
        path: path.resolve(__dirname, `../../public/excels/sceneDirectory`),
        filename: function (req: any, file: any, cb: Function) {
            const name = moment().format("YYYY_YY_MM_DD_HH_mm") + JsUtil.getType(file.originalname);
            cb(null, name)
        }
    }
    return MulterUtil.getMulter("sceneDirectory", ctx, next, config).then(async () => {
        const {file, body} = (ctx as IMulterContext).req;
        if (!file) {
            return ResponseBeautifier.fail(ctx, EResponseType.parameterError, "缺少参数file");
        }
        const formatData = Excel2dbFormatUtil.general("场景目录树", (file as any).path);
        if (formatData.type !== EResponseType.success) {
            return ResponseBeautifier.response(ctx, formatData);
        }
        const {normalData, abnormalData} = formatData.data;
        for (let item of normalData) {
            item.active = item.value === body.initSceneName
        }
        await SceneDirectoryCtrl.instance.remove();// 清空表
        const data = await SceneDirectoryCtrl.instance.saves(normalData);
        return ResponseBeautifier.success(ctx, {count: data.length, abnormalData}, "入库成功");
    }).catch((error: any) => {
        console.log(error);
        return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error);
    });
})

//endregion
export default usersRouter;
