import { Iamporter } from 'iamporter';

import iamportConfig from '../config/iamport.js';

const iamporter = new Iamporter({
    apiKey: iamportConfig.apiKey,
    secret: iamportConfig.secret,
});

const paymentStatus = {
    0: 'all',
    1: 'ready',
    2: 'paid',
    3: 'cancelled',
    4: 'failed',
}

const getToken = async () => {
    try {
        const token = await iamporter.getToken();

        return token;
    } catch (error) {
        throw error;
    }
};

const getAllByStatus = async (statusCode) => {
    try {
        const data = await iamporter.findAllByStatus(paymentStatus[statusCode]);

        return data;
    } catch (error) {
        throw error;
    }
}

export {
    getToken,
    getAllByStatus,
};