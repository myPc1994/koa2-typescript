import {JsUtil} from "./JsUtil";
import xlsx from "node-xlsx";
import {IReturnInfo} from "../core/CpcInterface";
// excel字段映射数据字段
const excelMapField: any = {
    "核酸统计": {
        "数据时间（增量更新）": "updateTime",
        "序号": "No",
        "区域": "county",
        "采样点名称": "sampleName",
        "核酸检测数量": "num"
    },
    "线索摸排": {
        "更新时间": "updateTime",
        "所属区域": "county",
        "接收人数": "receivingNum",
        "已核查": "haveCheck",
        "未核查": "notCheck",
        "核实人数(有效)": "verifyNum",
        "无效合计": "invalidCombin",
        "重复数据": "duplicateData",
        "未到疫区": "notToAffectedArea",
        "信息不全": "infoNotComplete",
        "在省外总数": "outProvinceNum",
        "在省内总数": "inProvinceNum",
        "高风险来闽": "highRisk",
        "中风险来闽": "middleRisk",
        "低风险来闽": "lowRisk",
    },
    "重点区域及时空伴随": {
        "更新时间": "updateTime",
        "所属区域": "county",
        "接收人数": "receivingNum",
        "已核查": "haveCheck",
        "未核查": "notCheck",
        "超24小时未核查": "notCheck24H",
    },
    "场景目录树": {
        "显示名称": "name",
        "场景名称": "value",
        "图片": "image",
    },
}

/**
 * excel导入数据库，中间格式化处理
 */
export class Excel2dbFormatUtil {

    public static general(mapName: string, path: string): IReturnInfo {
        const fileMap: any = excelMapField[mapName];
        if (!fileMap) {
            return {code: 500, data: "找不到表格映射关系,表名"+mapName};
        }
        let len = Object.keys(fileMap).length;
        const obj = xlsx.parse(path);
        const normalData = [];// 正常数据
        const abnormalData = [];// 异常数据
        for (const table of obj) {
            let filedMapIndex: any = {};
            if (table.data.length === 0) {
                return {code: 500, data: "表格内容为空!"};
            }
            const headRow = table.data[0];
            for (let index = 0; index < headRow.length; index++) {
                const excelField: any = (headRow[index] as string).trim();
                if (!fileMap[excelField]) {
                    return {code: 500, data: "找不到映射关系,字段:"+excelField};
                }
                filedMapIndex[fileMap[excelField]] = index;
            }
            if (Object.keys(filedMapIndex).length !== len) {
                return {code: 500, data: "表格字段缺失或者不匹配!,字段必须是数量:"+ len};
            }
            for (let index = 1; index < table.data.length; index++) {
                const row = table.data[index];
                if(row.length === 0){
                    break;
                }
                let isOk = true;
                const obj: any = {};
                for (let key of Object.keys(filedMapIndex)) {
                    let ItemResult: any = row[filedMapIndex[key]];
                    if (!ItemResult && typeof ItemResult !== "number") {
                        isOk = false;
                        abnormalData.push({"message":"异常数据","索引位置":index,row});
                        break;// 如果必须字段为空，说明数据有问题，直接跳过该数据
                    }
                    // 更新日期，统一转为时间戳
                    if (key === "updateTime") {
                        ItemResult = JsUtil.moment(ItemResult).valueOf()
                    }
                    obj[key] = ItemResult
                }
                if(isOk){
                    normalData.push(obj);
                }
            }
        }
        return {code: 200, data: {normalData,abnormalData}}
    }

}
