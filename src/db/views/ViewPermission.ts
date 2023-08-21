import {BaseView} from "../BaseView";
import {tableResource} from "../tables/rbac/TableResource";
import {tableShop} from "../tables/business/TableShop";
//视图-权限
const sql = `select id,name,description, type from ${tableResource.tableName} 
                     UNION 
                     select id,name,description,'shop' as type from ${tableShop.tableName} `;
export interface IViewPermission{
    id?:string,
    name?:string,
    description?:string,
    type?:string,
}
class View extends BaseView<IViewPermission> {
    constructor(viewName: string) {
        super(viewName, sql);
    }
    public find(where?:IViewPermission){
        return this.prepare(`select * from ${this.viewName} ${this._where(where)}`).all() as IViewPermission[];
    }
}

export const viewPermission = new View("viewPermission");