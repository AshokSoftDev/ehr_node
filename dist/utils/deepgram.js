"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudioFromAudios = transcribeAudioFromAudios;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DEEPGRAM_API_URL = process.env.DEEPGRAM_API_URL || 'https://api.deepgram.com/v1/listen';
const mimeByExt = {
    wav: 'audio/wav',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    mp4: 'audio/mp4',
    webm: 'audio/webm',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
};
const resolveMime = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    return mimeByExt[ext] ?? 'application/octet-stream';
};
/**
 * Transcribe an audio file in the local /audios folder using Deepgram.
 * Requires Node 18+ (global fetch) and DEEPGRAM_API_KEY in env.
 */
async function transcribeAudioFromAudios(fileName) {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        throw new Error('DEEPGRAM_API_KEY is not set in environment variables');
    }
    const audioPath = path_1.default.join(process.cwd(), 'audios', fileName);
    const audioBuffer = await fs_1.default.promises.readFile(audioPath);
    const contentType = resolveMime(fileName);
    const res = await fetch(DEEPGRAM_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Token ${apiKey}`,
            'Content-Type': contentType,
        },
        body: audioBuffer,
    });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Deepgram request failed (${res.status}): ${body}`);
    }
    const json = (await res.json());
    const transcript = json?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
    return transcript;
}
