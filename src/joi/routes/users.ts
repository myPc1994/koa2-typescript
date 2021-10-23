import Joi from 'joi'
import {IJoiBase} from "../../core/CpcInterface";

const Users: IJoiBase = {
    login: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required(),
        uuid: Joi.string().required(),
        text: Joi.string().required()
    }),
    register: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })
}

export default Users;