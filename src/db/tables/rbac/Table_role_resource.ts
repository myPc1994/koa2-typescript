import {BaseTable} from "../../BaseTable";
// 角色-资源表
const table = {
    "roleId":"TEXT NOT NULL",
    "resourceId": "TEXT NOT NULL",
}
const restraint = 'PRIMARY KEY (roleId, resourceId)';
export type ITableRoleResource = {
    [key in keyof typeof table]?: any
}
class Table extends BaseTable<ITableRoleResource> {
    constructor(tableName: string) {
        super(tableName, table,restraint);
    }
}

export const table_role_resource = new Table("table_role_resource");
