import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBody from 'koa-body';
import KoaCors from 'koa-cors';
import KoaStatic from 'koa-static';
import KoaRange from 'koa-range';
import KoaLogger from 'koa-logger';

import api from './api/index.js';

const app = new Koa();
const router = new KoaRouter();

const PORT_NUMBER = 3000;
const HOST_ADDRESS = '0.0.0.0';

router.use('/api', api.routes());

app.use(KoaRange);
app.use(KoaLogger());
app.use(KoaCors());
app.use(KoaBody({   multipart: true }));
app.use(KoaStatic('public'));

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT_NUMBER, HOST_ADDRESS, () => {
    console.log(`::: Server start :::\nTest server is listening to port ${PORT_NUMBER}\n`);
});