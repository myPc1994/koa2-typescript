import {database} from "./index";
import {IKeyValue} from "../types/types";
export abstract class BaseView<T extends IKeyValue<any>> {
    public viewName: string;

    constructor(viewName: string, sql: string) {
        this.viewName = viewName;
        database.exec(`
        -- 删除视图（如果存在）
        DROP VIEW IF EXISTS ${this.viewName};
        -- 创建视图
        CREATE VIEW ${this.viewName} AS ${sql}`);
    }
    /**
     * 构建where
     * @param where 条件
     * @param ASName 别名
     * @protected
     */
    protected _where(where?: string | T, ASName = "") {
        if (!where) {
            return "";
        }
        if (typeof where == "string") {
            return where;
        }
        if (Object.keys(where).length === 0) {
            return ""
        }
        //这里暂时只处理and方式
        const whereArr = Object.keys(where).map(field => `${ASName}${field}='${where[field]}'`)
        return "WHERE " + whereArr.join(" and ")
    }
    public prepare(source: string) {
        return database.prepare(source);
    }

}
