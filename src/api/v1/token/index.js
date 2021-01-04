import KoaRouter from 'koa-router';

import * as tokenCtrl from './tokenCtrl.js';

const token = new KoaRouter();

token.post('/refresh', tokenCtrl.refresh);

export default token;