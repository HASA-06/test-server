import * as iamportLib from '../../../../lib/iamport.js';

const token = async ctx => {
    try {
        const iamportResponse = await iamportLib.getToken();

        ctx.status = 200;
        ctx.body = {
            message: 'Success',
            data: iamportResponse.data['access_token'],
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            type: 'Server error',
            message: error.message,
        };

        return;
    }
};

const findAllByStatus = async ctx => {
    const {
        statusCode
    } = ctx.request.body;

    try {
        const iamportRespose = await iamportLib.getAllByStatus(statusCode);

        ctx.status = 200;
        ctx.body = {
            message: 'Success',
            data: iamportRespose.data.list,
        };

        return;
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            type: 'Iamport error',
            message: error.message,
        };

        return;
    }
};

export {
    token,
    findAllByStatus,
};