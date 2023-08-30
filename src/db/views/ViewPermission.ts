import {BaseView} from "../BaseView";
import {tableResource} from "../tables/rbac/TableResource";
import {tableShop} from "../tables/business/TableShop";
import {database} from "../index";
import {table_user_role} from "../tables/rbac/Table_user_role";
import {table_role_resource} from "../tables/rbac/Table_role_resource";
import {tableUser} from "../tables/rbac/TableUser";

const sql = `select id,name,description, type from ${tableResource.name} 
                     UNION 
                     select id,name,description,'shop' as type from ${tableShop.name} `;
//定义视图的字段
const fields = ['id', 'name', 'type', "description"] as const
//构建视图的类型
export type IViewPermission = {
    [key in typeof fields[number]]: any;
};
//视图-权限
class View extends BaseView<IViewPermission> {
    constructor(viewName: string) {
        super(viewName, fields, sql);
    }

    public findByUserId(id: string) {
        const sql = `SELECT DISTINCT permission.*
                      FROM ${this.name} AS permission
                      LEFT  JOIN ${table_role_resource.name} AS roleResource ON permission.id = roleResource.resourceId
                      LEFT  JOIN ${table_user_role.name} AS userRole ON userRole.roleId = roleResource.roleId
                      LEFT  JOIN ${tableUser.name} AS user ON user.id = userRole.userId
                      WHERE user.id = ?
                   `
        return database.prepare(sql).all(id) as IViewPermission[];
    }
}

export const viewPermission = new View("viewPermission");