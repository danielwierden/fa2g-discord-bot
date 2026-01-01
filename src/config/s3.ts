import { S3Client } from '@aws-sdk/client-s3';
import { getS3Config } from './env.ts';

const config = getS3Config();

export const s3Client = new S3Client({
    region: 'auto',
    endpoint: config.endpoint,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
    },
});

export const s3Bucket = config.bucket;
