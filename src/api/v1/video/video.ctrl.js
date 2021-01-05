import { v1 } from 'uuid';

import * as resourceLib from '../../../../lib/resource.js';

import Ffmpeg from 'fluent-ffmpeg';

const upload = async ctx => {
    const { video } = ctx.request.files;
    const { type } = ctx.request.body;
    const name = v1();

    try {
        if(Array.isArray(video)) {
            ctx.status = 400;
            ctx.body = {
                type: 'Not array',
                message: 'Please upload a single file',
            };

            return;
        }

        const { Key } = await resourceLib.uploadVideo(video, name, type);
        
        ctx.status = 200;
        ctx.body = {
            message: 'Success',
            data: {
                key: Key,
                name,
            },
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            type: 'Server error',
            message: error.message,
        };

        return;
    }
}

const resize = async ctx => {
    const {
        name,
        type,
    } = ctx.request.body;

    try {
        ctx.status = 202;
        ctx.body = {
            message: 'Success',
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: error.message,
        };
    }

    try {
        await resourceLib.resizeVideo(name, type);
    } catch (error) {
        console.log(`::: Resize video has failed :::\n${error.message}\nThis part of code will need slack operation\nTotal error like this : ${error}`);
    }
}

const test = async ctx => {
    console.log(Ffmpeg.ffprobe);
}

export {
    upload,
    resize,
    test,
};