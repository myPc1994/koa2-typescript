import {BaseTable} from "../../BaseTable";
import {database} from "../../index";
import {table_role_resource} from "./Table_role_resource";
import {ITableUser, tableUser} from "./TableUser";
import {table_user_role} from "./Table_user_role";
import {ITableRole, tableRole} from "./TableRole";
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
    public bindRoles(id: string, roles: string[]) {
        database.transaction(() => {
            table_role_resource.delete({resourceId: id}, "WHERE userId=:userId");
            table_role_resource.inserts(roles.map(roleId => ({resourceId: id, roleId})))
        })()
    }
    public getRoles(id: string) {
        const sql = `SELECT t_role.* FROM ${tableRole.name} as t_role
                           INNER JOIN ${table_role_resource.name} AS t_role_resource ON t_role_resource.resourceId='${id}' AND t_role.id =t_role_resource.roleId`;
        return  database.prepare(sql).all() as ITableRole[];
    }
    public getUsers(id: string) {
        const sql = `SELECT t_user.* FROM ${tableUser.name} AS t_user
                            INNER JOIN ${table_user_role.name} AS t_user_role ON  t_user.id =t_user_role.userId
                            INNER JOIN ${table_role_resource.name} AS t_role_resource ON t_role_resource.resourceId='${id}' AND t_user_role.roleId =t_role_resource.roleId`;
        return  database.prepare(sql).all() as ITableUser[];
    }
    delete2(id: string) {
        database.transaction(() => {
            this.delete({id}, "WHERE id=:id");
            table_role_resource.delete({resourceId: id}, "WHERE resourceId=:resourceId");
        })()
    }
}

export const tableResource = new Table("tableResource");
