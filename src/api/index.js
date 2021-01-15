import KoaRouter from 'koa-router';

import v1 from './v1/index.js';

import npmTest from 'vue-ts-iamport';

const api = new KoaRouter();

api.use('/v1', v1.routes());
api.get('/check', (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    message: 'Success',
    data: npmTest,
  };

  return;
});

export default api;