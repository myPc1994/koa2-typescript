import {Context, Next} from 'koa';
import Router from 'koa-router';
import {UsersCtrl} from "../controller/UsersCtrl";
import {JoiUtil} from "../../utils/JoiUtil";
import {JwtUtil} from "../../utils/token/JwtUtil";
import Joi from 'joi'

const router = new Router({
    prefix: '/users'
});
router.get('/captcha', UsersCtrl.captcha);
// 加入验证码验证  usersRouter.post('/login', JoiUtil.middleware(JoiUtil.users.login), CaptchaUtil.middleware(), async (ctx: Context, next: Next) => {
router.post('/login', JoiUtil.middlewareByObject({
    account: Joi.string().alphanum().min(5).max(20).required(),
    password: Joi.string().alphanum().min(6).max(20).required(),
    uuid: Joi.string().required(),
    text: Joi.string().required()
}), UsersCtrl.login);

router.post('/register', JoiUtil.middlewareByObject({
    account: Joi.string().required(),
    password: Joi.string().required()
}), UsersCtrl.register);

// 需要验证token的方法前，加入JwtUtil.middleware即可
router.get('/verifyToken', JwtUtil.middleware, UsersCtrl.verifyToken);

router.get('/userInfo', JwtUtil.middleware, UsersCtrl.userInfo);


export default router;
