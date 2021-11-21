import {Context, Next} from 'koa';
import Router from 'koa-router';
import {UsersCtrl, UsersJoi} from "../controller/UsersCtrl";
import {JoiUtil} from "../../utils/JoiUtil";
import {JwtUtil} from "../../utils/token/JwtUtil";

const router = new Router({
    prefix: '/users'
});
router.get('/captcha', UsersCtrl.captcha);
// 加入验证码验证  usersRouter.post('/login', JoiUtil.middleware(JoiUtil.users.login), CaptchaUtil.middleware(), async (ctx: Context, next: Next) => {
router.post('/login', JoiUtil.middleware(UsersJoi.login), UsersCtrl.login);

router.post('/register', JoiUtil.middleware(UsersJoi.register), UsersCtrl.register);

// 需要验证token的方法前，加入JwtUtil.middleware即可
router.get('/verifyToken', JwtUtil.middleware, UsersCtrl.verifyToken);

router.get('/userInfo', JwtUtil.middleware, UsersCtrl.userInfo);


export default router;
