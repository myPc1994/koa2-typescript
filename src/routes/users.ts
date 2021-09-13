import Koa from 'koa';
import Router from 'koa-router';
import {UserCtrl} from "../db/controller/UserCtrl";
import {ResponseBeautifier} from "../utils/ResponseBeautifier";

const usersRouter = new Router({
    prefix: '/users'
});
/**
 * @api {get} /system/getSystem 获取系统信息
 * @apiGroup system
 * @apiSuccess (200) {Number} status 状态码
 * @apiSuccess (200) {String} message 消息
 * @apiSuccess (200) {Object} data 节点信息
 * @apiSuccess (200) {Array} data.ips 从节点拥有的ip(多网卡)
 * @apiSuccess (200) {Number} data.port 从节点的端口
 * @apiSuccess (200) {String} data.cpus 从节点的cpu
 * @apiSuccess (200) {String} data.memory 从节点的内存
 * @apiSuccess (200) {Number} data.memory.total 从节点的总内存（字节）
 * @apiSuccess (200) {String} data.memory.free 从节点的总内存（格式化后）
 * @apiSuccess (200) {Array} data.gpus  从节点拥有的GPU(多显卡)
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 200,
 *   "message": "操作成功",
 *   "data": {
 *   "ips": [
 *       "172.17.224.1",
 *       "11.23.254.129",
 *       "192.168.168.70"
 *   ],
 *       "port": "9999",
 *       "cpus": [
 *       {
 *           "model": "Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz",
 *           "speed": 3696,
 *           "times": {
 *               "user": 39382093,
 *               "nice": 0,
 *               "sys": 36738921,
 *               "idle": 1251714187,
 *               "irq": 6603687
 *           }
 *       }
 *   ],
 *       "memory": {
 *       "total": 34286379008,
 *           "free": 19486371840
 *   },
 *   "gpus": [
 *       {
 *           "name": "GeForce GTX 1050 Ti"
 *       }
 *   ]
 * }
 * }
 * @apiVersion 1.0.0
 */
usersRouter.get('/string', async (ctx: Koa.Context, next: Koa.Next) => {
    const res = await UserCtrl.instance.save({
        user: "是否",
        price: "xxxxxxx"
    })
    ResponseBeautifier.success(ctx, res);
})

usersRouter.get('/json', async (ctx: Koa.Context, next: Koa.Next) => {
    const data = await UserCtrl.instance.find();
    ResponseBeautifier.success(ctx, data);
})


export default usersRouter;
