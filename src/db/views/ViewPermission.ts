import {BaseView} from "../BaseView";
import {tableResource} from "../tables/rbac/TableResource";
import {tableShop} from "../tables/business/TableShop";
import {database} from "../index";
import {table_user_role} from "../tables/rbac/Table_user_role";
import {table_role_resource} from "../tables/rbac/Table_role_resource";
import {tableUser} from "../tables/rbac/TableUser";
//视图-权限
const sql = `select id,name,description, type from ${tableResource.name} 
                     UNION 
                     select id,name,description,'shop' as type from ${tableShop.name} `;
// 这边的fields主要是定义视图中的所有字段，只有key有用，value可以随便填写
const fields = {
    "id": "id",
    "name": "权限名称",
    "type": "类型",
    "description": "描述",
}
export type IViewPermission = {
    [key in keyof typeof fields]?: any;
}
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