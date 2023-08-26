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

    public find(where = '', fields = ["*"]) {
        return database.prepare(`SELECT ${fields.join(",")} FROM ${this.viewName} ${where}`).all() as T[];
    }

}
