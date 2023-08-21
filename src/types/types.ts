import {Context, Next} from "koa";
/**
 * 定义统一的{key:value}格式
 */
export interface IKeyValue<T> {
    [key: string|number]: T
}

/**
 * 版本信息接口
 */
export interface ICpcVersion {
    version_1: number,
    version_2: number,
    version_3: number,
}

export type TypeFn = (ctx: Context, next: Next) => Promise<any>;
