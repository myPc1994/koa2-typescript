// 引入模块依赖
import {IReturnInfo, ResponseBeautifier, ResponseInfo} from "../ResponseBeautifier";
import {Context, Next} from 'koa';

const fs = require('fs');
const path = require('path');
import jsonwebtoken from 'jsonwebtoken';// JSON Web令牌签名和验证
let cert_public = fs.readFileSync(path.join(__dirname, './pem/public_key.pem'));// 公钥 可以自己生成
let cert_private = fs.readFileSync(path.join(__dirname, './pem/private_key.pem'));// 私钥 可以自己生成
// 创建 token 类
export class JwtUtil {
    /**
     * 生成token
     * @param {string | Buffer | object} data 用户自定义信息
     * @param {number} expiresIn 过期时间  number类型单位:秒,字符串类型:无单位默认为毫秒,带单位的话："10h", "7d"分别代表10小时，7天
     * @returns {Promise<string>}
     */
    public static generateToken(data: string | Buffer | object, expiresIn: string | number | undefined = 6000): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, cert_private, {algorithm: 'RS256', expiresIn}, function (err, token) {
                if (err) {
                    return reject(err);
                }
                resolve(token as string);
            });
        });
    }

    /**
     * 校验token
     * @param {string} token 需要验证的token
     * @returns {Promise<IReturnInfo>}
     */
    public static verifyToken(token: string): Promise<IReturnInfo> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, cert_public, {algorithms: ['RS256']}, (error, data) => {
                if (!error) {
                    return resolve({...ResponseInfo.success, message: "验证通过", data});
                }
                switch (error.name) {
                    case 'TokenExpiredError':// token过期错误
                        return resolve({...ResponseInfo.tokenError, message: "token过期了"});
                    case 'NotBeforeError':// 当前时间超过nbf的值时抛出该错误,一般是由于服务端修改了系统时间引起的
                        return resolve({...ResponseInfo.tokenError, message: "token早于签发时间"});
                    case 'JsonWebTokenError':// 令牌有问题
                        return resolve({...ResponseInfo.tokenError, message: "token被篡改"});
                    default:
                        return resolve({...ResponseInfo.tokenError, message: "token解析到未知错误"});
                }
            });
        })
    }

    /**
     * token验证中间件------将验证成功的信息放在了 ctx.req.headers.token_info
     * @param {Koa.Context} ctx
     * @param {Koa.Next} next
     * @returns {Promise<any>}
     */
    public static async middleware(ctx: Context, next: Next) {
        const access_token = ctx.header.access_token;
        if (!access_token) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.parameterError, "缺少token");
        }
        const info: IReturnInfo = await JwtUtil.verifyToken(access_token as string);
        if (info.code === 200) {
            ctx.req.headers.token_info = info.data;
            return next();
        }
        ResponseBeautifier.response(ctx, info);
    }
}
