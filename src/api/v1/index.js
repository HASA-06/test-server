import KoaRouter from 'koa-router';

import auth from './auth/index.js';
import token from './token/index.js';
import payment from './payment/index.js';

const v1 = new KoaRouter();

v1.use('/auth', auth.routes());
v1.use('/token', token.routes());
v1.use('/payment', payment.routes());

export default v1;