import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";
import moment from 'moment';
import {EResponseType, IReturnInfo} from "../../utils/ResponseBeautifier";
import {JsUtil} from "../../utils/JsUtil";

/**
 * 核酸大数据
 */
export class NucleicAcidCtrl extends BaseDb {
    public static instance: NucleicAcidCtrl = new NucleicAcidCtrl();

    constructor() {
        super(ETables.nucleicAcid);
    }

    public async saveOrFilterSame2(fields: string[], arr: any[]) {
        const result = await this.saveOrFilterSame(fields, arr);
        this.dataMap = {};
        setTimeout(this.getStatistics.bind(this), 100);
        return result;
    }

    /**
     * 获取累计的统计数据和昨天统计
     * @param ctx
     * @param next
     */
    public async getStatistics(county = "全市"): Promise<IReturnInfo> {
        if (this.dataMap[county]) {
            return this.dataMap[county]
        }
        let allData: any = null;
        if (county === "全市") {
            allData = await this.model.find().sort({"updateTime": 1});
        } else {
            allData = await this.model.find({county}).sort({"updateTime": 1});
        }
        if (allData.length === 0) {
            return {type: EResponseType.internalServerError, error: "数据库没有数据"}
        }
        const updateTime = allData[allData.length - 1].updateTime;// 最新更新时间
        const result: any = {
            updateTime: moment(parseInt(updateTime, 10)).format("YY/MM/DD HH:mm"),
            num: 0,
            preDayNum: 0,
            countyMap: {},
            totalTrend: {},
        };
        /*前一天的时间0点*/
        const preDay = moment().subtract(1, 'days').format("YY/MM/DD");
        for (let item of allData) {
            const day: any = moment(parseInt(item.updateTime, 0)).format("YY/MM/DD");
            result.num += item.num;
            // 区县统计
            if (!result.countyMap[item.county]) {
                result.countyMap[item.county] = {
                    num: 0,
                    preDayNum: 0,
                };
            }
            result.countyMap[item.county].num += item.num;
            // 前一日统计
            if (day === preDay) {
                result.preDayNum += item.num;
                result.countyMap[item.county].preDayNum += item.num;
            }
            // 趋势图
            if (!result.totalTrend[day]) {
                result.totalTrend[day] = {
                    num: 0
                }
            }
            result.totalTrend[day].num += item.num;
        }
        // 变为递增
        result.totalTrend = JsUtil.timeObj2ArrSort(result.totalTrend);
        let countNum = 0;
        result.totalTrend = result.totalTrend.map((item: any, index: number) => {
            countNum += item.data.num;
            item.data.countNum = countNum;
            return item;
        });
        this.dataMap[county] = {type: EResponseType.success, data: result};
        return this.dataMap[county];
    }

    /**
     * 获取数据，根据范围区间
     * @param st 开始时间
     * @param et 结束时间
     * @param county 区县
     */
    public async getDataByRang(st: string = "", et: string = "", county: string = "全市"): Promise<IReturnInfo> {
        let args: any = {};
        if (st || et) {
            args.updateTime = {};
            // 指定时间的数据
            if (st === et) {
                args.updateTime = et;
            } else {
                // 存在起始时间
                if (st) {
                    args.updateTime.$gt = st;
                }
                // 存在结束时间
                if (et) {
                    args.updateTime.$lte = et;
                }
            }
        }
        // 如果有指定区域
        if (county !== "全市") {
            args.county = county;
        }
        const allData: any = await this.model.find(args).sort({"updateTime": -1});
        if (allData.length === 0) {
            return {type: EResponseType.internalServerError, error: "数据库没有数据"}
        }
        const result: any = {
            updateTime: allData[0].updateTime,
            num: 0
        };
        for (let item of allData) {
            result.num += item.num;
        }
        return {type: EResponseType.success, data: result}
    }


}
