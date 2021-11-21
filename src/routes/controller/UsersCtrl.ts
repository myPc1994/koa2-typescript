import {Context, Next} from 'koa';
import Joi from 'joi'
import {IKeyValue} from "../../core/CpcInterface";
import {CryptoUtil} from "../../utils/CryptoUtil";
import {ResponseBeautifier, ResponseInfo} from "../../utils/ResponseBeautifier";
import {CaptchaUtil} from "../../utils/CaptchaUtil";
import {UserCtrl} from "../../db/controller/rbac/UserCtrl";
import {JwtUtil} from "../../utils/token/JwtUtil";

export const UsersJoi = {
    login: Joi.object({
        userName: Joi.string().alphanum().min(5).max(20).required(),
        password: Joi.string().alphanum().min(6).max(20).required(),
        uuid: Joi.string().required(),
        text: Joi.string().required()
    }),
    register: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })
}

export class UsersCtrl {
    public static async register(ctx: Context, next: Next) {
        const {userName, password} = ctx.request.body;
        const userInfo = await UserCtrl.findOne({userName});
        if (userInfo) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "该用户名已存在!");
        }
        const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
        const res: IKeyValue = await UserCtrl.save({userName, password: saltPassword});
        ResponseBeautifier.success(ctx, {userId: res.userId, userName: res.userName});
    }

    public static async login(ctx: Context, next: Next) {
        const {userName, password} = ctx.request.body;
        const saltPassword = CryptoUtil.saltHashPassword(password, userName);// 密码加盐
        const userInfo: any = await UserCtrl.findOne({userName, password: saltPassword}, {
            _id: 0,
            userId: 1,
            userName: 1
        });
        if (!userInfo) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "用户名或者密码错误!");
        }
        userInfo.access_token = await JwtUtil.generateToken(userInfo, "7d");// TODO  配置化 7天有效
        ResponseBeautifier.success(ctx, userInfo);
    }

    public static async captcha(ctx: Context, next: Next) {
        const obj = CaptchaUtil.createMath();
        ResponseBeautifier.success(ctx, obj);
    }

    public static async verifyToken(ctx: Context, next: Next) {
        ResponseBeautifier.success(ctx, ctx.header.token_info, "token验证成功!");
    }

    public static async userInfo(ctx: Context, next: Next) {
        const {_id} = ctx.header.token_info as any;
        const userInfo: any = await UserCtrl.findOne({_id}, {
            _id: 1,
            userName: 1,
            roleIds: 1,
            createTime: 1
        });
        if (!userInfo) {
            return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.dataError, "找不到对应的用户信息!");
        }
        ResponseBeautifier.success(ctx, userInfo);
    }

}