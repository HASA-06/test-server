import KoaRouter from 'koa-router';

import { signUp, signIn } from './authCtrl.js';

const auth = new KoaRouter();

auth.post('/sign-up', signUp);
auth.post('/sign-in', signIn);

export default auth;