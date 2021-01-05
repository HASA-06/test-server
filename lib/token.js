import jwt from 'jsonwebtoken';

import tokenConfig from '../config/token.js';

const createAccessToken = async payload => {
    const option = {
        expiresIn: '30m',
        issuer: 'miiif.com',
        subject: 'accessToken',
    };

    try {
        return {
            status: 'success',
            data: jwt.sign(payload, tokenConfig.secretKey, option),
        };
    } catch (error) {
        throw error;
    }
};

const createRefreshToken = async payload => {
    const option = {
        expiresIn: '60d',
        issuer: 'miiif.com',
        subject: 'refreshToken',
    };

    try {
        return {
            status: 'success',
            data: jwt.sign(payload, tokenConfig.secretKey, option),
        };
    } catch (error) {
        throw error;
    }
};

const decodeToken = async token => {
    try {
        return {
            status: 'success',
            data: jwt.verify(token, tokenConfig.secretKey),
        };
    } catch (error) {
        throw error;
    }
};

export {
    createAccessToken,
    createRefreshToken,
    decodeToken,
};