import {BaseTable} from "../../BaseTable";
// 用户-角色表
const table = {
    "userId": "TEXT NOT NULL",
    "roleId":"TEXT NOT NULL",
}
const restraint = 'PRIMARY KEY (userId, roleId)';
export type ITableUserRole = {
    [key in keyof typeof table]?: any
}
class Table extends BaseTable<ITableUserRole> {
    constructor(tableName: string) {
        super(tableName, table,restraint);
    }
}

export const table_user_role = new Table("table_user_role");
