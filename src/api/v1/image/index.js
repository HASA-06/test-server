import KoaRouter from 'koa-router';

import * as imageCtrl from './image.ctrl.js';

const image = new KoaRouter();

image.post('/upload', imageCtrl.upload);
image.post('/resize', imageCtrl.resize);

export default image;