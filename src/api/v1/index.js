import KoaRouter from 'koa-router';

import auth from './auth/index.js';
import token from './token/index.js';
import payment from './payment/index.js';
import image from './image/index.js';
import video from './video/index.js';

import authenticated from '../../../middleware/authentication.js';

const v1 = new KoaRouter();

v1.use('/auth', auth.routes());
v1.use('/token', token.routes());
v1.use('/payment', authenticated, payment.routes());
v1.use('/image', image.routes());
v1.use('/video', video.routes());

export default v1;