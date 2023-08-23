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
    }

}

export const tableResource = new Table("tableResource");
