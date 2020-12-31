import baseModel from '../../../models/index.js';
import crypto from 'crypto';

export const signUp = async ctx => {
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
}

export const signIn = async ctx => {
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
            ctx.status = 200;
            ctx.body = {
                message: 'Success',
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
}