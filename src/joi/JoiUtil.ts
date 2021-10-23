import Joi from 'joi'
import {Context, Next} from 'koa';
import {EResponseType, ResponseBeautifier} from "../tools/ResponseBeautifier";
import Users from './routes/users';
import Rbac from './routes/rbac';
import Index from "./routes";


export class JoiUtil {
    public static index = Index;
    public static users = Users;
    public static rbac = Rbac;
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
