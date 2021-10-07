import Joi from 'joi'
import {Context, Next} from 'koa';
import {EResponseType, ResponseBeautifier} from "./ResponseBeautifier";
import {IJoiBase, IKeyValue} from "../core/CpcInterface";

export class JoiUtil {
    public static users: IJoiBase = {
        login: Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required()
        }),
        register: Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required()
        })
    }

    public static middleware(schema: Joi.Schema) {
        return async function (ctx: Context, next: Next) {
            let data = null;
            if (ctx.method.toLocaleLowerCase() === "get") {
                data = ctx.request.query
            } else {
                data = ctx.request.body
            }
            const {error} = schema.validate(data)
            if (error) {
                return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error.message);
            }
            return next();
        };
    }
}
