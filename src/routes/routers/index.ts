import Router from 'koa-router';
import {IndexCtrl} from "../controller/IndexCtrl";
const router = new Router();

/**
 * @apiDefine responseSuccess
 * @apiSuccess (200) {Number} code 状态码
 * @apiSuccess (200) {String} message 状态码说明

 */
/**
 * @apiDefine findByPage
 * @apiParam {String} [page=0] 页数
 * @apiParam {String} [limit=10] 每页返回个数
 * @apiUse responseSuccess
 * @apiSuccess (200) {Object} data 数据
 * @apiSuccess (200) {String} data.count 数据总个数
 */
router.post('/addExcel2NucleicAcid', IndexCtrl.addExcel2NucleicAcid)

export default router;
