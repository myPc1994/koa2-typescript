import {database} from "./index";
import {IKeyValue} from "../types/types";
import {Base} from "./Base";

export abstract class BaseView<T extends IKeyValue<any>> extends Base<T>{
    constructor(name: string, fieldInfo:T|any,sql: string) {
        super(name,fieldInfo);
        database.exec(`
        -- 删除视图（如果存在）
        DROP VIEW IF EXISTS ${name};
        -- 创建视图
        CREATE VIEW ${name} AS ${sql}`);
    }
}
