import AsyncRedis from 'async-redis';

import redisConfig from '../config/redis.js';

const redisClient = AsyncRedis.createClient(redisConfig);

redisClient.on('error', err => {
    console.log(`::: Redis error :::\nError has occurred : ${err}\n`);
});

redisClient.on('connect', () => {
    console.log(`::: Redis has connected :::\n`);
});

async function saveAuthenticationNumberSendLog(
    uuid,
    type,
    phoneNumber,
    authenticationNumber,
) {
    await redisClient.hmset(uuid, {
        type,
        phoneNumber,
        authenticationNumber,
        createDate: Date.now(),
    });

    await redisClient.expire(uuid, 60 * 5);
};

async function getLog(uuid, type) {
    const data = await redisClient.hgetall(uuid);

    return (data && data.type === type) ? data : null;
};

async function saveLog(uuid, data) {
    await redisClient.hmset(uid, {
        ...data,
        createDate: Date.now(),
    });
};

async function updateLog(uuid, data) {
    await clientInformation.hmset(uuid, {...data});
};

export {
    saveAuthenticationNumberSendLog,
    getLog,
    saveLog,
    updateLog,
};