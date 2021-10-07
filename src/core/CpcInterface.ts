import {Context} from "koa";
import {IncomingMessage} from "http";
import Joi from 'joi'

// 环境变量接口说明
export interface IEnvConfig {
    env: 'development' | 'production' | 'test', // 环境名称
    agreement: "http" | "https",
    port: number,
    log: {// 日志配置：支持log4js文件记录，和数据库记录
        type: "file" | "db",// file,db//文件保存，还是数据库保存
    },
    mongodb_config: { // mongodb数据库配置
        user: string,
        pass: string,
        host: string,
        port: number,
        database: string,
        option: any
    }
}

/**
 * 定义统一的{key:value}格式
 */
export interface IKeyValue {
    [key: string]: any
}

/**
 * 扩展http的IncomingMessage
 */
export interface IMulterNcomingMessage extends IncomingMessage {
    file: File,
    body: IKeyValue
}

/**
 * 自定义ctx返回的类型
 */
export interface IMulterContext extends Context {
    req: IMulterNcomingMessage
}

/**
 * 版本信息接口
 */
export interface ICpcVersion {
    version_1: number,
    version_2: number,
    version_3: number,
}

/**
 * 上传参数配置接口
 */
export interface IMulterUtil {
    path: Function | string,
    filename: Function | any,
    suffixs: string[]
}

/**
 * 参数验证基类
 */
export interface IJoiBase {
    [key: string]: Joi.Schema
}