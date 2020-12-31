import KoaRouter from 'koa-router';

import auth from './auth/index.js';

const v1 = new KoaRouter();

v1.use('/auth', auth.routes());

export default v1;