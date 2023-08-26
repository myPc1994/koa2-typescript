import {BaseTable} from "../../BaseTable";
import {table_role_resource} from "./Table_role_resource";
import {tableResource} from "./TableResource";
import {viewPermission} from "../../views/ViewPermission";
import {table_user_role} from "./Table_user_role";
import {database} from "../../index";
// 角色表
const table = {
    "id": "TEXT PRIMARY KEY UNIQUE NOT NULL",//id
    "name": "TEXT NOT NULL",//角色名
    "description": "TEXT ",// 描述
}
export type ITableRole = {
    [key in keyof typeof table]?: any;
}

class Table extends BaseTable<ITableRole> {
    constructor(tableName: string) {
        super(tableName, table);
    }

    public findByLeftJoin(where?: string | ITableRole, page = 0, size = 10) {
        // const countRes: any = this.prepare(this._count(where, "id")).get();
        // if (!countRes || countRes.count === 0) {
        //     return {
        //         total: 0,
        //         data: []
        //     }
        // }
        // const sql = `SELECT *, COALESCE((SELECT '[' || GROUP_CONCAT(JSON_OBJECT('id',id,'name',name,'type',type)) || ']'
        //                         FROM ${viewPermission.viewName} AS permission
        //                         LEFT JOIN ${table_role_resource.tableName} AS roleResource ON permission.id = roleResource.resourceId
        //                         WHERE roleResource.roleId = role.id AND permission.id IS NOT NULL
        //                         ),'[]') AS permissions
        //                     FROM ${this.tableName} AS role
        //                     ${this._where(where)}
        //                     ORDER BY updateTime DESC
        //                     LIMIT ? OFFSET ?
        //            `
        // const data:any[] = this.prepare(sql).all(size, page * size);
        // data.forEach(item=>item.permissions=JSON.parse(item.permissions))
        // return {
        //     data: data,
        //     total: countRes.count
        // }
    }


    public delete2(id: string) {
        database.transaction(() => {
            this.delete({id},"WHERE id=:id");
            table_role_resource.delete({roleId: id},"WHERE roleId=:roleId");
            table_user_role.delete({roleId: id},"WHERE roleId=:roleId");
        })
    }
}

export const tableRole = new Table("tableRole");
