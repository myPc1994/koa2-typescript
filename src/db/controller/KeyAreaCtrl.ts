import {ETables} from "../tables";
import {BaseDb} from "../BaseDb";
import moment from 'moment';
import {EResponseType, IReturnInfo} from "../../utils/ResponseBeautifier";

/**
 * 重点区域
 */
export class KeyAreaCtrl extends BaseDb {
    public static instance: KeyAreaCtrl = new KeyAreaCtrl();
    constructor() {
        super(ETables.keyArea);
    }
    public async saveOrFilterSame2(fields: string[], arr: any[]) {
        const result = await this.saveOrFilterSame(fields, arr);
        this.dataMap = {};
        setTimeout(this.keyAreaStats.bind(this), 100);
        return result;
    }
    /**
     * 获取重点区域统计数据
     * @param ctx
     * @param next
     * @param county
     */
    public async keyAreaStats(county = "全市"):Promise<IReturnInfo> {
        if (this.dataMap[county]) {
            return this.dataMap[county]
        }
        let allData: any = null;
        const newData: any = await this.model.findOne(undefined, {
            updateTime: 1,
            _id: 0
        }).sort({"updateTime": -1}).exec();
        if (!newData) {
            return {type: EResponseType.internalServerError, error:"数据库没有数据"}
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
            return {type: EResponseType.internalServerError, error:"数据库没有数据"}
        }
        const updateTime = allData[allData.length - 1].updateTime;// 最新更新时间
        const result: any = {
            updateTime: moment(parseInt(updateTime, 10)).format("YY/MM/DD HH:mm"),
            receivingNum: 0,// 接收人数
            haveCheck: 0,// 已核查
            notCheck: 0,// 未核查
            notCheck24H: 0,// 超24小时未核查
            countyMap: []// 各区县摸排情况
        };
        for (let item of allData) {
            result.receivingNum += item.receivingNum;
            result.haveCheck += item.haveCheck;
            result.notCheck += item.notCheck;
            result.notCheck24H += item.notCheck24H;
            result.countyMap.push(item);
        }
        this.dataMap[county] = {type: EResponseType.success, data: result};
        return this.dataMap[county];
    }

}
