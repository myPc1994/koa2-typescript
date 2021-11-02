import Joi from 'joi'
import {IJoiBase} from "../../../core/CpcInterface";

export const JoiIndex: IJoiBase = {
    xxx: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required(),
        uuid: Joi.string().required(),
        text: Joi.string().required()
    }),
    xxxxx: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })
}
