import Joi from 'joi'
import {Context, Next} from 'koa';
import {EResponseType, ResponseBeautifier} from "../ResponseBeautifier";

export class JoiUtil {
    public static  middleware(schema: Joi.Schema) {
        return async function (ctx: Context, next: Next) {
            let data = null;
            if (ctx.method.toLocaleLowerCase() === "get") {
                data = ctx.request.query
            } else {
                data = ctx.request.body
            }
            console.log(typeof data.roles,data);
            const {error} = schema.validate(data)
            if (error) {
                return ResponseBeautifier.fail(ctx, EResponseType.parameterError, error.message);
            }
            return next();
        };
    }

}
