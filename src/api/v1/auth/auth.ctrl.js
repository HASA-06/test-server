import baseModel from '../../../../models/index.js';

import * as redisLib from '../../../../lib/redis.js';
import * as sensLib from '../../../../lib/sens.js';
import * as tokenLib from '../../../../lib/token.js';

import crypto from 'crypto';

const signUp = async ctx => {
    const {
        email,
        password,
        passwordCheck,
    } = ctx.request.body;

    if (email === undefined || password === undefined || password != passwordCheck) {
        ctx.status = 400;
        ctx.body = {
            type : 'User Error',
            message: 'Missing field something',
        };

        return;
    }

    const salt = crypto.randomFillSync(Buffer.alloc(64)).toString('hex');
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');

    try {
        const [data, created] = await baseModel.User.findOrCreate({
            where: { email: email },
            defaults: {
                number: null,
                password: hashedPassword,
                salt: salt,
            }
        });
        
        if(created) {
            ctx.status = 200;
            ctx.body = {
                message : 'Success',
            };

            return;
        } else {
            ctx.status = 409;
            ctx.body = {
                errorType: 'USER_ERROR',
                message: 'Email has already registered'
            };

            return;
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            errorType: 'SERVER_ERROR',
            message: error.message,
        };

        throw error;
    }
};

const signIn = async ctx => {
    const {
        email,
        password,
    } = ctx.request.body;

    if (email === undefined || password === undefined) {
        ctx.status = 400;
        ctx.body = {
            type : 'User Error',
            message: 'Missing field something',
        };

        return;
    }

    try {
        const data = await baseModel.User.findOne({
            where: {
                email,
            }
        });

        if(!data) {
            ctx.status = 400;
            ctx.body = {
                type: 'UserError',
                message: 'No user with this email',
            };

            return;
        } 

        const savedPassword = crypto.scryptSync(password, data.dataValues.salt, 64).toString('hex');

        if(savedPassword === data.dataValues.password) {
            const accessToken = await tokenLib.createAccessToken({
                sellerNumber: data.dataValues.number,
            });

            const refreshToken = await tokenLib.createRefreshToken({
                sellerNumber: data.dataValues.number,
            });

            if(accessToken.status === 'error' || refreshToken.status === 'error') {
                ctx.status = 500;
                ctx.body = {
                    type: 'JWT error',
                    message: accessToken.status === 'error' ? accessToken.data : refreshToken.data,
                };

                return;
            }
            
            ctx.status = 200;
            ctx.body = {
                message: 'Success',
                data: {
                    accessToken: accessToken.data,
                    refreshToken: refreshToken.data,
                },
            };

            return;
        } else {
            ctx.status = 400;
            ctx.body = {
                type: 'UserError',
                message: 'Password is not equal'
            };

            return;
        }
    } catch(error) {
        ctx.status = 500;
        ctx.body = {
            errorType: 'SERVER_ERROR',
            message: error.message,
        };

        throw error;
    }
};

const smsSend = async ctx => {
    const {
        uuid, phoneNumber
    } = ctx.request.body;

    try {
        const log = await redisLib.getLog(uuid, process.env.NODE_ENV);
        
        if(log) {
            ctx.status = 400;
            ctx.body = {
                type: 'Duplicate error',
                message: 'UUID is Already exists',
            };

            return;
        }

        const smsSendResult = await sensLib.smsSend(uuid, phoneNumber);

        if(smsSendResult.status !== 'success') {
            ctx.status = 500;
            ctx.body = {
                type: 'Sens error',
                message: smsSendResult.data,
            };

            return;
        }

        await redisLib.saveAuthenticationNumberSendLog(
            uuid,
            process.env.NODE_ENV,
            phoneNumber,
            smsSendResult.data.authenticationNumber,
        );
            
        ctx.status = 200;
        ctx.body = {
            message: 'Success',
        };

        return;
    } catch(error) {
        ctx.status = 500;
        ctx.body = {
            type: 'Server error',
            message: error.message,
            other: error,
        };

        return;
    }
};

const smsCheck = async ctx => {
    const {
        uuid,
        authenticationNumber
    } = ctx.request.body;

    try {
        const log = await redisLib.getLog(uuid, process.env.NODE_ENV);

        if (!log) {
            ctx.status = 404;
            ctx.body = {
                type: 'No resource error',
                message: 'Not published authorization number'
            };

            return;
        }

        if(log.authenticationNumber === authenticationNumber) {
            ctx.status = 200;
            ctx.body = {
                message: 'Success',
            };

            return;
        }

        ctx.status = 401;
        ctx.body = {
            type: 'Authentication error',
            message: 'Incorrect authentication number',
        };
    } catch (error) {
        ctx.status = 500;
        ctxx.body = {
            type: 'Server error',
            message: error.message,
        };
    }
};

async function generateSigningKey(method, url, timestamp, accessKey, secretKey) {
	const SPACE = ' ';
	const NEW_LINE = '\n';

	const message = `${method}${SPACE}${url}${NEW_LINE}${timestamp}${NEW_LINE}${accessKey}`;

    try {
        const signingKey = crypto
            .createHmac('sha256', secretKey)
            .update(message)
            .digest('base64');
        
        return {
            type: 'success',
            data: signingKey,
        };
    } catch(error) {
        return {
            type: 'error',
            data : error,
        }
    }
};

async function generateAuthenticationNumber() {
  let code = '';

  for (let i = 0; i < 6; i += 1) {
    code += Math.floor(Math.random() * 10).toString();
  }

  return code;
};

export {
    signUp,
    signIn,
    smsSend,
    smsCheck,
};