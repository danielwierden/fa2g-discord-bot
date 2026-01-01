export function validateEnv(): { token: string; clientId: string } {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!token || !clientId) {
        throw new Error('DISCORD_TOKEN or DISCORD_CLIENT_ID is not set');
    }

    return { token, clientId };
}

export function getS3Config(): {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
} {
    return {
        endpoint: process.env.S3_ENDPOINT as string,
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
        bucket: process.env.S3_BUCKET as string,
    };
}

export function getDatabaseUrl(): string {
    return process.env.DATABASE_URL!;
}

export function getDokployConfig(): {
    apiBaseUrl: string;
    apiKey: string;
    csServerAppId: string;
} {
    return {
        apiBaseUrl: process.env.DOKPLOY_API_BASE_URL as string,
        apiKey: process.env.DOKPLOY_API_KEY as string,
        csServerAppId: process.env.DOKPLOY_CS_SERVER_APP_ID as string,
    };
}
