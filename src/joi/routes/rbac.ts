import Joi from 'joi'
import {IJoiBase} from "../../core/CpcInterface";

const Rbac: IJoiBase = {
    addUserRoles: Joi.object({
        userId: Joi.string().required(),
        roles: Joi.array().required(),
    }),
    register: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })
}

export default Rbac;