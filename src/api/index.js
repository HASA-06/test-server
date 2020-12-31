import KoaRouter from 'koa-router';

import v1 from './v1/index.js';

const api = new KoaRouter();

api.use('/v1', v1.routes());
api.get('/check', (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'Routing has no problem';

  return;
});

export default api;