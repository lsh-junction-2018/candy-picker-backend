import Router from 'koa-router';
import Ctrl from 'controllers/candyPicker';

const router = new Router();

router.post('/candyPicker', Ctrl.sendCandyPickerCommand)

export default router.routes();