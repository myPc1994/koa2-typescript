import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";
import {Context, Next} from 'koa';
import moment from 'moment';
import {ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {JsUtil} from "../../utils/JsUtil";

export class CluesMopaiCtrl extends BaseDb {
    public static instance: CluesMopaiCtrl = new CluesMopaiCtrl();

    constructor() {
        super(ETables.cluesMoPai);
    }

    public async moPaiStats(ctx: Context, next: Next, county = "全市") {
        let allData: any = null;
        const newData: any = await this.model.findOne(undefined, {
            updateTime: 1,
            _id: 0
        }).sort({"updateTime": -1}).exec();
        if (!newData) {
            return ResponseBeautifier.fail(ctx, ResponseInfo.internalServerError, "数据库没有数据!");
        }
        if (county === "全市") {
            allData = (await this.model.find({updateTime: newData.updateTime}, {
                _id: 0,
                __v: 0
            }).sort({"updateTime": 1}));
        } else {
            allData = await this.model.find({county, updateTime: newData.updateTime}).sort({"updateTime": 1});
        }
        if (allData.length === 0) {
            return ResponseBeautifier.fail(ctx, ResponseInfo.internalServerError, "数据库没有数据!");
        }
        const updateTime = allData[allData.length - 1].updateTime;// 最新更新时间
        const result: any = {
            updateTime: moment(parseInt(updateTime, 10)).format("YY/MM/DD HH:mm"),
            receivingNum: 0,// 接收人数
            haveCheck: 0,// 已核查
            haveCheckCent: "0",// 已核查百分比
            notCheck: 0,// 未核查
            verifyNum: 0,// 核实人数(有效)
            countyMap: []// 各区县摸排情况
        };
        for (let item of allData) {
            result.receivingNum += item.receivingNum;
            result.haveCheck += item.haveCheck;
            result.notCheck += item.notCheck;
            result.verifyNum += item.verifyNum;
            const item1 = item.toJSON();
            item1.haveCheckCent = (item.haveCheck / (item.haveCheck + item.notCheck) * 100).toFixed(2) + "%";
            result.countyMap.push(item1);
        }
        result.haveCheckCent = (result.haveCheck / (result.haveCheck + result.notCheck) * 100).toFixed(2) + "%";
        ResponseBeautifier.success(ctx, result);
    }

    public async moPaiStatsTrend(ctx: Context, next: Next, county = "全市") {
        let allData: any = null;
        if (county === "全市") {
            allData = (await this.model.find({}, {_id: 0, __v: 0}).sort({"updateTime": 1}));
        } else {
            allData = await this.model.find({county}).sort({"updateTime": 1});
        }
        if (allData.length === 0) {
            return ResponseBeautifier.fail(ctx, ResponseInfo.internalServerError, "数据库没有数据!");
        }
        const result: any = {
            totalTrend: [],// 累计趋势图
        };
        const data: any = {};
        for (let item of allData) {
            const day: any = moment(parseInt(item.updateTime, 0)).format("YY/MM/DD");
            if (!data[day]) {
                data[day] = {};
            }
            if (!data[day][item.updateTime]) {
                data[day][item.updateTime] = {
                    verifyNum: 0,
                    receivingNum: 0,
                    inProvinceNum: 0,
                    highRisk: 0,
                    middleRisk: 0,
                    lowRisk: 0,
                }
            }
            data[day][item.updateTime].verifyNum += item.verifyNum;
            data[day][item.updateTime].receivingNum += item.receivingNum;
            data[day][item.updateTime].inProvinceNum += item.inProvinceNum;
            data[day][item.updateTime].highRisk += item.highRisk;
            data[day][item.updateTime].middleRisk += item.middleRisk;
            data[day][item.updateTime].lowRisk += item.lowRisk;
        }
        for (let time of Object.keys(data)) {
            const arr = JsUtil.timeObj2ArrSort(data[time]);
            const item  = arr[arr.length-1];
            item.time = time;
            result.totalTrend.push(item);
        }
        ResponseBeautifier.success(ctx, result);
    }
}
