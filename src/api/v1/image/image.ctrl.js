import { v1 } from 'uuid';
import path from 'path';

import * as resourceLib from '../../../../lib/resource.js';

const upload = async ctx => {
    const { image } = ctx.request.files;
    const { type } = ctx.request.body;
    const name = `${v1()}${path.extname(image.name)}`;

    try {
        if(Array.isArray(image)) {
            ctx.status = 400;
            ctx.body = {
                type: 'Not array',
                message: 'Please upload a single file',
            };

            return;
        }

        const { Key } = await resourceLib.uploadImage(image, name, type);

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
};

const resize = async ctx => {
    const {
        name,
        type
    } = ctx.request.body;

    try {
        ctx.status = 202;
        ctx.body = {
            message: 'Success',
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            type: 'Server error',
            message: error.message,
        };
    }

    try {
        await resourceLib.resizeImage(name, type);
    } catch (error) {
        console.log(`::: Resize image has failed :::\n${error.message}\nThis part of code will need slack operation\nTotal error like this : ${error}\n`);
    }
};

export {
    upload,
    resize,
};