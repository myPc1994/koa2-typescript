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
}

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

    public static nucleate(path: string): IReturnInfo {
        const obj = xlsx.parse(path);
        const result = [];
        for (const table of obj) {
            for (let index = 0; index < table.data.length; index++) {
                if (index === 0) {

                    const title = table.data[0][0];
                    if (title !== "核酸统计") {
                        return {code: 401, data: "标题识别错误无法匹配!" + title};
                    }
                    continue;
                }
                const item = table.data[index];
                if (JsUtil.isEmpty(item, 5)) {
                    result.push({
                        "updateTime": JsUtil.moment(item[0] as any).valueOf(),
                        "No": item[1],
                        "county": item[2],
                        "sampleName": item[3],
                        "num": item[4]
                    })
                }
            }
        }
        return {code: 200, data: result}
    }

    public static moPai(path: string): IReturnInfo {
        const obj = xlsx.parse(path);
        const result = [];
        for (const table of obj) {
            for (let index = 0; index < table.data.length; index++) {
                if (index === 0) {
                    const title = table.data[0][0];
                    if (title !== "线索摸排") {
                        return {code: 401, data: "数据格式无法匹配!"}
                    }
                    continue;
                }
                const item = table.data[index];
                if (JsUtil.isEmpty(item, 15)) {
                    result.push({
                        "updateTime": JsUtil.moment(item[0] as any).valueOf(),
                        "county": item[1],
                        "receivingNum": item[2],
                        "haveCheck": item[3],
                        "notCheck": item[4],
                        "verifyNum": item[5],
                        "invalidCombin": item[6],
                        "duplicateData": item[7],
                        "notToAffectedArea": item[8],
                        "infoNotComplete": item[9],
                        "outProvinceNum": item[10],
                        "inProvinceNum": item[11],
                        "highRisk": item[12],
                        "middleRisk": item[13],
                        "lowRisk": item[14],
                    })
                }
            }
        }
        return {code: 200, data: result}
    }

    public static keyArea(path: string): IReturnInfo {
        const obj = xlsx.parse(path);
        const result = [];
        for (const table of obj) {
            for (let index = 0; index < table.data.length; index++) {
                if (index === 0) {
                    const title = table.data[0][0];
                    if (title !== "重点区域及时空伴随") {
                        return {code: 401, data: "数据格式无法匹配!"}
                    }
                    continue;
                }
                const item = table.data[index];
                if (JsUtil.isEmpty(item, 6)) {
                    result.push({
                        "updateTime": JsUtil.moment(item[0] as any).valueOf(),
                        "county": item[1],
                        "receivingNum": item[2],
                        "haveCheck": item[3],
                        "notCheck": item[4],
                        "notCheck24H": item[5],
                    })
                }
            }
        }
        return {code: 200, data: result}
    }


}
