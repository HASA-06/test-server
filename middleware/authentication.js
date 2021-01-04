import * as tokenLib from '../lib/token.js';

const authenticated = async (ctx, next) => {
    let accessToken = ctx.header.authorization;

    if(!accessToken) {
        ctx.status = 400;
        ctx.body = {
            type: 'JWT error',
            message: 'No token data at header',
        };

        return;
    }

    if(accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.slice(7, accessToken.length);
    }

    try {
        const decodedToken = await tokenLib.decodeToken(accessToken);

        if(decodedToken.data.sub !== 'accessToken') {
            ctx.status = 403;
            ctx.body = {
                message: '잘못된 토큰입니다',
            };

            return;
        }

        ctx.decodedToken = decodedToken;
    } catch (error) {
        let status = null;
        let message = null;

        switch (error.message) {
        case 'jwt must be provided':
            status = 400;
            message = '토큰이 전송되지 않았습니다';
            break;
        case 'jwt malformed':
        case 'invalid token':
        case 'invalid signature':
            status = 401;
            message = '위조된 토큰입니다';
            break;
        case 'jwt expired':
            status = 410;
            message = '토큰이 만료되었습니다';
            break;
        default:
            status = 500;
            message = '다시 시도해 주세요';
            break;
        }

        if(status === 500) {
            throw error;
        }

        ctx.status = status;
        ctx.body = {
            message,
        };

        return;
    }

    await next();
};

export default authenticated;