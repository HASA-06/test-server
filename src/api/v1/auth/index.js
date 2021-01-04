import KoaRouter from 'koa-router';

import * as authCtrl from './auth.ctrl.js';

const auth = new KoaRouter();

auth.post('/sign-up', authCtrl.signUp);
auth.post('/sign-in', authCtrl.signIn);
auth.post('/sms-send', authCtrl.smsSend);
auth.post('/sms-check', authCtrl.smsCheck);

export default auth;