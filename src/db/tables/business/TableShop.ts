import {BaseTable} from "../../BaseTable";
import {database} from "../../index";
// 店铺信息表
const table = {
    "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",
    "name": "TEXT ",// 店铺名称
    "phone": "TEXT ",// 手机号
    "password": "TEXT ",// 密码
    "email": "TEXT ",// 邮箱
    "description": "TEXT ",// 描述
}
export type ITableShop = {
    [key in keyof typeof table]?: any
}

class Table extends BaseTable<ITableShop> {
    constructor(tableName: string) {
        super(tableName, table);
    }

    public find2(userId: string) {
        let sql = `SELECT DISTINCT t_shop.* 
                            FROM tableShop AS t_shop  
                            LEFT  JOIN table_role_resource AS t_role_resource ON t_role_resource.resourceId = t_shop.id
                            LEFT  JOIN table_user_role AS t_user_role ON t_user_role.roleId = t_role_resource.roleId
                           `
        if (userId !== "admin") {
            sql += ` WHERE t_user_role.userId = '${userId}'`
        }
        return database.prepare(sql).all();
    }
}

export const tableShop = new Table("tableShop");
