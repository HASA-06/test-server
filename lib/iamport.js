import { Iamporter } from 'iamporter';

import iamportConfig from '../config/iamport.js';

console.log(`Iamport :: ${process.env.IAMPORT__API_KEY}`)

const iamporter = new Iamporter({
    apiKey: process.env.IAMPORT__API_KEY,
    secret: process.env.IAMPORT__API_SECRET,
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