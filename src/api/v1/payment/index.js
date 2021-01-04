import KoaRouter from 'koa-router';

import * as paymentCtrl from './payment.ctrl.js';

const payment = new KoaRouter();

payment.post('/token', paymentCtrl.token);
payment.post('/find-all-by-status', paymentCtrl.findAllByStatus);

export default payment;