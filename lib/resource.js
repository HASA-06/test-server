import fs from 'fs';
import path from 'path';
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg';

import * as awsS3 from './aws.s3.js';

const uploadImage = async (file, name, type) => {
    return await awsS3.uploadFile(
        fs.createReadStream(file.path),
        `${process.env.NODE_ENV}/image/${type}/${name}`,
    );
};

const resizeImage = async (name, type) => {
    try {
        const originalKey = `${process.env.NODE_ENV}/image/${type}/${name}`;
        const directoryPath = `${process.env.NODE_ENV}/image/${type}`;

        const image = await awsS3.readFile(originalKey);

        const filePath = `upload\\image${path.extname(originalKey)}`;

        if(!fs.existsSync('upload')) {
            fs.mkdirSync('upload');
        }

        fs.writeFileSync(filePath, image.Body);

        sharp.cache(false);
        const fileData = await sharp(filePath).metadata();
        
        await sharp(filePath).resize(fileData.width < fileData.height ? { width: 480 } : { height: 480 })
            .toFile('upload\\resized.jpg');
        await awsS3.uploadFile(
            fs.createReadStream('upload\\resized.jpg'),
            `${directoryPath}/${name.split('.')[0]}_thumbnail.jpg`,
        );
    } catch (error) {
        throw error;
    }
};

const uploadVideo = async (file, name, type) => {
    return await awsS3.uploadFile(
        fs.createReadStream(file.path),
        `${process.env.NODE_ENV}/video/${type}/${name}/original${path.extname(file.name).toLowerCase()}`,
    );
};

const formatVideo = async (filePath, directoryPath, size, width, height, duration) => {
    try {
        return await Promise.all([
            new ffmpeg({ source: filePath })
                .withVideoCodec('libx264')
                .size(width < height ? `${size}x?` : `?x${size}`)
                .saveToFile(`upload\\${size}.mp4`)
                .on('error', error => {
                    throw error;
                })
                .on('end', async () => {
                    await awsS3.uploadFile(
                        fs.createReadStream(`upload\\${size}.mp4`),
                        `${directoryPath}/${size}.mp4`,
                    );
                }),
            new ffmpeg({ source: filePath })
                .noAudio()
                .withVideoCodec('libx264')
                .size(width < height ? `${size}x?` : `?x${size}`)
                .setDuration(duration >= 3 ? 3 : duration)
                .saveToFile(`upload\\${size}_short.mp4`)
                .on('error', error => {
                    throw error;
                })
                .on('end', async () => {
                    await awsS3.uploadFile(
                        fs.createReadStream(`upload\\${size}_short.mp4`),
                        `${directoryPath}/${size}_short.mp4`,
                    );
                }),
            new ffmpeg({ source: filePath })
                .screenshots({
                    timestamps: [0],
                    filename: `upload/${size}.jpg`,
                    size: width < height ? `${size}x?` : `?x${size}`,
                })
                .on('error', error => {
                    throw error;
                })
                .on('end', async () => {
                    await awsS3.uploadFile(
                        fs.createReadStream(`upload\\${size}.jpg`),
                        `${directoryPath}/${size}.jpg`,
                    );
                }),
        ]);
    } catch (error) {
        throw error;
    }
};

const resizeVideo = async (name, type) => {
    const originalKey = `${process.env.NODE_ENV}/video/${type}/${name}/original.mp4`;
    const directoryPath = `${process.env.NODE_ENV}/video/${type}/${name}`

    console.log(originalKey);

    try {
        const video = await awsS3.readFile(originalKey);
        const filePath = `upload\\video${path.extname(originalKey)}`;

        if(!fs.existsSync('upload')) {
            fs.mkdirSync('upload');
        }

        fs.writeFileSync(filePath, video.Body);

        ffmpeg.ffprobe(filePath, async (err, metadata) => {
            if(err) {
                throw err;
            }

            await Promise.all([
                formatVideo(
                    filePath,
                    directoryPath,
                    360,
                    metadata.streams[0].width,
                    metadata.streams[0].height,
                    metadata.format.duration,
                ),
                formatVideo(
                    filePath,
                    directoryPath,
                    480,
                    metadata.streams[0].width,
                    metadata.streams[0].height,
                    metadata.format.duration,
                ),
            ]);
        });
    } catch (error) {
        throw error;
    }
};

export {
    uploadImage,
    resizeImage,
    uploadVideo,
    resizeVideo,
};