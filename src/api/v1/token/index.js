import KoaRouter from 'koa-router';

import * as tokenCtrl from './token.ctrl.js';

const token = new KoaRouter();

token.post('/refresh', tokenCtrl.refresh);

export default token;