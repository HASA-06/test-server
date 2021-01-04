import { Iamporter, IamporterError } from 'iamporter';

import iamportConfig from '../config/iamport.js';

const iamporter = new Iamporter({
    apiKey: iamportConfig.apiKey,
    secret: iamportConfig.secret,
});

const getToken = async () => {
    try {
        const token = await iamporter.getToken();

        return token;
    } catch (error) {
        throw error;
    }
};

export {
    getToken,
};