import axios from 'axios';
import crypto from 'crypto';

async function generateAuthenticationNumber() {
    let code = '';

    for (let i = 0; i < 6; i += 1) {
        code += Math.floor(Math.random() * 10).toString();
    }

    return code;
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

async function smsSend(uuid, phoneNumber) {
    const authenticationNumber = await generateAuthenticationNumber();
    const serviceId = process.env.SENS__SERVICE_ID
    const url = `/sms/v2/services/${serviceId}/messages`; 
    const timestamp = new Date().getTime().toString();
    const signingKey = await generateSigningKey('POST', url, timestamp, process.env.SENS__ACCESS_KEY, SENS__SECRET_KEY);

    if(signingKey.type === 'error') {
        return {
            status: 'error',
            data: signingKey.data,
        };
    }

    const requestData = {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.SENS__COMPANY_NUMBER,
        content: `안녕하세요 미쁘입니다.\n5분 이내에 인증번호 6자리 숫자 ${authenticationNumber} 를 입력해 주세요.`,
        messages: [
            {
                to: phoneNumber,
            },
        ],
    };

    try {
        await axios.post(
            `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'x-ncp-apigw-timestamp': timestamp,
                    'x-ncp-iam-access-key': process.env.SENS__ACCESS_KEY,
                    'x-ncp-apigw-signature-v2': signingKey.data,
                },
            },
        );

        return {
            status: 'success',
            data: {
                authenticationNumber: authenticationNumber,
            },
        };
    } catch (error) {
        return {
            status: 'error',
            data: error,
        };
    }
}

export {
    smsSend,
};