import KoaRouter from 'koa-router';

import * as paymentCtrl from './payment.ctrl.js';

const payment = new KoaRouter();

payment.post('/test', paymentCtrl.test);

export default payment;