import * as tokenLib from '../../../../lib/token.js';
import ms from 'ms';

const refresh = async ctx => {
    const {
        refreshToken
    } = ctx.request.body;

    try {
        const decodedRefreshToken = await tokenLib.decodeToken(refreshToken);
        const remain = decodedRefreshToken.exp * 1000 - new Date().getTime();

        // if(decodedRefreshToken.status === 'error') {
        //     ctx.status = 500;
        //     ctx.body = {
        //         type: 'JWT error',
        //         message: decodedRefreshToken.data,
        //     };

        //     return;
        // }


        if(decodedRefreshToken.data.sub !== 'refreshToken') {
            ctx.status = 403;
            ctx.body = {
                message: 'Token is incorrect',
            };

            return;
        }

        const newAccessToken = await tokenLib.createAccessToken({
            sellerNumber: decodedRefreshToken.sellerNumber,
        });

        if(remain <= ms('30days')) {
            const newRefreshToken = await tokenLib.createRefreshToken({
                sellerNumber: decodedRefreshToken.sellerNumber,
            });

            ctx.status = 200;
            ctx.body = {
                message: 'Success',
                data: {
                    accessToken: newAccessToken.data,
                    refreshToken: newRefreshToken.data,
                },
            };

            return;
        }

        ctx.status = 200;
        ctx.body = {
            message: 'Success',
            data: {
                accessToken: newAccessToken.data,
            },
        };

        return;
    } catch (error) {
        let status = null;
        let message = null;

        switch(error.message) {
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

        if (status === 500) {
            throw error;
        }

        ctx.status = status;
        ctx.body = {
            message,
        };

        return;
    }
};

export {
    refresh,
};