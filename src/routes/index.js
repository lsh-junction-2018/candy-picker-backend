import Router from 'koa-router';

import candyPickerRouter from './candyPicker'

const routers = new Router();

routers.prefix('/api/v1');
routers.use(candyPickerRouter);

export default routers;