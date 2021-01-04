import * as iamportLib from '../../../../lib/iamport.js';

const test = async ctx => {
    try {
        const token = await iamportLib.getToken();

        console.log(token);
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            type: 'Server error',
            message: error.message,
        };

        return;
    }
};

export {
    test,
}