import KoaRouter from 'koa-router';

import * as videoCtrl from './video.ctrl.js';

const video = new KoaRouter();

video.post('/upload', videoCtrl.upload);
video.post('/resize', videoCtrl.resize);
video.get('/test', videoCtrl.test);

export default video;