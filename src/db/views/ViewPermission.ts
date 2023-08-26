import {BaseView} from "../BaseView";
import {tableResource} from "../tables/rbac/TableResource";
import {tableShop} from "../tables/business/TableShop";
import {database} from "../index";
import {table_user_role} from "../tables/rbac/Table_user_role";
import {table_role_resource} from "../tables/rbac/Table_role_resource";
import {tableUser} from "../tables/rbac/TableUser";
//视图-权限
const sql = `select id,name,description, type from ${tableResource.tableName} 
                     UNION 
                     select id,name,description,'shop' as type from ${tableShop.tableName} `;

export interface IViewPermission {
    id?: string,
    name?: string,
    description?: string,
    type?: string,
}

class View extends BaseView<IViewPermission> {
    constructor(viewName: string) {
        super(viewName, sql);
    }

    public findByUserId(id: string) {
        const sql = `SELECT DISTINCT permission.*
                      FROM ${this.viewName} AS permission
                      LEFT  JOIN ${table_role_resource.tableName} AS roleResource ON permission.id = roleResource.resourceId
                      LEFT  JOIN ${table_user_role.tableName} AS userRole ON userRole.roleId = roleResource.roleId
                      LEFT  JOIN ${tableUser.tableName} AS user ON user.id = userRole.userId
                      WHERE user.id = ?
                   `
        return database.prepare(sql).all(id) as IViewPermission[];
    }
}

export const viewPermission = new View("viewPermission");