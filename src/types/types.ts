import {Context, Next} from "koa";
/**
 * 定义统一的{key:value}格式
 */
export interface IKeyValue<T> {
    [key: string|number]: T
}

export type TypeFn = (ctx: Context, next: Next) => Promise<any>;
