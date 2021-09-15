import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";
import {Context, Next} from 'koa';
import moment from 'moment';
import {ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {JsUtil} from "../../utils/JsUtil";

export class NucleicAcidCtrl extends BaseDb {
    public static instance: NucleicAcidCtrl = new NucleicAcidCtrl();

    constructor() {
        super(ETables.nucleicAcid);
    }

    /**
     * 获取累计的统计数据和昨天统计
     * @param ctx
     * @param next
     */
    public async getStatistics(ctx: Context, next: Next, county = "全市") {
        let allData: any = null;
        if (county === "全市") {
            allData = await this.model.find();
        } else {
            allData = await this.model.find({county});
        }
        if (allData.length === 0) {
            return ResponseBeautifier.fail(ctx, ResponseInfo.internalServerError, "数据库没有数据!");
        }
        const updateTime = allData[allData.length - 1].updateTime;// 最新更新时间
        const result: any = {
            updateTime: moment(parseInt(updateTime,10)).format("YY/MM/DD HH:mm"),
            everyDay: 0,
            allPeople: 0,
            preDay: {
                everyDay: 0,
                allPeople: 0,
            },
            countyMap: {},
            totalTrend: {},
        };
        /*前一天的时间0点*/
        const preDay = moment().subtract(1, 'days').format("YY/MM/DD");
        console.log(preDay, moment(preDay).valueOf(), new Date().getTime());
        for (let item of allData) {
            const day: any = moment(parseInt(item.updateTime, 0)).format("YY/MM/DD");
            result.everyDay += item.everyDay;
            result.allPeople += item.allPeople;
            // 区县统计
            if (!result.countyMap[item.county]) {
                result.countyMap[item.county] = {
                    preEveryDay: 0,
                    preAllPeople: 0,
                    countEveryDay: 0,
                    countAllPeople: 0,
                };
            }
            result.countyMap[item.county].countEveryDay += item.everyDay;
            result.countyMap[item.county].countAllPeople += item.allPeople;
            // 前一日统计
            if (day === preDay) {
                result.countyMap[item.county].preEveryDay += item.everyDay;
                result.countyMap[item.county].preAllPeople += item.allPeople;
                result.preDay.everyDay += item.everyDay;
                result.preDay.allPeople += item.allPeople;
            }
            if (!result.totalTrend[day]) {
                result.totalTrend[day] = {
                    allPeople: 0,
                    everyDay: 0
                }
            }
            result.totalTrend[day].allPeople += item.allPeople;
            result.totalTrend[day].everyDay += item.everyDay;
        }
        // 变为递增
        const divisionTrend = JsUtil.timeObj2ArrSort(result.totalTrend);
        let countAllPeople = 0;
        let countEveryDay = 0;
        result.totalTrend = divisionTrend.map((item: any, index: number) => {
            countAllPeople += item.data.allPeople;
            countEveryDay += item.data.everyDay;
            item.data.countAllPeople = countAllPeople;
            item.data.countEveryDay = countEveryDay;
            return item;
        });
        ResponseBeautifier.success(ctx, result);
    }

    /**
     * 获取数据，根据范围区间
     * @param st 开始时间
     * @param et 结束时间
     * @param county 区县
     */
    public async getDataByRang(st: string = "", et: string = "", county: string = "全市") {
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
        const allData: any = await this.model.find(args);
        const result: any = {
            updateTime: et,
            everyDay: 0,
            allPeople: 0,
        };
        for (let item of allData) {
            result.everyDay += item.everyDay;
            result.allPeople += item.allPeople;
        }
        return result
    }
}
