import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const uploadFile = async (file, path) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path,
        Body: file,
    };

    try {
        return await s3.upload(params).promise();
    } catch (error) {
        throw error;
    }
}

const readFile = async key => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    try {
        return await s3.getObject(params).promise();
    } catch (error) {
        throw error;
    }
}

export {
    uploadFile,
    readFile,
}