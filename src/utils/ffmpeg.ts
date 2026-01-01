// Configure FFmpeg path - use ffmpeg-static if system FFmpeg is not available
import ffmpegStatic from 'ffmpeg-static';

export function setupFFmpeg(): void {
    if (ffmpegStatic && !process.env.FFMPEG_PATH) {
        process.env.FFMPEG_PATH = ffmpegStatic;
    }
}
