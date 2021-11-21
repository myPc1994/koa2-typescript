import Router from 'koa-router';
import {IndexCtrl} from "../controller/IndexCtrl";

const router = new Router();
router.post('/addExcel2NucleicAcid', IndexCtrl.addExcel2NucleicAcid)

export default router;
