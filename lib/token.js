import jwt from 'jsonwebtoken';

const createAccessToken = async payload => {
    const option = {
        expiresIn: '30m',
        issuer: 'miiif.com',
        subject: 'accessToken',
    };

    try {
        return {
            status: 'success',
            data: jwt.sign(payload, process.env.JWT__SECRET_KEY, option),
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
            data: jwt.sign(payload, process.env.JWT__SECRET_KEY, option),
        };
    } catch (error) {
        throw error;
    }
};

const decodeToken = async token => {
    try {
        return {
            status: 'success',
            data: jwt.verify(token, process.env.JWT__SECRET_KEY),
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