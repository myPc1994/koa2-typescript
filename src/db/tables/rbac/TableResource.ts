import {BaseTable} from "../../BaseTable";
// 资源表
const table = {
    "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",//id
    "name": "TEXT NOT NULL",//资源名称
    "type": "TEXT",//资源类型
    "description": "TEXT ",// 描述
}
export type ITableResource = {
    [key in keyof typeof table]?: any
}

class Table extends BaseTable<ITableResource> {
    constructor(tableName: string) {
        super(tableName, table);
        this._init();
    }
    private _init(){
        this.insertOrUpdates([
            {
                id:"page-home",
                name:"首页",
                type:"page",
            },
            {
                id:"page-business",
                name:"店铺管理",
                type:"page",
            },
            {
                id:"page-promotionPlan",
                name:"推广营销计划",
                type:"page",
            },
            {
                id:"page-goods",
                name:"商品信息",
                type:"page",
            },
            {
                id:"page-PromotionOrder",
                name:"订单信息",
                type:"page",
            },
            {
                id:"page-PromotionUnit",
                name:"推广营销单元",
                type:"page",
            },
            {
                id:"page-log",
                name:"操作日志",
                type:"page",
            },
            {
                id:"page-chromePlugin",
                name:"谷歌插件",
                type:"page",
            },
        ])
    }
}

export const tableResource = new Table("tableResource");
