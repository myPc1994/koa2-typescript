import Joi from 'joi'
import {Context, Next} from 'koa';
import {ResponseBeautifier, ResponseInfo} from "./ResponseBeautifier";

export class JoiUtil {
    public static middleware(schema: Joi.Schema) {
        return async function (ctx: Context, next: Next) {
            let data = null;
            const methodType = ctx.method.toLocaleLowerCase();
            if (methodType === "get" || methodType === "delete") {
                data = ctx.request.query
            } else {
                data = ctx.request.body
            }
            const {error} = schema.validate(data);
            if (error) {
                return ResponseBeautifier.responseByStatus(ctx, ResponseInfo.parameterError, error.message);
            }
            return next();
        };
    }

}
